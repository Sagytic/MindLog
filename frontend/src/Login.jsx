import { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 1. Django에게 ID/PW를 주고 "티켓(Token)"을 요청
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: username,
        password: password,
      });

      // 2. 성공하면 티켓을 받음
      const { access, refresh } = response.data;
      
      // 3. 브라우저 금고(localStorage)에 티켓 저장 (ABAP SET PARAMETER ID와 비슷)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // 4. 상위 컴포넌트(App.jsx)에 "로그인 성공했어!"라고 알림
      onLoginSuccess();

    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호를 확인해주세요!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">로그인</h2>
        
        <input
          type="text"
          placeholder="아이디"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // 엔터키 처리
        />
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-bold"
        >
          로그인 하기
        </button>
      </div>
    </div>
  );
}

export default Login;