import { MapPin } from 'lucide-react';
import truncateByWords from '../util/splitWord';

const MosqueCard = ({ mosque, openMosque, handleFollowMosque, loggedInUser, followMosqueIds }) => {
  const isFollowing = followMosqueIds?.includes(String(mosque.id));

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${mosque.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { openMosque(mosque); } }}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden w-full flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-shadow"
      onClick={() => openMosque(mosque)}
    >
      {/* Image Area */}
      <div className="h-48 w-full bg-slate-100 shrink-0">
        <img
          src={mosque?.mosqueProfile?.image}
          alt={mosque.name || 'Mosque'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-gray-800 text-lg leading-snug truncate"
            title={mosque.name}
          >
            {truncateByWords(mosque.name, 3)}
          </h3>
          <span 
            className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap shrink-0" 
            title={`Status: ${mosque.status}`}
          >
            {mosque.status}
          </span>
        </div>

        {/* Location Area */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 min-w-0">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate" title={`${mosque.localGovernment}, ${mosque.state}`}>
            {truncateByWords(`${mosque.localGovernment}, ${mosque.state}`, 4)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-3 line-clamp-2" title={mosque.description}>
          {mosque.description || 'No description available.'}
        </p>

        {/* Footer Section */}
        <div className="mt-auto pt-6 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 font-medium">
            {mosque.followersCount || 0} 
            <span className="text-gray-400 ml-1 font-normal">
              {mosque.followersCount === 1 ? 'follower' : 'followers'}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            {loggedInUser && loggedInUser.managedMosques?.some((m) => String(m.id) === String(mosque.id)) ? (
              <span className="text-xs uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md font-bold">
                Admin
              </span>
            ) : (
              <>
                {loggedInUser && isFollowing && (
                  <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-md">
                    Following
                  </span>
                )}
                {(!loggedInUser || !isFollowing) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFollowMosque(e, mosque); }}
                    className="px-5 py-1.5 rounded-md text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-sm"
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