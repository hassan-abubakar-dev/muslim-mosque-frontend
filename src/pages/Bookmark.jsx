import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, Video, Headphones, Bookmark, Download } from "lucide-react";
import AudioPlayerModal from '../pages/categoryLecture/AudioPlayerModal'; // Adjust import paths to your folder layout
import privateAxiosInstance from "../../auth/privateAxiosInstance.js";
import handleBookmarkClick from "../util/bookmark.js";

const BookmarkPage = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | video | audio
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [audioModalLecture, setAudioModalLecture] = useState(null);
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const fetchBookmarks = async () => {
    try {
      const res = await privateAxiosInstance.get("/bookmarks/get");
      // Matches your controller structure: res.data.data.bookmarks
      if (res.data?.data?.bookmarks) {
        setBookmarks(res.data.data.bookmarks);
      }
      console.log('Fetched bookmarks:', res.data?.data?.bookmarks);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Local state removal toggle wrapper to instantly animate/clear things out from UI
  const handleRemoveBookmarkLocal = async (lectureId) => {
    try {
      // Trigger API toggle request to backend 
      await handleBookmarkClick(lectureId);
      
      // Update local array filter to instantly slide out of view
      setBookmarks(prev => prev.filter(b => b.lectureId !== lectureId));
    } catch (err) {
      console.error("Failed to untoggle bookmark from layout:", err);
    }
  };

  const handlePlayLecture = (lecture) => {
    if (lecture.type === "audio") {
      setAudioModalLecture(lecture);
    } else {
      navigate("/video-player", {
        state: { lecture }
      });
    }
  };

  // Frontend Filter logic adapted for nested bookmark data objects
  const filteredBookmarks = useMemo(() => {
    let data = bookmarks;

    if (search.trim()) {
      data = data.filter((b) =>
        b.lecture?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      data = data.filter((b) => b.lecture?.type === activeTab);
    }

    return data;
  }, [activeTab, search, bookmarks]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-24">
      
      {/* Visual Section Title Header matching style guide */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Saved Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-1">Access all your bookmarked audio lectures and videos in one location.</p>
      </div>

      {/* Search Filter Strip Box */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-4xl mx-auto sticky top-20 z-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          
          {/* Search Box Inputs */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved lectures..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveTab("all");
              }}
              className="pl-9 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-emerald-300 outline-none"
            />
          </div>

          {/* Filtering Tab buttons */}
          <div className="flex gap-2">
            {["all", "video", "audio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {tab === "all" ? "All" : tab === "video" ? "Videos" : "Audio"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Filtered Bookmarks List Grid */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredBookmarks.length === 0 && (
          <div className="text-center text-gray-500 bg-white rounded-xl shadow py-12 px-4 border border-dashed">
            No saved lectures found matching current filters.
          </div>
        )}

        {bookmarks.length > 0 && filteredBookmarks.map((bookmark) => {
          const lecture = bookmark.lecture;
          if (!lecture) return null; // Safety falloff logic if database record drops out

          return (
            <div
              key={bookmark.id}
              className="relative bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition duration-200"
            >
              {/* Media Left Play section block */}
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  aria-label={lecture.type === 'audio' ? `Play audio: ${lecture.title}` : `Play video: ${lecture.title}`}
                  onClick={() => handlePlayLecture(lecture)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handlePlayLecture(lecture);
                    }
                  }}
                  className="w-18 h-14 flex items-center justify-center bg-emerald-100 rounded-md overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {lecture.type === 'video' && lecture.thumbnail ? (
                    <img
                      src={lecture.thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  ) : lecture.type === 'video' ? (
                    <Video className="text-emerald-700 w-6 h-6" />
                  ) : (
                    <Headphones className="text-emerald-700 w-6 h-6" />
                  )}
                </button>

                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {lecture.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {lecture.type} • {formatDuration(lecture.duration)}
                  </p>
                </div>
              </div>

              {/* Action Buttons Right Row */}
              <div className="flex items-center gap-4">
                {/* Active Bookmark state button configuration */}
                <button 
                  title="Remove Bookmark" 
                  onClick={() => handleRemoveBookmarkLocal(lecture.id)}
                  className="group focus:outline-none p-1 hover:bg-emerald-50 rounded"
                >
                  <Bookmark className="w-5 h-5 text-emerald-600 fill-emerald-600 transition duration-150 group-hover:scale-105" />
                </button>

                <button title="Download" className="text-gray-400 hover:text-gray-600">
                  <Download className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Global Background Overlay Audio Player portal instance */}
      {audioModalLecture && (
        <AudioPlayerModal 
          lecture={audioModalLecture} 
          onClose={() => setAudioModalLecture(null)} 
        />
      )}

    </div>
  );
};

export default BookmarkPage;