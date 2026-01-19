import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { FaTrashAlt, FaTimes } from 'react-icons/fa';

const DiaryList = ({ refreshTrigger }) => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get('http://127.0.0.1:8000/api/diaries/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDiaries(response.data);
      } catch (error) {
        console.error("일기 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [refreshTrigger]);

  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    Swal.fire({
      title: '삭제하시겠습니까?',
      text: "되돌릴 수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(`http://127.0.0.1:8000/api/diaries/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDiaries(prev => prev.filter(diary => diary.id !== id));
          if (selectedDiary && selectedDiary.id === id) setSelectedDiary(null);
          Swal.fire('삭제됨', '', 'success');
        } catch (error) {
          Swal.fire('실패', '오류가 발생했습니다.', 'error');
        }
      }
    });
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400 mt-10">로딩 중...</p>;

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">
        지난 기록들
      </h2>

      {diaries.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          아직 작성된 일기가 없어요.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {diaries.map((diary, index) => (
            <div 
              key={diary.id} 
              onClick={() => setSelectedDiary(diary)}
              style={{ animationDelay: `${index * 0.1}s` }} 
              // h-36: 높이 고정 (약 144px)
              className="group w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer animate-slide-up relative flex gap-4 h-36 overflow-hidden"
            >
              {/* [왼쪽: 텍스트 영역]
                 flex-1: 남은 공간 차지
                 min-w-0: ★핵심★ 이 설정이 있어야 글이 길어도 이미지를 밀어내지 않고 말줄임표(...)가 작동함
              */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                
                {/* 상단: 날짜 + 삭제버튼 + 본문 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      {new Date(diary.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(e, diary.id)}
                      className="text-gray-300 hover:text-red-500 transition p-1"
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  </div>
                  
                  {/* 본문: line-clamp-2로 2줄 넘어가면 ... 처리 */}
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed line-clamp-2 font-medium">
                    {diary.content}
                  </p>
                </div>

                {/* 하단: AI 분석 (바닥에 붙이기) */}
                {(diary.advice || diary.emotion) && (
                  <div className="bg-blue-50 dark:bg-gray-700/50 p-2 rounded-lg text-xs flex items-center gap-2 mt-2">
                    <span className="flex-shrink-0">🤖</span>
                    {diary.emotion && (
                       <span className="font-bold text-blue-600 dark:text-blue-300 flex-shrink-0 whitespace-nowrap">
                         {diary.emotion}
                       </span>
                    )}
                    {/* truncate: 1줄 넘어가면 ... 처리 */}
                    <span className="text-gray-600 dark:text-gray-300 truncate block min-w-0">
                      {diary.advice}
                    </span>
                  </div>
                )}
              </div>

              {/* [오른쪽: 이미지]
                 flex-shrink-0: 절대 찌그러지지 마라
                 w-24 sm:w-32: 모바일엔 작게(96px), PC엔 크게(128px)
              */}
              {diary.image && (
                <div className="w-24 sm:w-32 h-full flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                   <img 
                      src={diary.image.startsWith('http') ? diary.image : `http://127.0.0.1:8000${diary.image}`}
                      alt="썸네일" 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* === [상세 보기 모달] (기존 코드 유지) === */}
      {selectedDiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
             onClick={() => setSelectedDiary(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedDiary(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition bg-gray-100 dark:bg-gray-700 rounded-full p-2"
            >
              <FaTimes size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {new Date(selectedDiary.created_at).toLocaleDateString()} {new Date(selectedDiary.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-loose">
                {selectedDiary.content}
              </p>
            </div>

            {selectedDiary.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={selectedDiary.image.startsWith('http') ? selectedDiary.image : `http://127.0.0.1:8000${selectedDiary.image}`}
                  alt="상세 이미지" 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {(selectedDiary.advice || selectedDiary.emotion) && (
              <div className="bg-blue-50 dark:bg-gray-900 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-bold text-blue-900 dark:text-blue-300">AI 회고록</h3>
                </div>
                
                {selectedDiary.emotion && (
                  <div className="mb-3">
                    <span className="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100 dark:border-gray-600 shadow-sm">
                      오늘의 감정: {selectedDiary.emotion}
                    </span>
                  </div>
                )}
                
                <p className="text-blue-800 dark:text-blue-100 leading-relaxed">
                  {selectedDiary.advice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;