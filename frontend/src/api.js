// frontend/src/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

// npm run dev (개발 모드) -> 127.0.0.1 사용
// npm run build (배포 모드) -> 43.200.54.222 사용
const BASE_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'http://43.200.54.222';

// 1. Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL, // 위에서 정한 주소를 사용
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 (갈 때)
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

// 3. 응답 인터셉터 (올 때)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(토큰 만료) 발생 시
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // 새 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 헤더 업데이트 후 원래 요청 다시 시도
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);

      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
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