import { Eye, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import { useNavigate } from 'react-router-dom';

const PendingMosqueReview = ({ pendingMosques, setPendingMosques, setSelectedMosque, totalPages }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { mosques: allMosques } = useUserContext();
  const navigate = useNavigate();

   const isDev = import.meta.env.VITE_ENV === 'development';


const [localTotal, setLocalTotal] = useState(totalPages);

useEffect(() => {
    setLocalTotal(totalPages);
  }, [totalPages]);

  const handleViewMosque = async (mosqueId) => {
    const localMosque = allMosques?.find(m => String(m.id) === String(mosqueId));

    if (localMosque) {
      navigate(`/mosque/${mosqueId}`);
      return;
    }

    setIsNavigating(true);
    try {
      await privateAxiosInstance.get(`mosques/get-mosque/${mosqueId}`);
      navigate(`/mosque/${mosqueId}`);
    } catch (err) {
      if(isDev){
        console.error("Failed to fetch mosque details:", err?.response?.data || err);
      }
    } finally {
      setIsNavigating(false);
    }
  };

const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await privateAxiosInstance.get('mosques/get-pending-mosque', { params: { limit: 10, page: nextPage } });
      
      setPendingMosques(prev => {
        // Create a map to filter out duplicates by ID
        const combined = [...prev, ...res.data.pendingMosques];
        return Array.from(new Map(combined.map(m => [m.id, m])).values());
      });
      
      setPage(nextPage);
    } catch (err) {
      if(isDev){
        console.error("Failed to load more mosques:", err?.response?.data || err);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-900 mb-4">Pending Mosques Review</h2>
      
      {pendingMosques && pendingMosques.length > 0 ? (
        <>
          {pendingMosques.map(mosque => (
            <div key={mosque.id} className="flex justify-between py-3 border-b last:border-0 border-gray-50">
              <span className="text-sm font-bold text-slate-700 truncate">{mosque.name}</span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedMosque(mosque)} 
                  className="text-emerald-700 font-bold text-xs hover:text-emerald-900 transition-colors"
                >
                  <Eye />
                </button>
                <button 
                  onClick={() => handleViewMosque(mosque.id)}
                  disabled={isNavigating}
                  className="text-emerald-700 font-bold text-xs hover:text-emerald-900 transition-colors"
                >
                  {isNavigating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Review"}
                </button>
              </div>
            </div>
          ))}
          
          {page < localTotal && (
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors flex justify-center items-center"
            >
              {loadingMore ? <Loader2 className="animate-spin w-4 h-4" /> : "Load More"}
            </button>
           )}
        </>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400 italic">No pending mosques to review.</p>
        </div>
      )}
    </div>
  );
};

export default PendingMosqueReview;