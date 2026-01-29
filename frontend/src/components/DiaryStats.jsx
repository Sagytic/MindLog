import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#60A5FA', '#F87171', '#FBBF24', '#34D399', '#A78BFA', '#9CA3AF'];

const DiaryStats = ({ diaries }) => {
  const chartInfo = useMemo(() => {
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
  }, [diaries]);

  return (
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
                {/* ★ AI 분석 요약 섹션 */}
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
  );
};

export default DiaryStats;
