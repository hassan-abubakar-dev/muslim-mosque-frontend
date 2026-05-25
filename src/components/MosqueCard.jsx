import { MapPin } from 'lucide-react';
import truncateByWords from '../util/splitWord';
import { useUserContext } from '../context/UserContext';
import ToastToCreateAccount from './ToastToCreateAccount';

const MosqueCard = ({ mosque, openMosque, handleFollowMosque, loggedInUser, followMosqueIds, setFollowMosqueIds }) => {
  
  // Dynamic follow check using the global context array
  const isFollowing = followMosqueIds.includes(String(mosque.id));

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${mosque.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { openMosque(mosque); } }}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg relative overflow-hidden w-full flex flex-col min-w-50 h-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-shadow"
      onClick={() => openMosque(mosque)}
    >
      <div className="h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={mosque?.mosqueProfile?.image}
          alt={mosque.name || 'Mosque'}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div>
          {/* Header Area */}
          <div className="flex items-start justify-between gap-4">
            <h3
              className="font-semibold text-gray-800 text-lg leading-snug text-nowrap mt-3"
              title={mosque.name}
            >
              {truncateByWords(mosque.name, 3)} 
            </h3>

            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap absolute right-0 top-[195px] hidden md:block" title={`Status: ${mosque.status}`}>
              {mosque.status}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap md:hidden mt-1" title={`Status: ${mosque.status}`}>
              {mosque.status}
            </span>
          </div>

          {/* Location Area */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 min-w-0">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="block w-full text-nowrap" title={`${mosque.localGovernment}, ${mosque.state}, ${mosque.country}`}>
              {truncateByWords(`${mosque.localGovernment}, ${mosque.state}, ${mosque.country}`, 4)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-3 text-nowrap" title={mosque.description || 'No description available.'}>
            {mosque.description ? truncateByWords(mosque.description, 10) : 'No description available.'}
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-auto pt-6 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 font-medium">
            {mosque.followersCount || 0} 
            <span className="text-gray-400 ml-1 font-normal">
              {mosque.followersCount === 1 ? 'follower' : 'followers'}
            </span>
          </div>

          <div className="flex items-center shrink-0">
  {/* Admin Check */}
  {loggedInUser && loggedInUser.managedMosques?.some((m) => String(m.id) === String(mosque.id)) ? (
    <span className="text-xs uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md font-bold">
      Admin
    </span>
  ) : (
    <>
      {/* Only show Following/Follow if NOT an Admin */}
      {loggedInUser && isFollowing && (
        <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-md">
          Following
        </span>
      )}

      {loggedInUser && !isFollowing && (
        <button
          onClick={(e) => { e.stopPropagation(); handleFollowMosque(e, mosque); }}
          className="px-5 py-1.5 rounded-md text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition cursor-pointer shadow-sm md:ml-10 sm:ml-0"
        >
          Follow
        </button>
      )}

      {!loggedInUser && (
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="px-5 py-1.5 rounded-md text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition cursor-pointer shadow-sm md:ml-10 sm:ml-0"
        >
          Follow
        </button>
      )}
    </>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default MosqueCard;