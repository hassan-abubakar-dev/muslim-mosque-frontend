import { useParams, useLocation, useNavigate } from 'react-router-dom';
import MosqueProfile from './MosqueProfile';
import mockNotifications from './notificationsData';

const NotificationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const mosque = location?.state?.mosqueFromState || null;
  const backPath = id
    ? `/mosque/${id}`
    : location?.state?.mosqueId
    ? `/mosque/${location.state.mosqueId}`
    : '/';

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
          {mockNotifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
