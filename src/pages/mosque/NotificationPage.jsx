import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import MosqueProfile from './MosqueProfile';
import { Loader2 } from 'lucide-react';
import formatDate from '../../util/formatDate';

const NotificationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [page, setPage] = useState(1);
  
  const { 
    followedMosques = [], 
    notifications, 
    fetchNotifications, 
    isFetchingNotifications, 
    hasMoreNotifications 
  } = useUserContext();

  const mosque = useMemo(() => {
    return followedMosques.find(m => String(m.id) === String(id)) || null;
}, [followedMosques, id]);


  const backPath = id ? `/mosque/${id}` : '/';

  // Initial fetch on mount
  useEffect(() => {
    // If coming from dropdown, state already has notifications. 
    // If direct navigation, fetch them.
    if (!notifications || notifications.length === 0) {
      fetchNotifications(1, 20, true);
    }
  }, []);

  // Intersection Observer to detect scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreNotifications && !isFetchingNotifications) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNotifications(nextPage, 20, false);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMoreNotifications, isFetchingNotifications, page]);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-emerald-800">All Notifications</h1>
          </div>
          <button
            onClick={() => navigate(backPath)}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Back
          </button>
        </div>

        {mosque && <MosqueProfile mosque={mosque} />}

        <div className="mt-8 space-y-4">
          {notifications.map((n) => {
            const m = followedMosques.find((fm) => String(fm.id) === String(n.mosqueId));
            return (
              <div key={n.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={m?.mosqueProfile?.image || '/'} className="h-12 w-12 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-semibold">{m?.name || 'Mosque'}</h4>
                      <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Observer Target & Loading State */}
          <div ref={observerTarget} className="py-4 flex justify-center">
            {isFetchingNotifications && <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />}
          </div>
          
          {!isFetchingNotifications && notifications.length === 0 && (
            <p className="text-center text-gray-500">No notifications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;