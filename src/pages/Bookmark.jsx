import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react";
import AudioPlayerModal from '../pages/categoryLecture/AudioPlayerModal';
import privateAxiosInstance from "../../auth/privateAxiosInstance.js";
import { lectureUtils } from "../util/lectureActions.js";
import LectureCard from "../components/LectureCard.jsx";
import LectureCardSkeleton from "../components/loadingSkeletons/LectureCardSkeleton.jsx";
import DownloadConfirmationModal from "../components/DownloadConfirmationModal.jsx";
import formatDuration from "../util/time.js";

const BookmarkPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);


  const [videoForLibrary, setVideoForLibrary] = useState(null);
  const [isLibraryMutating, setIsLibraryMutating] = useState(false);

  // Pagination & Observer State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [audioModalLecture, setAudioModalLecture] = useState(null);

  const observer = useRef();
  const navigate = useNavigate();


  const handleUpdateState = (lectureId) => {
    // Removes the specific lecture from the current list without re-fetching
    setBookmarks(prev => prev.filter(b => b.lecture.id !== lectureId));
  };

  // Observer Logic: Watch the last element
  const lastBookmarkElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Main Fetch Logic
  const fetchBookmarks = async (pageNum, isReset = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 8 };
      if (search.trim() !== "") params.search = search.trim();
      if (activeTab !== "all") params.type = activeTab;

      const res = await privateAxiosInstance.get("/bookmarks/get", { params });

      if (res.status < 400) {
        const newBookmarks = res.data.data.bookmarks;
        const { totalPages, currentPage } = res.data;

        setBookmarks(prev => isReset ? newBookmarks : [...prev, ...newBookmarks]);
        setHasMore(currentPage < totalPages);

      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
      setLoadingSkeleton(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    fetchBookmarks(1, true);
  }, []);

  // 2. Fetch when page increments
  useEffect(() => {
    if (page > 1) fetchBookmarks(page, false);
  }, [page]);

  // 3. Fetch when filters change (Debounced)
  useEffect(() => {

    if (search.trim().length === 0 && search !== "") {
      return; // Don't fetch for empty strings that were just spaces
    }

    if (search || activeTab !== "all") {
      const delayDebounce = setTimeout(() => {
        fetchBookmarks(1, true);
      }, 600);
      return () => clearTimeout(delayDebounce);
    }
  }, [activeTab, search]);

  const handlePlayLecture = (lecture) => {
    if (lecture.type === "audio") {
      setAudioModalLecture(lecture);
    } else {
      navigate("/video-player", { state: { lecture, fromBookmark: true } });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved Bookmarks</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-4xl mx-auto sticky top-20 z-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (value.trim() === "") fetchBookmarks(1, true);
              }}
              className="pl-9 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-emerald-300 outline-none"
            />
          </div>

          <div className="flex gap-2">
            {["all", "video", "audio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === tab ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
              >
                {tab === "all" ? "All" : tab === "video" ? "Videos" : "Audio"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {loadingSkeleton && <LectureCardSkeleton />}

        {!loading && bookmarks.length === 0 && (
          <div className="text-center text-gray-500 py-10">No bookmarks found.</div>
        )}

      {/* Change this part in your render section */}
{Array.isArray(bookmarks) && bookmarks.map((bookmark, index) => {
  const isLast = bookmarks.length === index + 1;
  const card = (
    <LectureCard
      key={bookmark.id || index} // Fallback to index if ID is missing
      mode="bookmark"
      lecture={bookmark.lecture}
      formatDuration={formatDuration}
      onPlay={handlePlayLecture}
      onUpdateState={() => handleUpdateState(bookmark.lecture.id)}
      onDownload={(lec) => {
        if (lec.type === 'video') {
          setVideoForLibrary(lec);
        } else {
          lectureUtils.handleDownload(lec);
        }
      }}
    />
  );
  return isLast ? <div ref={lastBookmarkElementRef} key={bookmark.id}>{card}</div> : card;
})}

        {loading && <LectureCardSkeleton />}
      </div>

      {audioModalLecture && (
        <AudioPlayerModal
          lecture={audioModalLecture}
          onClose={() => setAudioModalLecture(null)}
          fromBookmark={true}
          onBookmark={async () => {
            // 1. Perform the toggle
            await lectureUtils.toggleBookmark(audioModalLecture.id);
            // 2. Update state locally
            handleUpdateState(audioModalLecture.id);
            // 3. Close the modal
            setAudioModalLecture(null);
          }}
          onDownload={() => lectureUtils.handleDownload(audioModalLecture)}
        />
      )}


  
<DownloadConfirmationModal 
  lecture={videoForLibrary}
  isOpen={!!videoForLibrary}
  onClose={() => setVideoForLibrary(null)}
  onConfirm={async () => {
    await lectureUtils.confirmLibrarySave(
      videoForLibrary, 
      (isSaved) => {
        setBookmarks(prev => prev.map(b => 
          b.lecture.id === videoForLibrary.id 
            ? { ...b, lecture: { ...b.lecture, isSaved } } 
            : b
        ));
      },
      setIsLibraryMutating, 
      setVideoForLibrary
    );
  }}
  isMutating={isLibraryMutating}
/>
    </div>
  );
};

export default BookmarkPage;