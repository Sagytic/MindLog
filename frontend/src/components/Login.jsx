import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // [추가] 예쁜 팝업 라이브러리

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // [유지] 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 로딩 시작
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      
      // [수정] 성공 시 가벼운 토스트 알림 (alert 대신 사용)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: '로그인되었습니다.'
      });

      onLoginSuccess();
    } catch (error) {
      setPassword(""); // 비밀번호 비우기
      
      // [수정] 실패 시 예쁜 에러 팝업 (alert 대신 사용)
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '아이디와 비밀번호를 다시 확인해주세요.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false); // 로딩 끝 (성공하든 실패하든)
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="아이디"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border-gray-300 dark:border-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading} // 로딩 중엔 입력 막기
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white 
                       border-gray-300 dark:border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading} // 로딩 중엔 입력 막기
          />
          
          <button
            type="submit"
            disabled={loading} // 로딩 중엔 클릭 막기
            className="flex justify-center items-center bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition mt-2 disabled:bg-blue-300"
          >
            {loading ? (
              /* 로딩 스피너 SVG */
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "로그인하기"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;