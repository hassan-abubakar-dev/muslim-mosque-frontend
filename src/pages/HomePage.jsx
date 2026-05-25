          

import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toggleMosqueFollow } from '../util/follow.js';
import MosqueCard from '../components/MosqueCard';
import MosqueListSkeleton from '../components/loadingSkeletons/MosqueListSkeleton';

const HomePage = () => {
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [page, setPage] = useState(1);
  
  const { loggedInUser, fetchMosques, mosques, hasMore, isFetching, followMosqueIds, setFollowMosqueIds, fetchFollowedMosqueIds  } = useContext(UserContext);

  const openMosque = (mosque) => {
    navigate(`/mosque/${mosque.id}`, { state: { mosque } });
  };

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
    console.error("Failed to update follow status");
  }
};

  // Initial Fetch
  useEffect(() => {
    fetchMosques(1, 10, '', '', true); 
  }, []);

  // Load more
  useEffect(() => {
    if (page > 1) {
      fetchMosques(page, 10, '', '', false);
    }
  }, [page]);

  // Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    }, { threshold: 1.0 });

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-6xl mx-auto p-6 pt-8 mt-20">
        <h2 className="text-2xl font-semibold mb-4">
          {mosques.length > 0 ? "Featured Mosques" : ""}
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
            {mosques.map((mosque) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                openMosque={openMosque}
                handleFollowMosque={handleFollowMosque}
                loggedInUser={loggedInUser}
                followMosqueIds={followMosqueIds} 
                setFollowMosqueIds={setFollowMosqueIds}
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