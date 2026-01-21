// frontend/src/components/DiaryList.jsx

import { useEffect, useState, useCallback } from 'react';
import api from '../api'; 
import Swal from 'sweetalert2'; 
import { FaTrashAlt, FaTimes, FaEdit, FaSave, FaSearch } from 'react-icons/fa'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import '../Calendar.css'; 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// [추가] 무한 스크롤 감지용 Hook
import { useInView } from 'react-intersection-observer';

const DiaryList = ({ activeTab }) => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // [추가] 페이지네이션 관련 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지?
  
  // [추가] 바닥 감지용 ref (이 요소가 화면에 보이면 다음 페이지 로딩)
  const { ref, inView } = useInView();

  const [selectedDiary, setSelectedDiary] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [editContent, setEditContent] = useState(""); 
  const [editImage, setEditImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  const COLORS = ['#60A5FA', '#F87171', '#FBBF24', '#34D399', '#A78BFA', '#9CA3AF'];

  // [1] 데이터 불러오기 함수 (탭에 따라 동작이 다름)
  const fetchDiaries = useCallback(async (reset = false) => {
    // 로딩 중이거나, 더 가져올 게 없는데 홈 탭이면 중단
    if (loading) return; 
    
    setLoading(true);
    try {
      if (activeTab === 'home') {
        // === 타임라인: 페이지네이션 적용 ===
        const currentPage = reset ? 1 : page; // 리셋이면 1페이지부터, 아니면 현재 페이지
        
        // 검색어가 있으면 ?all=true 검색 (검색은 페이징 복잡하므로 일단 전체에서 검색)
        // (제대로 하려면 백엔드 검색 API가 필요하지만, 지금은 프론트 필터링 유지를 위해 전체 로드 방식 차용 가능. 
        //  하지만 성능 최적화를 위해 일단은 검색어가 없을 때만 페이징을 적용합니다.)
        
        let url = `/api/diaries/?page=${currentPage}`;
        if (searchTerm) url = `/api/diaries/?all=true`; // 검색 시에는 전체 로드 (임시)

        const response = await api.get(url);
        
        if (searchTerm) {
             setDiaries(response.data); // 검색일 땐 덮어쓰기
             setHasMore(false);
        } else {
            // 일반 페이징 응답은 { count: 100, next: "...", results: [...] } 형태임
            // 만약 ?all=true 로 오면 그냥 배열임. 이를 구분해야 함.
            
            const newData = response.data.results ? response.data.results : response.data;
            const isLastPage = !response.data.next; // 다음 페이지 없으면 끝

            if (reset) {
                setDiaries(newData);
            } else {
                setDiaries(prev => [...prev, ...newData]); // 기존 데이터 뒤에 붙이기
            }

            setHasMore(!isLastPage); // 다음 페이지가 있으면 true
            if (!isLastPage) setPage(prev => prev + 1); // 다음 요청을 위해 페이지 번호 증가
        }

      } else {
        // === 캘린더/통계: 전체 데이터 로드 ===
        const response = await api.get('/api/diaries/?all=true');
        setDiaries(response.data); // 덮어쓰기
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // 에러 시 더 이상 로딩 시도 안 하도록 막음 (404 등)
      setHasMore(false); 
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, searchTerm]); // page는 의존성에서 빼고 내부 로직으로 관리하는 게 나을 수 있으나 일단 포함

  // [2] 탭이 바뀌거나 검색어가 바뀌면 데이터 초기화 및 재로딩
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setDiaries([]); // 깜빡임 방지 위해 초기화 (선택사항)
    
    // 비동기 함수 호출을 위해 내부에서 실행
    const initialFetch = async () => {
        // 여기서 직접 fetchDiaries(true) 호출과 유사한 로직 수행
        // state 업데이트 반영이 느리므로, fetchDiaries 로직을 분리하거나 여기서 직접 호출
        // 편의상 위 fetchDiaries 함수는 의존성 문제로 두고, 여기서 새로 작성
        
        try {
            setLoading(true);
            let url = "";
            if (activeTab === 'home' && !searchTerm) url = `/api/diaries/?page=1`;
            else url = `/api/diaries/?all=true`;
            
            const response = await api.get(url);
            const data = response.data.results ? response.data.results : response.data;
            
            setDiaries(data);
            
            if (activeTab === 'home' && !searchTerm) {
                setHasMore(!!response.data.next);
                if (response.data.next) setPage(2); // 다음은 2페이지부터
            }
        } catch(e) { console.error(e); } 
        finally { setLoading(false); }
    };
    
    initialFetch();

  }, [activeTab, searchTerm]);

  // [3] 무한 스크롤: 바닥(ref)이 보이고(inView), 홈 탭이고, 더 가져올 게 있고, 로딩 중이 아니면 실행
  useEffect(() => {
    if (inView && activeTab === 'home' && hasMore && !loading && !searchTerm) {
        // 다음 페이지 로드
        const loadMore = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/diaries/?page=${page}`);
                const newData = response.data.results;
                setDiaries(prev => [...prev, ...newData]);
                setHasMore(!!response.data.next);
                if (response.data.next) setPage(prev => prev + 1);
            } catch (e) { setHasMore(false); }
            finally { setLoading(false); }
        };
        loadMore();
    }
  }, [inView, activeTab, hasMore, loading, searchTerm, page]);


  // --- 검색 필터링 (화면에 있는 데이터 내에서) ---
  const getFilteredDiaries = () => {
    if (!searchTerm) return diaries;
    const lowerTerm = searchTerm.toLowerCase();
    // 검색 시에는 이미 ?all=true로 다 가져왔으므로 필터링만 하면 됨
    return diaries.filter(diary => 
      diary.content.toLowerCase().includes(lowerTerm) || 
      (diary.emotion && diary.emotion.includes(lowerTerm)) || 
      new Date(diary.created_at).toLocaleDateString().includes(lowerTerm) 
    );
  };
  const filteredDiaries = getFilteredDiaries();

  // --- 차트 데이터 가공 ---
  const getChartData = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30); 

    const emotionCount = {};
    let recentCount = 0; 

    diaries.forEach(diary => {
      const diaryDate = new Date(diary.created_at);
      if (diaryDate >= oneMonthAgo) {
        const emotion = diary.emotion ? diary.emotion.trim() : "기타";
        if (emotionCount[emotion]) emotionCount[emotion] += 1;
        else emotionCount[emotion] = 1;
        recentCount++;
      }
    });

    return {
      data: Object.keys(emotionCount).map((key) => ({ name: key, value: emotionCount[key] })),
      total: recentCount
    };
  };
  const chartInfo = getChartData();

  // --- 기타 핸들러 (기존 동일) ---
  const openModal = (diary, startEditing = false) => {
    setSelectedDiary(diary);
    setIsEditing(startEditing);
    setEditContent(diary.content);
    setEditImage(null);
    setUpdating(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    Swal.fire({
      title: '삭제하시겠습니까?', text: "되돌릴 수 없습니다.", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제', cancelButtonText: '취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/diaries/${id}/`);
          setDiaries(prev => prev.filter(diary => diary.id !== id));
          if (selectedDiary && selectedDiary.id === id) setSelectedDiary(null);
          Swal.fire('삭제됨', '', 'success');
        } catch (error) {
          Swal.fire('실패', '오류가 발생했습니다.', 'error');
        }
      }
    });
  };

  const handleUpdate = async () => {
    if (!editContent) return alert("내용을 입력해주세요.");
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('content', editContent);
      if (editImage) formData.append('image', editImage);
      
      const response = await api.patch(`/api/diaries/${selectedDiary.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedDiary = response.data;
      setDiaries(prev => prev.map(d => d.id === updatedDiary.id ? updatedDiary : d));
      setSelectedDiary(updatedDiary);
      setIsEditing(false);
      Swal.fire({ icon: 'success', title: '수정 완료!', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      Swal.fire('수정 실패', '잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getEmotionEmoji = (emotion) => {
    if (!emotion) return "📅"; 
    if (emotion.includes("행복") || emotion.includes("기쁨")) return "🥰";
    if (emotion.includes("슬픔") || emotion.includes("우울")) return "😭";
    if (emotion.includes("화") || emotion.includes("분노")) return "😡";
    if (emotion.includes("불안") || emotion.includes("걱정")) return "😬";
    if (emotion.includes("평온") || emotion.includes("보통")) return "🙂";
    return "📝"; 
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const diary = diaries.find(d => new Date(d.created_at).toDateString() === date.toDateString());
      if (diary) return <div className="flex flex-col items-center mt-1"><span className="text-xl">{getEmotionEmoji(diary.emotion)}</span></div>;
    }
  };

  return (
    <div className="w-full">
      {/* 1. 타임라인 (HOME) */}
      {activeTab === 'home' && (
        <>
          <div className="mb-6 relative">
            <input 
              type="text"
              placeholder="내용, 감정, 날짜로 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {filteredDiaries.length === 0 && !loading ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `'${searchTerm}'에 대한 검색 결과가 없어요.` : "아직 작성된 일기가 없어요."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredDiaries.map((diary, index) => (
                <div 
                  key={diary.id} onClick={() => openModal(diary, false)} 
                  style={{ animationDelay: `${(index % 10) * 0.1}s` }} // 애니메이션 딜레이 최적화
                  className="group w-full bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer animate-slide-up relative flex gap-5 h-40 overflow-hidden"
                >
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-bold tracking-wider uppercase">
                          {new Date(diary.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); openModal(diary, true); }} className="text-gray-400 hover:text-blue-500 p-1"><FaEdit /></button>
                          <button onClick={(e) => handleDelete(e, diary.id)} className="text-gray-400 hover:text-red-500 p-1"><FaTrashAlt /></button>
                        </div>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed line-clamp-3 font-medium">{diary.content}</p>
                    </div>
                    {(diary.advice || diary.emotion) && (
                      <div className="flex items-center gap-2 mt-2">
                        {diary.emotion && <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold border border-blue-100 dark:border-blue-800">{diary.emotion}</span>}
                      </div>
                    )}
                  </div>
                  {diary.image && (
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden self-center shadow-inner">
                       <img src={diary.image.startsWith('http') ? diary.image : `http://127.0.0.1:8000${diary.image}`} alt="썸네일" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* [추가] 무한 스크롤 트리거 요소 */}
              {activeTab === 'home' && !searchTerm && hasMore && (
                <div ref={ref} className="text-center py-6 text-gray-400">
                    <span className="animate-pulse">기록을 불러오는 중...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 2. 캘린더 (기존과 동일) */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 animate-fade-in">
           <Calendar className="w-full" locale="ko-KR" tileContent={tileContent}
             onClickDay={(date) => {
               const diary = diaries.find(d => new Date(d.created_at).toDateString() === date.toDateString());
               if (diary) openModal(diary, false);
             }}
           />
        </div>
      )}

      {/* 3. 통계 (기존과 동일) */}
      {activeTab === 'stats' && (
        <div className="animate-fade-in">
            {chartInfo.total > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">최근 30일 감정 분포</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={chartInfo.data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {chartInfo.data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-blue-50 dark:bg-indigo-900/30 p-6 rounded-2xl border border-blue-100 dark:border-indigo-800">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">💡 AI 분석 요약</h4>
                        <p className="text-blue-800 dark:text-blue-300">
                          최근 30일간 작성한 <strong>{chartInfo.total}</strong>개의 기록 중 가장 많이 느낀 감정은 
                          <strong className="text-xl mx-1">{chartInfo.data.sort((a,b) => b.value - a.value)[0]?.name || "없음"}</strong>입니다.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">최근 30일간 작성된 데이터가 없습니다.</p>
                </div>
            )}
        </div>
      )}

      {/* 모달 (기존과 동일) */}
      {selectedDiary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDiary(null)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 flex gap-2 items-center">
              {isEditing ? (
                <button onClick={handleUpdate} disabled={updating} className={`flex items-center gap-2 text-white px-4 py-2 rounded-full transition shadow-sm ${updating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}>
                  {updating ? <span className="text-sm font-bold">분석 중...</span> : <><FaSave size={16} /><span className="text-sm font-bold">저장</span></>}
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition bg-gray-100 dark:bg-gray-700 rounded-full p-2"><FaEdit size={18} /></button>
              )}
              <button onClick={() => setSelectedDiary(null)} disabled={updating} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition bg-gray-100 dark:bg-gray-700 rounded-full p-2 disabled:opacity-50"><FaTimes size={18} /></button>
            </div>
            <div className="text-center mb-6 mt-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {new Date(selectedDiary.created_at).toLocaleDateString()} {new Date(selectedDiary.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <textarea className="w-full p-4 border rounded-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 disabled:opacity-50"
                  value={editContent} onChange={(e) => setEditContent(e.target.value)} disabled={updating} />
                <div className={`border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center ${updating ? 'opacity-50' : ''}`}>
                  <p className="text-sm text-gray-500 mb-2">사진 변경 (선택)</p>
                  <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} disabled={updating}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700" />
                </div>
              </div>
            ) : (
              <>
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p className="text-lg text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-loose">{selectedDiary.content}</p>
                </div>
                {selectedDiary.image && (
                  <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                    <img src={selectedDiary.image.startsWith('http') ? selectedDiary.image : `http://127.0.0.1:8000${selectedDiary.image}`} alt="상세 이미지" className="w-full h-auto object-cover" />
                  </div>
                )}
                {(selectedDiary.advice || selectedDiary.emotion) && (
                  <div className="bg-blue-50 dark:bg-gray-900 rounded-xl p-6 border border-blue-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-2 mb-3"><span className="text-xl">🤖</span><h3 className="font-bold text-blue-900 dark:text-blue-300">AI 회고록</h3></div>
                    {selectedDiary.emotion && <div className="mb-3"><span className="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100 dark:border-gray-600 shadow-sm">{selectedDiary.emotion}</span></div>}
                    <p className="text-blue-800 dark:text-blue-100 leading-relaxed">{selectedDiary.advice}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;