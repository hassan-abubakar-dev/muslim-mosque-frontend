import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MosqueCard from '../components/MosqueCard';
import { UserContext } from '../context/UserContext';

const FollowingPage = () => {
  const navigate = useNavigate();
  const { followedMosques, loggedInUser, followMosqueIds } = useContext(UserContext);

  const openMosque = (mosque) => {
    if (!mosque) return;
    navigate(`/mosque/${mosque.id}`, { state: { mosque } });
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-6xl mx-auto p-6 pt-8 mt-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Following</h2>
            <p className="text-sm text-slate-500 mt-1">Your followed mosques will appear here.</p>
          </div>
        </div>

        {followedMosques?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {followedMosques.map((mosque) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                openMosque={openMosque}
                loggedInUser={loggedInUser}
                followMosqueIds={followMosqueIds}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">You are not following any mosque yet.</p>
            <p className="text-sm text-slate-500 mt-3 mb-6">
              Follow mosques on the Home page so they appear here in your Following list.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              Follow mosques
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FollowingPage;
