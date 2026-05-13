import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import publicAxiosInstance from '../../auth/publicAxiosInstance';

export default function Qiuran() {
  const [query, setQuery] = useState('');
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    publicAxiosInstance.get('/quran/surahs')
      .then(res => {
        let arr = [];
        if (Array.isArray(res.data)) arr = res.data;
        else if (Array.isArray(res.data.surahs)) arr = res.data.surahs;
        else if (Array.isArray(res.data.data)) arr = res.data.data;
        setSurahs(arr);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load surahs');
        setLoading(false);
      });
  }, []);

  const filtered = Array.isArray(surahs) ? surahs.filter(
    s =>
      s.name.includes(query) ||
      s.transliteration.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24 pt-20">
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-emerald-700">قائمة السور</h1>
        <input
          type="text"
          placeholder="ابحث عن سورة..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400"
        />
        {loading && <div className="text-center text-gray-500 py-8">جاري التحميل...</div>}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}
        <div className="space-y-3">
          {!loading && !error && filtered.map(surah => (
            <button
              key={surah.id}
              onClick={() => navigate(`/surah/${surah.id}`)}
              className="w-full flex flex-col items-end p-4 bg-white rounded-xl shadow hover:shadow-lg border-l-4 border-emerald-500 hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label={`افتح سورة ${surah.transliteration}`}
            >
              <span className="text-xl font-bold text-emerald-700">{surah.name}</span>
              <span className="text-gray-600 text-sm">{surah.transliteration}</span>
              <span className="text-gray-400 text-xs mt-1">{surah.type === 'meccan' ? 'مكية' : 'مدنية'} - {surah.total_verses} آية</span>
            </button>
          ))}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-8">لا توجد نتائج</div>
          )}
        </div>
      </div>
    </div>
  );
}
