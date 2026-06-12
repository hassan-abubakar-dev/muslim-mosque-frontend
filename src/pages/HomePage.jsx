          

import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toggleMosqueFollow } from '../util/follow.js';
import MosqueCard from '../components/MosqueCard';
import MosqueListSkeleton from '../components/loadingSkeletons/MosqueListSkeleton';
import ToastToCreateAccount from '../components/ToastToCreateAccount.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [page, setPage] = useState(1);

   const isDev = import.meta.env.VITE_ENV === 'development';
  
  const { loggedInUser, fetchMosques, mosques, hasMore, isFetching, followMosqueIds, setFollowMosqueIds, fetchFollowedMosqueIds  } = useContext(UserContext);

  const openMosque = (mosque) => {
    navigate(`/mosque/${mosque.id}`, { state: { mosque } });
  };

  const [toastMessage, setToastMessage] = useState(null);

const handleFollowMosque = async (e, mosque) => {
  e.stopPropagation();

  // 1. Ensure we are working with consistent types (Strings)
  const targetId = String(mosque.id);
  
  // Call the API
  const { success, mosqueId, follow } = await toggleMosqueFollow(mosque.id);

  if (success) {
    const formattedId = String(mosqueId); // Ensure ID from API is also a string
    
    if (follow) {
      // Add to array if not already present
      setFollowMosqueIds(prev => {
        if (prev.includes(formattedId)) return prev;
        return [...prev, formattedId];
      });
    } else {
      // Remove from array
      setFollowMosqueIds(prev => prev.filter(id => id !== formattedId));
    }
  } else {
    // Show error toast if API fails
    if (isDev) {
      console.error("Failed to update follow status");
    }
  }
};



// Load more using observer
// Use a ref to track if this is the very first time the observer is running
const isObserverReady = useRef(false);

useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        // If the observer is just now being set up, ignore the first check
        if (!isObserverReady.current) {
            isObserverReady.current = true;
            return;
        }

        if (entries[0].isIntersecting && hasMore && !isFetching) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMosques(nextPage, 10, '', '', false); 
        }
    }, { threshold: 1.0 });

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
}, [hasMore, isFetching, page]); 

  // Determine the title based on what the user is looking at
const getPageTitle = () => {
  if (isFetching && mosques.length === 0) return ""; // Show nothing while loading the first time
  if (mosques.length === 0) return "No Mosques Found";
  return "Explore Mosques"; // Use this instead of "Featured Mosques"
};

  return (
    <div className="min-h-screen pb-20">

      {toastMessage && (
  <ToastToCreateAccount
    message={toastMessage}
    setMessage={setToastMessage}
  />
)}
      <main className="max-w-6xl mx-auto p-6 pt-8 ">
       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
  {getPageTitle()}
</h2>

        {/* CONDITION: Show Skeleton ONLY if we have no mosques yet and we are still fetching the first page */}
        {mosques.length === 0 && isFetching ? (
          <MosqueListSkeleton />
        ) : mosques.length === 0 && !isFetching ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg">No mosques found for your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mosques.length > 0 && mosques.map((mosque) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                openMosque={openMosque}
                handleFollowMosque={handleFollowMosque}
                loggedInUser={loggedInUser}
                followMosqueIds={followMosqueIds} 
                setFollowMosqueIds={setFollowMosqueIds}
                setToastMessage={setToastMessage}
              />
            ))}
          </div>
        )}

        {/* Sentinel div for Infinite Scroll */}
        <div ref={observerTarget} className="h-20 mt-4 flex justify-center items-center">
          {/* Only show the small spinner if we already have some mosques (don't show if skeleton is showing) */}
          {mosques.length > 0 && isFetching && (
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading...</span>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default HomePage;