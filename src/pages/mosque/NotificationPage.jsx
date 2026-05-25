import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import MosqueProfile from './MosqueProfile';


const NotificationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { followedMosques = [] } = useUserContext();

  const mosque = location?.state?.mosqueFromState || null;
  const notifications = location?.state?.notifications || [];

  const backPath = id
    ? `/mosque/${id}`
    : location?.state?.mosqueId
    ? `/mosque/${location.state.mosqueId}`
    : '/';

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-emerald-800">All Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              View the full notification list{mosque || id ? ' for this mosque' : ''}.
            </p>
          </div>
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {backPath === '/' ? 'Back to Home' : 'Back to Mosque'}
          </button>
        </div>

        {mosque && <MosqueProfile mosque={mosque} />}

        <div className="mt-8 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const mosqueData = followedMosques.find((m) => String(m.id) === String(notification.mosqueId));
              return (
                <div key={notification.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <img
                      src={mosqueData?.mosqueProfile?.image || '/'}
                      alt={mosqueData?.name || 'Mosque'}
                      className="h-14 w-14 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {mosqueData?.name || notification.mosqueId}
                        </h4>
                        <span className="text-xs text-gray-400">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No notifications found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
