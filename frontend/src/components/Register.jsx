import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // [추가] 예쁜 팝업 라이브러리

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // [수정] 비밀번호 불일치 경고
      Swal.fire({
        icon: 'warning',
        title: '비밀번호가 달라요',
        text: '비밀번호 확인란을 다시 입력해주세요.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/diaries/register/", {
        username,
        password,
      });
      
      // [수정] 가입 성공 팝업 -> 확인 누르면 로그인 화면으로 이동
      Swal.fire({
        icon: 'success',
        title: '회원가입 성공!',
        text: '이제 로그인을 해주세요.',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
            onRegisterSuccess(); // 팝업 닫힌 후 이동
        }
      });

    } catch (error) {
      console.error(error);
      // [수정] 가입 실패 팝업
      Swal.fire({
        icon: 'error',
        title: '가입 실패',
        text: '이미 존재하는 아이디일 수 있습니다.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">회원가입</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="아이디"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 transition mt-2"
          >
            가입하기
          </button>
        </form>
        
        {/* 로그인 화면으로 돌아가는 버튼 */}
        <div className="mt-4 text-center">
          <button 
            onClick={onSwitchToLogin}
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;