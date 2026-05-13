
import Header from '../components/Header';
import MosqueListSkeleton from '../components/loadingSkeletons/MosqueListSkeleton';
import ProfileImage from '../assets/profile.jpg'
 import { MapPin } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import privateAxiosInstance from '../../auth/privateAxiosInstance';
import { UserContext } from '../context/UserContext';

const HomePage = () => {

  const [mosques, setMosques] = useState([]);
  const [mosqueLoading, setMosqueLoading] = useState(false); 
  const navigate = useNavigate();
  const isDev = import.meta.env.VITE_ENV === 'development';
  const [Error, setError] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const fetchMosques = async() => {
    setMosqueLoading(true)
    try{
      const res = await publicAxiosInstance.get('/mosques/get-mosques');
      if(res.status < 400){
         setMosques(res.data.mosques);
         setError(false);
         console.log('Fetched mosques:', res.data.mosques);
      }
    }
    catch(err){
     if(isDev){
       console.log(err?.response?.data || err.message);
     }
      
    }finally{
      setMosqueLoading(false);
    }
  };

  const openMosque = (mosque) => {
    navigate(`/mosque/${mosque.id}`, {state: {mosque}});
  };

  const handleFollowMosque = async (e, mosque) => {
    e.stopPropagation(); // prevent opening mosque
    try {
      const res = await privateAxiosInstance.post(`/mosques/${mosque.id}/follow`);
      if (res.status < 400) {
        console.log('Followed successfully', res.data);
        // Optionally, update the local state to reflect the follow
      
      }
    } catch (err) {
      if (isDev) {
        console.log(err.response.data.message || err.message);
      }
    }
  };

  useEffect(() => {
    fetchMosques();
  }, []);

 
  

if(mosqueLoading){
  return <MosqueListSkeleton />
}else{
  
    return (
        <div className="min-h-screen pb-20">
          <main className="max-w-6xl mx-auto p-6 pt-8 mt-20">
          <h2 className="text-2xl font-semibold mb-4">Featured Mosques</h2>
        {Error && <Toast />}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {mosques.length > 0 && mosques.map((mosque) => (
    <div
      key={mosque.id}
      role="button"
      tabIndex={0}
      aria-label={`Open ${mosque.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { openMosque(mosque); } }}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden
                 w-full max-w-sm flex flex-col min-h-[360px] focus:outline-none focus:ring-2 focus:ring-emerald-300"
      onClick={() => openMosque(mosque)}
    >
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={mosque?.mosqueProfile?.image}
          alt={mosque.name || 'Mosque'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Top info */}
        <div>
          {/* Name + Status */}
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold text-gray-800 text-lg truncate flex-1"
              title={mosque.name}
            >
              {mosque.name}
            </h3>

            <span className="shrink-0 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              {mosque.status}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 truncate">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              {mosque.localGovernment}, {mosque.state}, {mosque.country}
            </span>
          </div>

          {/* Description (always reserve space) */}
          <p className="text-xs text-gray-500 mt-2 line-clamp-3 min-h-[3.5rem]">
            {mosque.description || ' '}
          </p>
        </div>

        {/* Bottom actions (fixed position) */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Followers */}
          <span className="text-sm text-gray-600">
            {mosque.followersCount} {mosque.followersCount > 1 ? 'followers' : 'follower'}
          </span>

          {/* Follow button or Following text */}
          {loggedInUser && loggedInUser.managedMosques?.some(m => String(m.id) === String(mosque.id)) ? (
            <span className="text-sm text-emerald-600 font-medium">
              Admin
            </span>
          ) : loggedInUser && mosque.isFollowing === 1 ? (
            <span className="text-sm text-emerald-600 font-medium">
              Following
            </span>
          ) : (
            <button
              onClick={(e) => handleFollowMosque(e, mosque)}
              className="px-6 py-1.5 rounded-md text-sm font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition cursor-pointer"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  ))}

</div>


          {/* <MosqueListSkeleton /> */}
        </main>
      </div>
    );
}
}
export default HomePage;