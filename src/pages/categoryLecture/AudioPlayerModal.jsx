import React, { useRef, useState, useEffect } from 'react';
import { Bookmark, Download } from 'lucide-react';
import DownloadConfirmationModal from '../../components/DownloadConfirmationModal.jsx';

const AudioPlayerModal = ({ lecture, onClose, onBookmark, fromBookmark, onDownload }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const audioRef = useRef(null);
    const isDev = import.meta.env.VITE_ENV === 'development';

  if (!lecture) return null;

  // Professional Initialization: Checks both the bookmark array and the existence of a lastPosition
const [isBookmarked, setIsBookmarked] = useState(false);
// Change this effect to catch the "Bookmark" context more broadly

// Add this effect to auto-play when the modal opens
useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    // Attempt to play the audio
    const playPromise = audio.play();
    
    // Most browsers require user interaction before autoplay
    if (playPromise !== undefined) {
      playPromise.catch(error => {
       if(isDev){
         console.log("Autoplay was prevented by the browser. User must interact first.");
       }
      });
    }
  }
}, []); // Empty dependency array ensures this runs once on mount

useEffect(() => {
  if (lecture) {
    // Check if it's forced by the prop OR if the data actually contains bookmark info
    const isActuallyBookmarked = 
      fromBookmark || 
      (lecture.bookmarks && lecture.bookmarks.length > 0) || 
      (lecture.lastPosition !== undefined && lecture.lastPosition !== null);

    setIsBookmarked(isActuallyBookmarked);
  }
}, [lecture, fromBookmark]); // Added fromBookmark to dependencies

  const bookmarkTime = lecture.lastPosition || 0;

  // Seek logic remains the same
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && bookmarkTime > 0) {
      const handleLoadedMetadata = () => { audio.currentTime = bookmarkTime; };
      if (audio.readyState >= 1) {
        audio.currentTime = bookmarkTime;
      } else {
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      }
      return () => audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [bookmarkTime]);

  const handleBookmarkClick = async () => {
    const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
    
    // Optimistic UI update: Icon changes color instantly
    setIsBookmarked(!isBookmarked);
    
    // Pass execution to parent to handle backend + navigation/closing logic
    await onBookmark(lecture.id, Math.floor(currentTime));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative w-full max-w-md bg-white rounded-lg p-6 mx-4 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800">{lecture.title}</h2>
          <p className="text-sm text-gray-500">Audio Lecture</p>

          <div className="mt-4">
            <audio ref={audioRef} controls className="w-full">
              <source src={lecture.url} />
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              <button 
                onClick={handleBookmarkClick}
                className={`p-2 rounded-full transition ${
                  isBookmarked ? 'text-emerald-700 bg-emerald-100' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>

              <button 
                onClick={() => setShowDownloadModal(true)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <DownloadConfirmationModal 
        lecture={lecture}
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onConfirm={() => {
          onDownload(lecture);
          setShowDownloadModal(false);
        }}
      />
    </>
  );
};

export default AudioPlayerModal;