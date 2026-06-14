import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import { Eye, Loader2 } from 'lucide-react';
import { useUserContext } from '../../context/UserContext'; 

const SuspendedMosqueList = ({ setSelectedMosque, mosques, setMosques }) => {
  const navigate = useNavigate();
  const { mosques: allMosques } = useUserContext();

     const isDev = import.meta.env.VITE_ENV === 'development';
  
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuspended = async (pageNum, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await privateAxiosInstance.get(`/mosques/get-suspended-mosques?page=${pageNum}&limit=10`);
      const { suspendedMosques, totalPages } = res.data;

      setMosques(prev => isLoadMore ? [...prev, ...suspendedMosques] : suspendedMosques);
      setTotalPages(totalPages);
      setPage(pageNum);
    } catch (err) {
      if(isDev){
        console.error("Failed to fetch suspended mosques:", err?.response?.data || err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleViewMosque = async (mosqueId) => {
    // Check if it exists in local context/mosques state first
    const localMosque = allMosques?.find(m => String(m.id) === String(mosqueId));

    if (localMosque) {
      navigate(`/mosque/${mosqueId}`);
      return;
    }

    // Otherwise, fetch from server
    setIsNavigating(true);
    try {
      const res = await privateAxiosInstance.get(`mosques/get-mosque/${mosqueId}`);
      navigate(`/mosque/${mosqueId}`);
    } catch (err) {
      if(isDev){
        console.error("Failed to fetch mosque details:", err?.response?.data || err);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    if (mosques.length === 0) {
      fetchSuspended(1);
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-amber-900 mb-4">Suspended Mosques</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-amber-700" />
        </div>
      ) : (
        <div className="space-y-2">
          {mosques.length > 0 ? (
            <>
              {mosques.map(mosque => (
                <div key={mosque.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-bold text-slate-700 truncate">{mosque.name}</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedMosque({ ...mosque, status: 'suspended' })} 
                      className="text-amber-700 font-bold text-xs hover:text-amber-900 transition-colors"
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

              {page < totalPages && (
                <button 
                  onClick={() => fetchSuspended(page + 1, true)}
                  disabled={loadingMore}
                  className="w-full mt-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors flex justify-center"
                >
                  {loadingMore ? <Loader2 className="animate-spin w-4 h-4" /> : "Load More"}
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-4">No suspended mosques found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuspendedMosqueList;