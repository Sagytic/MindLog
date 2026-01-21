// frontend/src/components/Login.jsx

import { useState } from 'react';
import api from '../api'; 
import Swal from 'sweetalert2'; 

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post("/api/token/", {
        username,
        password,
      });

      // [수정됨] 토큰과 함께 'username'도 저장합니다!
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("username", username); 
      
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 1500, timerProgressBar: true,
      });
      Toast.fire({ icon: 'success', title: '로그인되었습니다.' });

      onLoginSuccess();

    } catch (error) {
      console.error("로그인 에러:", error);
      setPassword(""); 
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '아이디와 비밀번호를 다시 확인해주세요.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <input
            type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <button type="submit" disabled={loading} className="flex justify-center items-center bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600 transition mt-2 disabled:bg-blue-300">
            {loading ? "로그인 중..." : "로그인하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;