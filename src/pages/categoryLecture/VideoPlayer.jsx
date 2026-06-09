import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Download } from "lucide-react";
import DownloadConfirmationModal from "../../components/DownloadConfirmationModal.jsx";
import { lectureUtils } from "../../util/lectureActions.js";

const isDev = import.meta.env.VITE_ENV === 'development';

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isLibraryMutating, setIsLibraryMutating] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const playerRef = useRef(null);

  const lecture = location.state?.lecture || null;
  const bookmarkTime = Math.floor(lecture?.lastPosition || 0);

  useEffect(() => {
    // 1. Load YouTube API script if not present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // 2. Define Initialization
    const initPlayer = () => {
      if (playerRef.current) return; // Prevent double init

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: lecture?.videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          'onReady': (event) => {
            if (isDev) {
              console.log("Player READY. Seeking to:", bookmarkTime);
            }
            if (bookmarkTime > 0) {
              event.target.seekTo(bookmarkTime, true);
            }
            event.target.playVideo();
          },
          'onError': (e) => console.error("YT Error:", e.data)
        }
      });
    };

    // 3. Handle Timing
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // 4. Cleanup
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [lecture?.videoId]);

  // Seeker Effect
  useEffect(() => {
    if (playerRef.current?.seekTo && bookmarkTime > 0) {
      playerRef.current.seekTo(bookmarkTime, true);
    }
  }, [bookmarkTime]);

  // Add this effect to initialize the bookmark state when the lecture data arrives
// Update this specific useEffect
useEffect(() => {
  if (lecture) {
    // 1. Check if we arrived from the bookmark page (fromBookmark = true)
    // 2. OR check if the data itself indicates it's bookmarked
    const fromBookmark = location.state?.fromBookmark || false;
    const isCurrentlyBookmarked = 
      fromBookmark || 
      (lecture.bookmarks && lecture.bookmarks.length > 0) || 
      (lecture.lastPosition > 0);

    setIsBookmarked(isCurrentlyBookmarked);
  }
}, [lecture, location.state?.fromBookmark]); // Added fromBookmark to dependencies

  
  const handleBookmarkClick = async () => {
    if (!lecture || !playerRef.current?.getCurrentTime) return;
    const currentTime = Math.floor(playerRef.current.getCurrentTime());
    setIsBookmarked(!isBookmarked);
    try {
      await lectureUtils.toggleBookmark(lecture.id, currentTime);
      if(location.state?.fromBookmark) {
        navigate(-1);
      };
    
    } catch (err) {
      setIsBookmarked(isBookmarked);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-28 mb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{lecture?.title || "Untitled Lecture"}</h2>
          <button onClick={() => navigate(-1)} className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200">Back</button>
        </div>

        {/* Placeholder for YouTube API Injection */}
        <div id="youtube-player" className="aspect-video bg-black rounded-md overflow-hidden shadow-inner">
          {/* YT API will inject the iframe here */}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={handleBookmarkClick} className={`p-2 rounded-full transition ${isBookmarked ? 'text-emerald-700 bg-emerald-100' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Bookmark className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setShowDownloadModal(true)} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>
      <DownloadConfirmationModal 
        lecture={lecture} isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)}
        onConfirm={() => lectureUtils.confirmLibrarySave(lecture, () => {}, setIsLibraryMutating, () => setShowDownloadModal(false))}
        isMutating={isLibraryMutating}
      />
    </div>
  );
};

export default VideoPlayer;