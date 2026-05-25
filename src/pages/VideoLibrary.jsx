// 📄 src/pages/VideoLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Video, Search, ArrowLeft, Loader2 } from 'lucide-react';
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const VideoLibrary = () => {
  const navigate = useNavigate();
  const [libraryItems, setLibraryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal tracking state for explicit removal management
  const [videoToRemove, setVideoToRemove] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch saved video rows on mount
  const fetchLibrary = async () => {
    try {
      setIsLoading(true);
      const res = await privateAxiosInstance.get('/video-library/get-library');
      if (res.status < 400) {
        setLibraryItems(res.data.library || []);
      }
    } catch (err) {
      console.error("Failed fetching video library data:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // Handle explicit delete via our custom DELETE route
  const handleConfirmDelete = async () => {
    if (!videoToRemove) return;
    setIsDeleting(true);
    try {
      const res = await privateAxiosInstance.delete(`/video-library/remove/${videoToRemove.lectureId}`);
      if (res.status < 400) {
        // Clear local array state cleanly
        setLibraryItems(prev => prev.filter(item => item.lectureId !== videoToRemove.lectureId));
        setVideoToRemove(null);
      }
    } catch (err) {
      console.error("Failed removing target video item from database row:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Live client-side text filtering as user searches
  const filteredLibrary = libraryItems.filter(item => {
    const title = item.lecture?.title?.toLowerCase() || '';
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 🌟 1. Navigation & Content Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full bg-white text-emerald-800 shadow-xs border border-gray-100 hover:bg-emerald-50 transition cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Video Library</h1>
              <p className="text-sm text-gray-500 font-medium">
                {libraryItems.length} {libraryItems.length === 1 ? 'lecture' : 'lectures'} securely cached in cloud storage
              </p>
            </div>
          </div>

          {/* Search bar matching main app input styling cues */}
          {libraryItems.length > 0 && (
            <div className="flex items-center bg-white rounded-full border border-gray-200 overflow-hidden px-4 shadow-xs w-full sm:w-72 md:w-80 h-11">
              <Search className="text-gray-400 w-4 h-4 shrink-0" />
              <input 
                type="text"
                placeholder="Search your library items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full outline-hidden bg-transparent placeholder:text-gray-400 pl-2 text-sm text-gray-800"
              />
            </div>
          )}
        </div>

        {/* 🌟 2. Conditional State Display Handling */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 text-emerald-700 animate-spin" />
            <p className="text-gray-500 text-sm font-semibold tracking-wide animate-pulse">Loading saved storage slots...</p>
          </div>
        ) : libraryItems.length === 0 ? (
          /* High Fidelity Empty State Placeholder Box */
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-12 text-center max-w-xl mx-auto mt-12 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 mb-5 animate-bounce">
              <Video className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your Shelf is Empty</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
              You haven't saved any video lectures yet. Click the download icon on your video lecture streams to build up your offline streaming library list here!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-linear-to-r from-emerald-800 to-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-full shadow-md hover:opacity-95 transition tracking-wide cursor-pointer"
            >
              Browse Lectures
            </button>
          </div>
        ) : filteredLibrary.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
            <p className="text-gray-500 font-medium">No saved matches found for "{searchQuery}"</p>
          </div>
        ) : (
          
          /* 🌟 3. YouTube-Style Core Video Grid Display */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {filteredLibrary.map((item) => {
              const lec = item.lecture;
              if (!lec) return null;

              return (
                <div 
                  key={item.id} 
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {/* YouTube Style Fixed Aspect-Ratio Thumbnail Section */}
                  <div 
                    onClick={() => navigate("/video-player", { state: { lecture: lec } })}
                    className="relative aspect-video w-full bg-gray-900 overflow-hidden cursor-pointer"
                  >
                    {lec.thumbnail ? (
                      <img 
                        src={lec.thumbnail} 
                        alt={lec.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-emerald-950 to-emerald-800 text-white/40">
                        <Video className="w-12 h-12 mb-1 opacity-60" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300/60">Masjid Lecture</span>
                      </div>
                    )}

                    {/* Dark overlay showing play badge trigger on graphic hover interaction */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Dynamic bottom absolute time pill flag if available */}
                    {lec.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] px-1.5 py-0.5 rounded-sm tracking-wide">
                        {lec.duration}
                      </span>
                    )}
                  </div>

                  {/* Text Details Description Container Area Block */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div 
                      onClick={() => navigate(`/lecture/${lec.id}`, { state: { lecture: lec } })}
                      className="cursor-pointer"
                    >
                      <h4 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug hover:text-emerald-800 transition">
                        {lec.title}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-800/80 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-2">
                        Video Lecture
                      </p>
                    </div>

                    {/* Footnote bar layout tracking the explicit Trash2 icon action */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                      <span className="text-[11px] text-gray-400 font-medium">
                        Added {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      
                      <button 
                        title="Remove item from database"
                        onClick={() => setVideoToRemove(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🌟 4. Action Confirmation Safety Modal Popup Overlay */}
        {videoToRemove && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-100 transform scale-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="text-red-500 w-5 h-5" /> Remove from Library?
              </h3>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Are you sure you want to drop this recording entry? You will have to return to the category directories page if you want to catalog it here again.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  disabled={isDeleting}
                  onClick={() => setVideoToRemove(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? "Dropping..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoLibrary;