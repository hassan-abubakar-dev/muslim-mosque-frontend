import { useState, useEffect } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';

export default function Adzkar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('ar'); // default Arabic

  // keep per-item click counts in-memory only (reset on refresh)
  const [counts, setCounts] = useState({});

  // Fetch from backend and fall back to mock data
  useEffect(() => {
    setLoading(true);
    publicAxiosInstance.get('/adzkar/get-all')
      .then(res => {
        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (Array.isArray(res.data.adhkar)) data = res.data.adhkar;
        else if (Array.isArray(res.data.data)) data = res.data.data;
        else if (res.data && Array.isArray(res.data.items)) data = res.data.items;
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch adhkar:', err);
        setError('Failed to load adhkar from server — showing local data.');
        setItems('');
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(item => {
    if (lang === 'en') return item.languages && item.languages.en;
    return item.languages && item.languages.ar;
  });

  const getItemKey = (item, idx) => (item.order ?? item.id ?? idx).toString();

//   const parseArabicIndic = (s) => {
//     if (!s) return null;
//     // map Arabic-Indic digits to latin digits
//     const map = { '٠': '0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
//     return s.replace(/[٠-٩]/g, d => map[d]);
//   };

//   const parseCountDescription = (desc) => {
//     if (!desc) return null;
//     const lower = desc.toLowerCase();
//     // common english words
//     if (lower.includes('once') || lower.includes('one') || lower.includes('1')) return 1;
//     if (lower.includes('twice') || lower.includes('two') || lower.includes('2')) return 2;
//     if (lower.includes('three') || lower.includes('3')) return 3;
//     // try to extract western digits
//     const m = desc.match(/(\d+)/);
//     if (m) return Number(m[1]);
//     // try Arabic-Indic digits
//     const arabicReplaced = parseArabicIndic(desc);
//     const m2 = arabicReplaced.match(/(\d+)/);
//     if (m2) return Number(m2[1]);
//     // check Arabic words for 1 and 2
//     if (desc.includes('واحد') || desc.includes('مرّة') || desc.includes('مره') || desc.includes('مَرَّة')) return 1;
//     if (desc.includes('مرتين') || desc.includes('مرتان') || desc.includes('مرَتَيْن')) return 2;
//     return null;
//   };

  const getTotalForItem = (item) => {
    // Always use the numeric count field from backend
    const n = Number(item && item.count);
    return Number.isInteger(n) && n > 0 ? n : 1;
  };

  const handleTap = (item, idx) => {
    const key = getItemKey(item, idx);
    const total = getTotalForItem(item);
    const current = Number(counts[key] || 0);
    if (current >= total) return; // already completed
    const next = current + 1;
    setCounts(prev => ({ ...prev, [key]: next }));
  };

  const remainingFor = (item, idx) => {
    const key = getItemKey(item, idx);
    const total = getTotalForItem(item);
    const clicked = Number(counts[key] || 0);
    return Math.max(total - clicked, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-emerald-700 mb-4 text-center">Adhkar & Dua</h1>

        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setLang('ar')}
            className={`px-4 py-2 rounded-full ${lang === 'ar' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
            Arabic</button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-full ${lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
            English</button>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-8">No entries found</div>
          )}

          {filtered.map((item, idx) => {
            const remaining = remainingFor(item, idx);
            const completed = remaining === 0;
            return (
              <article key={item.order || item.id || idx} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">#{item.order ?? item.id ?? (idx + 1)} • {getTotalForItem(item)}×</div>
                  {item.audio && <audio controls src={item.audio} className="w-44" />}
                </div>

                {/* Main content (Arabic) */}
                {item.content && (
                  <div dir="rtl" className="font-arabic text-xl text-right mb-3">{item.content}</div>
                )}

                <div className="grid gap-3 sm:grid-cols-3 items-center">
                  <div className="sm:col-span-2">
                    {/* Arabic block */}
                    {lang === 'ar' && item.languages && item.languages.ar && (
                      <section className="p-3 bg-emerald-50 rounded">
                        <h3 className="font-semibold text-emerald-700 mb-2">Arabic</h3>
                        <div className="text-sm text-gray-700 mb-1"><strong>Count:</strong> {item.languages.ar.count_description}</div>
                        {item.languages.ar.fadl && <div className="text-sm text-gray-600 mb-1"><strong>Fadl:</strong> {item.languages.ar.fadl}</div>}
                        {item.languages.ar.source && <div className="text-sm text-gray-500"><strong>Source:</strong> {item.languages.ar.source}</div>}
                      </section>
                    )}

                    {/* English block */}
                    {lang === 'en' && item.languages && item.languages.en && (
                      <section className="p-3 bg-emerald-50 rounded">
                        <h3 className="font-semibold text-emerald-700 mb-2">English</h3>
                        {item.languages.en.translation && <div className="text-lg text-gray-800 mb-2">{item.languages.en.translation}</div>}
                        {item.languages.en.transliteration && <div className="text-sm text-gray-700 mb-1">{item.languages.en.transliteration}</div>}
                        <div className="text-sm text-gray-700 mb-1"><strong>Count:</strong> {item.languages.en.count_description}</div>
                        {item.languages.en.fadl && <div className="text-sm text-gray-600 mb-1"><strong>Fadl:</strong> {item.languages.en.fadl}</div>}
                        {item.languages.en.source && <div className="text-sm text-gray-500"><strong>Source:</strong> {item.languages.en.source}</div>}
                      </section>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => handleTap(item, idx)}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold ${completed ? 'bg-gray-300 text-gray-700' : 'bg-emerald-600 text-white'}`}>
                      {completed ? '✓' : remaining}
                    </button>
                    <div className="text-xs">
                      {completed ? (
                        <span className="text-emerald-600 font-medium">Completed</span>
                      ) : (
                        <span className="text-gray-500">Remaining</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
