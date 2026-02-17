import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';

export default function Surah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    publicAxiosInstance.get(`/quran/surahs/${id}`)
      .then(res => {
        console.log('res.data', res.data);
        
        setSurah(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.response || err, 'error surajh');
        
        setError('Failed to load surah');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">جاري التحميل...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!surah) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">السورة غير موجودة</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24 pt-20">
      <div className="max-w-xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          رجوع
        </button>
        <h1 className="text-2xl font-bold text-emerald-700 mb-2 text-right">{surah.name}</h1>
        <div className="text-gray-600 text-right mb-4">{surah.transliteration} <span className="text-xs">({surah.type === 'meccan' ? 'مكية' : 'مدنية'})</span></div>
        <div className="space-y-4">
          {Array.isArray(surah.verses) && surah.verses.length > 0 ? (
            surah.verses.map(verse => (
              <div key={verse.id} className="bg-white p-4 rounded-xl shadow border-r-4 border-emerald-500 text-right">
                <span className="text-emerald-700 font-bold">{verse.id}.</span>
                <span className="mx-2 font-arabic text-lg">{verse.text}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">لا توجد آيات</div>
          )}
        </div>
      </div>
    </div>
  );
}
