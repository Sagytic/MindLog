import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login'; // 방금 만든 로그인 화면 임포트

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 화면이 처음 켜질 때(Initialization) 실행
  useEffect(() => {
    // 1. 브라우저 금고(localStorage)에 '티켓'이 있는지 확인
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      // [중요] 앞으로 모든 axios 요청에 티켓을 붙여서 보내도록 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 로그인이 성공했을 때 실행될 함수
  const handleLoginSuccess = () => {
    const token = localStorage.getItem("accessToken");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setResult(null);
    setContent("");
  };

  const handleSubmit = async () => {
    if (!content) return;
    setLoading(true);
    try {
      // 이제 헤더에 토큰이 자동으로 붙어서 나갑니다.
      const response = await axios.post('http://127.0.0.1:8000/api/diaries/', {
        content: content
      });
      setResult(response.data);
      setContent("");
    } catch (error) {
      console.error("에러 발생:", error);
      // 401 에러(티켓 만료)면 로그아웃 처리
      if (error.response && error.response.status === 401) {
        alert("로그인이 만료되었습니다.");
        handleLogout();
      } else {
        alert("일기 저장 실패!");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- [화면 분기 로직] ---
  // 로그인이 안 되어 있으면 -> 로그인 화면 보여줌
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 로그인이 되어 있으면 -> 일기장 화면 보여줌
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative">
        
        {/* 로그아웃 버튼 (우측 상단) */}
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-red-500 underline"
        >
          로그아웃
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">📖 AI 회고 일기장</h1>
        
        <textarea 
          className="w-full p-4 border rounded-lg h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="오늘 무슨 일이 있었나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "AI가 분석 중입니다..." : "일기 저장하기"}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-700 mb-2">🤖 AI의 분석 결과</h3>
            <p className="text-sm text-gray-500 mb-4">{new Date(result.created_at).toLocaleString()}</p>
            
            <div className="mb-4">
              <span className="font-semibold text-blue-600">감정 키워드:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {result.emotion && result.emotion.split(',').map((tag, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm text-gray-600">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-blue-600">위로의 한마디:</span>
              <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.advice}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;