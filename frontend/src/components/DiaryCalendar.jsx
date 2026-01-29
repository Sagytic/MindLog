import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Calendar.css';

const DiaryCalendar = ({ diaries, onDiaryClick }) => {
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 animate-fade-in">
      <Calendar className="w-full" locale="ko-KR" tileContent={tileContent}
        onClickDay={(date) => {
          const diary = diaries.find(d => new Date(d.created_at).toDateString() === date.toDateString());
          if (diary) onDiaryClick(diary);
        }}
      />
    </div>
  );
};

export default DiaryCalendar;
