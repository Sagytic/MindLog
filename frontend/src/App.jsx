// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import DiaryList from './components/DiaryList';
import { FaSignOutAlt } from 'react-icons/fa';
import { HiHome, HiCalendar, HiChartPie, HiMenu, HiX } from 'react-icons/hi'; 
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "사용자");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setActiveTab('home');
    setUsername("사용자");
    setIsMobileMenuOpen(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let msg = "";
    if (hour >= 5 && hour < 12) msg = "좋은 아침입니다";
    else if (hour >= 12 && hour < 18) msg = "오후도 힘내세요";
    else if (hour >= 18 && hour < 22) msg = "오늘 하루 고생하셨어요";
    else msg = "감성 충만한 밤이네요";
    
    return `${msg}, ${username}님`;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      
      {isLoggedIn ? (
        <div className="flex flex-col md:flex-row min-h-screen relative">
          
          {/* === [1] 모바일 헤더 === */}
          <header className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
             {/* [수정] 로고 클릭 시 홈으로 이동 */}
             <h1 
               onClick={() => handleTabChange('home')}
               className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 cursor-pointer select-none"
             >
               🧠 MindLog
             </h1>
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="text-gray-600 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
             >
               <HiMenu size={24} />
             </button>
          </header>

          {/* 모바일 메뉴 오버레이 */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* === [2] 사이드바 === */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:static md:inset-auto md:flex
          `}>
            <div>
              <div className="p-6 flex justify-between items-center">
                {/* [수정] 로고 클릭 시 홈으로 이동 */}
                <h1 
                  onClick={() => handleTabChange('home')}
                  className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 cursor-pointer select-none"
                >
                  🧠 MindLog
                </h1>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden text-gray-500 hover:text-red-500 transition"
                >
                  <HiX size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-2 px-4">
                <MenuItem icon={<HiHome size={20}/>} label="타임라인" isActive={activeTab === 'home'} onClick={() => handleTabChange('home')} />
                <MenuItem icon={<HiCalendar size={20}/>} label="캘린더" isActive={activeTab === 'calendar'} onClick={() => handleTabChange('calendar')} />
                <MenuItem icon={<HiChartPie size={20}/>} label="감정 통계" isActive={activeTab === 'stats'} onClick={() => handleTabChange('stats')} />
              </nav>
            </div>

            <div className="p-6 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">화면 모드</span>
                <div onClick={() => setDarkMode(!darkMode)} className={`relative w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-500 ease-in-out flex items-center justify-between px-1.5 shadow-inner border border-transparent ${darkMode ? 'bg-indigo-900 border-indigo-700' : 'bg-sky-400 border-sky-300'}`}>
                  <span className="text-xs z-0 select-none">☀️</span>
                  <span className="text-xs z-0 select-none">🌙</span>
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out z-10 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}/>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm font-medium">
                <FaSignOutAlt /> 로그아웃
              </button>
            </div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen p-4 md:p-10 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              <header className="mb-6 md:mb-10 animate-fade-in">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 leading-tight">
                  {getGreeting()} 👋
                </h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                  오늘 당신의 마음을 기록해보세요.
                </p>
              </header>
              <DiaryList activeTab={activeTab} />
            </div>
          </main>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-10">
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
}

const MenuItem = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>
    {icon}<span>{label}</span>
  </button>
);

const AuthPage = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  return (
    <>
      {isLoginView ? <Login onLoginSuccess={onLoginSuccess} /> : <Register onRegisterSuccess={() => setIsLoginView(true)} onSwitchToLogin={() => setIsLoginView(true)} />}
      {isLoginView && <div className="text-center mt-4"><button onClick={() => setIsLoginView(false)} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm underline">아직 계정이 없으신가요? 회원가입</button></div>}
    </>
  );
};

export default App;