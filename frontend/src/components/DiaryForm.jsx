// frontend/src/components/DiaryForm.jsx
import { useState } from 'react';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';

const DiaryForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // 데이터를 포장해서 부모(DiaryList)에게 전달
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    await onSubmit(formData); // 부모가 준 함수 실행

    // 초기화
    setContent("");
    setImage(null);
    setPreview(null);
    setIsSubmitting(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘 하루는 어땠나요? 당신의 이야기를 들려주세요..."
          aria-label="일기 내용"
          className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-all text-base leading-relaxed"
          disabled={isSubmitting}
        />
        {/* 이미지 미리보기 */}
        {preview && (
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
            <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setImage(null); setPreview(null); }}
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="이미지 삭제"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <label
          className="cursor-pointer text-gray-500 hover:text-blue-500 transition p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
          aria-label="이미지 업로드"
        >
          <FaImage size={20} />
          <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" disabled={isSubmitting} />
        </label>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-md
            ${!content.trim() || isSubmitting 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'}`}
        >
          {isSubmitting ? '기록 중...' : <><span className="text-sm">기록하기</span> <FaPaperPlane size={14} /></>}
        </button>
      </div>
    </form>
  );
};

export default DiaryForm;