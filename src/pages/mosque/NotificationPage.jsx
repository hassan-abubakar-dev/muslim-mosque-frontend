import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { Loader2 } from 'lucide-react';
import formatDate from '../../util/formatDate';

const NotificationPage = () => {
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const isInitialMount = useRef(true); // Gating the initial fetch
  
  const { 
    followedMosques = [], 
    notifications, 
    fetchNotifications, 
    isFetchingNotifications, 
    hasMoreNotifications, 
    loggedInUser
  } = useUserContext();
  const location = useLocation();

  // Initial fetch: One-time execution
  useEffect(() => {
    if (isInitialMount.current) {
      if (loggedInUser && notifications.length === 0) {
        fetchNotifications(true);
      }
      isInitialMount.current = false;
    }
  }, []); // Empty dependencies are safe now due to the Ref gate

  // Intersection Observer
  useEffect(() => {
    if (notifications.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // Safety: only trigger if visible AND we have more to load
        if (entry.isIntersecting && hasMoreNotifications && !isFetchingNotifications) {
          fetchNotifications(false);
        }
      },
      { root: null, threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMoreNotifications, isFetchingNotifications, notifications.length, fetchNotifications]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-emerald-800">Notifications</h1>
          <button
          type="button"
            onClick={() => navigate('/')}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => {
            const m = followedMosques.find((fm) => String(fm.id) === String(n.mosqueId));
            return (
              <div key={n.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={m?.mosqueProfile?.image || '/placeholder.png'} className="h-12 w-12 rounded-lg object-cover bg-slate-100" />
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

          {/* Observer Target */}
          <div ref={observerTarget} className="h-4 w-full" />
          
          {isFetchingNotifications && (
            <div className="py-4 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          )}
          
          {!isFetchingNotifications && notifications.length === 0 && (
            <p className="text-center text-gray-500 py-10">No notifications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;