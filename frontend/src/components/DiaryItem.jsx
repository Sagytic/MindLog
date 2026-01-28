import { memo } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// [Optimization] Wrap with React.memo to prevent unnecessary re-renders
const DiaryItem = memo(({ diary, openModal, onDelete, style }) => {
  return (
    <div
      onClick={() => openModal(diary, false)}
      style={style}
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
              <button onClick={(e) => onDelete(e, diary.id)} className="text-gray-400 hover:text-red-500 p-1"><FaTrashAlt /></button>
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
  );
});

DiaryItem.displayName = "DiaryItem";

export default DiaryItem;
