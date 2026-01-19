// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import Login from './components/Login';       
import DiaryList from './components/DiaryList'; 
import Register from './components/Register';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [content, setContent] = useState("");
  
  // [추가] 이미지 파일 상태 관리
  const [image, setImage] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 초기 토큰 확인 로직 (기존 유지)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("accessToken");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
  };

  // [수정] 파일 업로드용 handleSubmit (기존 스피너/토스트 로직 100% 유지)
  const handleSubmit = async () => {
    if (!content) {
      // [유지] 빈 내용 경고 Swal
      Swal.fire({ 
        icon: 'warning', 
        title: '내용을 입력해주세요', 
        text: '오늘의 감정을 기록해볼까요?',
        confirmButtonColor: '#3085d6' 
      });
      return;
    }
    
    setLoading(true);
    try {
      // 1. 택배 상자(FormData) 만들기 (사진 전송 필수 과정)
      const formData = new FormData();
      formData.append('content', content);
      
      // 이미지가 있을 때만 상자에 담기
      if (image) {
        formData.append('image', image); 
      }

      // 2. 서버로 전송
      await axios.post('http://127.0.0.1:8000/api/diaries/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 3. 초기화 및 갱신
      setContent("");
      setImage(null); // 전송 후 이미지 초기화
      setRefreshKey(prev => prev + 1); 
      
      // [유지] 성공 토스트 알림
      const Toast = Swal.mixin({
        toast: true, 
        position: 'top-end', 
        showConfirmButton: false,
        timer: 3000, 
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
      Toast.fire({ 
        icon: 'success', 
        title: '일기가 성공적으로 기록되었어요!' 
      });

    } catch (error) {
      console.error(error);
      // [유지] 에러 알림 Swal
      Swal.fire({ 
        icon: 'error', 
        title: '저장 실패', 
        text: '잠시 후 다시 시도해주세요.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // [추가] 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen w-full flex flex-col items-center p-6 transition-colors duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="w-full max-w-3xl">
          {/* 상단바 (기존 유지) */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📖 MindLog</h1>
            <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                {darkMode ? "🌞" : "🌙"}
              </button>
              {isLoggedIn && (
                <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 underline text-sm">
                  로그아웃
                </button>
              )}
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <div className="mb-10 p-6 rounded-xl shadow-md transition-colors duration-300 bg-white dark:bg-gray-800">
                <textarea 
                  className="w-full p-4 border rounded-lg h-32 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
                  placeholder="오늘 하루는 어떠셨나요?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                {/* [추가] 이미지 파일 입력창 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📸 사진 추가하기
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                  />
                </div>

                {/* [유지] 스피너가 적용된 작성 버튼 */}
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300 font-bold flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>업로드 중...</span>
                    </>
                  ) : "오늘 기록 남기기"}
                </button>
              </div>
              <DiaryList refreshTrigger={refreshKey} />
            </>
          ) : isRegisterMode ? (
            <Register onRegisterSuccess={() => setIsRegisterMode(false)} onSwitchToLogin={() => setIsRegisterMode(false)} />
          ) : (
            <div>
              <Login onLoginSuccess={handleLoginSuccess} />
              <div className="mt-4 text-center">
                <button onClick={() => setIsRegisterMode(true)} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                  계정이 없으신가요? 회원가입
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;