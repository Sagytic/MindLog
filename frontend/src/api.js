import axios from 'axios';
import Swal from 'sweetalert2';

// 1. Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: 'http://15.165.235.130', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 (갈 때): 토큰이 있으면 자동으로 헤더에 끼워넣기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 응답 인터셉터 (올 때): 에러가 401이면 토큰 갱신 시도
api.interceptors.response.use(
  (response) => {
    return response; // 성공하면 그냥 통과
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도 안 해본 요청이라면
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // "재시도 했음" 표시

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // 새 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 헤더 업데이트 후 재요청
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 리프레시 토큰도 만료되었거나 오류가 나면 -> 강제 로그아웃
        console.error("토큰 갱신 실패:", refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 화면을 새로고침해서 로그인 화면으로 보냄
        Swal.fire({
            icon: 'warning',
            title: '세션 만료',
            text: '다시 로그인해주세요.',
        }).then(() => {
            window.location.href = '/'; 
        });
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;