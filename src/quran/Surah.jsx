import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import VersesLoading from './VersesLoading';
import { useRef } from 'react';

const isDev = import.meta.env.VITE_ENV === 'development';

export default function Surah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
const sentinelRef = useRef(null);

const loadingRef = useRef(false);
const hasMoreRef = useRef(true);
const surahRef = useRef(null);
const pageRef = useRef(1);



  const limit = 25;

  // fetch surah details and first page of verses
  const fetchSurahPage = async (id) => {
    try {
      setLoading(true);

      const [surahRes, versesRes] = await Promise.all([
        publicAxiosInstance.get(`/quran/surah/${id}`),
        publicAxiosInstance.get(`/quran/surah/${id}/verses?page=${1}&limit=${limit}`)
      ]);

      setSurah(surahRes.data.data);
       setHasMore(1 < versesRes.data.data.totalPages);
      setVerses(
        Array.isArray(versesRes.data?.data?.verses)
          ? versesRes.data.data.verses
          : []
      );

    } catch (err) {
      if (isDev) {
        console.error(err.response?.data || err.message);
      }
      setError('فشل في تحميل السورة');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchSurahPage(id);
    }
  }, [id]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    surahRef.current = surah;
  }, [surah]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

// load more verses for pagination    
  const loadMoreVerses = async () => {
  if (loadingRef.current || !hasMoreRef.current) return;
  if (!surahRef.current) return;

  try {
    setLoading(true);

    const nextPage = pageRef.current + 1;

    const res = await publicAxiosInstance.get(
      `/quran/surah/${surahRef.current.id}/verses?page=${nextPage}&limit=${limit}`
    );

    setVerses((prev) => [...prev, ...res.data.data.verses]);
    setPage(nextPage);
    if (isDev) {
      console.log('Total pages:', res.data.data.totalPages, 'Current page:', nextPage);
    }
    setHasMore(nextPage < res.data.data.totalPages);

  } catch (err) {
    if (isDev) {
      console.error(err);
    }
  } finally {
    setLoading(false);
  }
};


// infinite scroll with Intersection Observer
useEffect(() => {
  const target = sentinelRef.current;
  if (!target) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loadingRef.current && hasMoreRef.current) {
      loadMoreVerses();
    }
  }, {
    rootMargin: '100px'
  });

  observer.observe(target);

  return () => {
    observer.unobserve(target);
    observer.disconnect();
  };
}, [hasMore, verses]);

  if (initialLoading) {
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
        <div className="sticky top-24 z-30 bg-emerald-50/95 backdrop-blur-md -mx-4 px-4 pb-3 pt-4 mb-6 border-b border-emerald-200">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            رجوع
          </button>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-emerald-100 mb-6 text-right">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">{surah.name}</h1>
          <p className="text-gray-600 mb-2">{surah.transliteration}</p>
          <p className="text-gray-500 text-sm">
            نوع السورة: {surah.type === 'meccan' ? 'مكية' : 'مدنية'} • عدد الآيات: {surah.total_verses ?? 'غير معروف'}
          </p>
          {surah.englishName && <p className="text-gray-500 text-sm mt-2">{surah.englishName}</p>}
        </div>

        <div className="space-y-4">
          {Array.isArray(verses) && verses.length > 0 ? (
            verses.map(verse => (
              <div key={verse.id} className="bg-white p-4 rounded-xl shadow border-r-4 border-emerald-500 text-right">
                <span className="text-emerald-700 font-bold">{verse.id}.</span>
                <span className="mx-2 font-arabic text-lg">{verse.text}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">لا توجد آيات</div>
          )}
        </div>

   {/* LOADING SENTINEL */}
{hasMore && <div ref={sentinelRef} style={{ height: "20px" }} />}

     {hasMore && <VersesLoading />}
     </div>
      
    </div>
  );
}
