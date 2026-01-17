import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MosqueCard from '../components/MosqueCard';

const Mosque = () => {
  const { id } = useParams();
  const [mosque, setMosque] = useState(null);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('mosques') || '[]');
    const m = all.find(x => x.id === id);
    setMosque(m || null);

    // mock lectures
    setLectures([
      { id: 'lec-1', title: 'Introduction to Hadith', speaker: 'Sheikh A', date: '2026-01-05' },
      { id: 'lec-2', title: 'Tafsir of Surah Fatiha', speaker: 'Ustadh B', date: '2026-01-12' },
      { id: 'lec-3', title: 'Seerah Highlights', speaker: 'Dr. C', date: '2026-01-19' }
    ]);
  }, [id]);

  if (!mosque) return (
    <div className="min-h-screen flex items-center justify-center">Mosque not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 pt-28">
        <div className="mb-6">
          <MosqueCard mosque={mosque} />
        </div>

        <section>
          <h3 className="text-xl font-semibold mb-3">Lectures & Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lectures.map(l => (
              <div key={l.id} className="bg-white rounded p-4 shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{l.title}</h4>
                    <p className="text-sm text-gray-600">{l.speaker}</p>
                  </div>
                  <div className="text-sm text-gray-500">{l.date}</div>
                </div>
                <div className="mt-3">
                  <button className="bg-emerald-700 text-white px-3 py-1 rounded">View Lectures</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mosque;
