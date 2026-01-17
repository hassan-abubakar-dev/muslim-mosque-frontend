import MosqueCard from '../components/MosqueCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ensureSampleMosques = () => {
  const existing = JSON.parse(localStorage.getItem('mosques') || '[]');
  if (existing.length >= 3) return existing;

  const samples = [
    { id: 'mosq-1', name: 'Al-Noor Mosque', country: 'Egypt', city: 'Cairo', description: 'Community mosque with regular lectures.', is_verified: true },
    { id: 'mosq-2', name: 'Ibn Al-Qayyim Centre', country: 'Nigeria', city: 'Lagos', description: 'Active educational programs and youth lectures.', is_verified: false },
    { id: 'mosq-3', name: 'Fatih Islamic Center', country: 'Turkey', city: 'Istanbul', description: 'Historic mosque with weekly guest scholars.', is_verified: true }
  ];

  const merged = [...samples, ...existing].slice(0, 6);
  localStorage.setItem('mosques', JSON.stringify(merged));
  return merged;
};

const Homepage = () => {
    const [mosques, setMosques] = useState([]);

    useEffect(() => {
      const list = ensureSampleMosques();
      setMosques(list.slice(0,3));
    }, []);

      const navigate = useNavigate();
      const openMosque = (id) => navigate(`/mosque/${id}`);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto p-6 pt-8 mt-20">
          <h2 className="text-2xl font-semibold mb-4">Featured Mosques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mosques.map(m => (
              <div key={m.id} onClick={() => openMosque(m.id)}>
                <MosqueCard mosque={m} />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
}

export default Homepage;