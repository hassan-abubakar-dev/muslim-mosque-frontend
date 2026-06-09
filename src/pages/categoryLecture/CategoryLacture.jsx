
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Video, Headphones, MoreVertical, Bookmark, Share2, Download, Trash2 } from "lucide-react";
import CategoryLactureHeader from "./CateoryLactureHeader";
import UploadLectureModal from './UploadLectureModal';
import AudioPlayerModal from './AudioPlayerModal';
import privateAxiosInstance from "../../../auth/privateAxiosInstance";
import LectureCard from "../../components/LectureCard.jsx";
import LectureCardSkeleton from "../../components/loadingSkeletons/LectureCardSkeleton.jsx";
import CategoryHeaderSkeleton from "../../components/loadingSkeletons/CategoryHeaderSkeleton.jsx";
import DownloadConfirmationModal from "../../components/DownloadConfirmationModal.jsx";
import { lectureUtils } from "../../util/lectureActions.js";
import formatDuration from "../../util/time.js";




const CategoryLecture = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | video | audio
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [lectures, setLectures] = useState([]);
  const [lectureCount, setLectureCount] = useState(0);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  

  const cat = location.state?.cat || null;

  const fetchLectureCount = async () => {
    if (!cat?.id) return;
    try {
      const res = await privateAxiosInstance.get(`/lectures/get-lecture-count/${cat.id}`);
      if (res.status < 400) {
        setLectureCount(res.data.count);
        console.log("Lecture count fetched successfully:", res.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch lecture count:", err);
      setLectureCount(0); // Set to 0 on error to avoid displaying incorrect count
    }
  };

  useEffect(() => { 
    if(cat?.id) {
      fetchLectureCount();
    setLoadingSkeleton(false); 
    }
  }, [cat?.id]);



  const [openMenuId, setOpenMenuId] = useState(null);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [showUploadTypeModal, setShowUploadTypeModal] = useState(false);

  const [videoForLibrary, setVideoForLibrary] = useState(null);
  const [isLibraryMutating, setIsLibraryMutating] = useState(false);

  const [audioModalLecture, setAudioModalLecture] = useState(null);
  const navigate = useNavigate();



  // Pagination & Observer State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();


  // Observer Logic: Watch the last element
  const lastLectureElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);




  const handleDeleteLecture = async (lectureId) => {
    try {
      const res = await privateAxiosInstance.delete(`/lectures/delete-lecture/${lectureId}`);
      if (res.status < 400) {
        // remove from local state
        setLectures(prev => prev.filter(l => l.id !== lectureId));
        setLectureToDelete(null);
        console.log('Lecture deleted successfully', res.data);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // play video or audio navigation
  const handlePlayLecture = (lecture) => {
    if (lecture.type === "audio") {
      setAudioModalLecture(lecture);
    } else {
      navigate("/video-player", {
        state: {
          lecture,
          fromBookmark: false
        }
      });
    }
  };



  const fetchLectures = async (pageNum, isReset = false) => {
    if (!cat?.id) return;
    setLoading(true);

    try {
      // 1. Prepare clean params
      const params = {
        page: pageNum,
        limit: 10 // Use colon, not equals
      };

      // 2. Only add these if they have meaningful values
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }

      if (activeTab !== "all") {
        params.type = activeTab;
      }

      // 3. Send request
      const res = await privateAxiosInstance.get(`/lectures/get-lectures/${cat.id}`, { params });

      if (res.status < 400) {
        const { lectures: newLectures, totalPages, currentPage } = res.data;
        console.log(res.data)

        setLectures(prev => isReset ? newLectures : [...prev, ...newLectures]);

        setHasMore(currentPage < totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch("");
    setActiveTab("all");
    setPage(1);
    fetchLectures(1, true);
  }, [cat?.id]);

  // Fetch when page increments
  useEffect(() => {
    if (page > 1) fetchLectures(page, false);
  }, [page])


  useEffect(() => {

    if (search.trim().length === 0 && search !== "") {
    return; // Don't fetch for empty strings that were just spaces
  }

    if (search || activeTab !== "all") {
      const delayDebounce = setTimeout(() => {
        fetchLectures(1, true);
      }, 600);
      return () => clearTimeout(delayDebounce);
    }
  }, [activeTab, search]); //here i remove cat.id because it already in separate useEffect and it cause double request when we change category and search or tab at the same time. so now when we change category it will trigger first useEffect and set page to 1 and fetch lectures with new cat id, and when we change search or tab it will trigger second useEffect and fetch lectures with new search or tab and reset to page 1. this way we avoid double request and also make sure that we always fetch the correct lectures based on the current category, search and tab.

if (loadingSkeleton) {
  return <CategoryHeaderSkeleton />;
}

  return (
    <div className="min-h-screen bg-gray-100 p-6  mb-6">

      {/* Category Header */}
      <CategoryLactureHeader cat={cat} lectureCount={lectureCount} />



      <div className="flex mb-4">
        <button
          onClick={() => setShowUploadTypeModal(true)}
          className="bg-emerald-700 text-white px-4 py-2 rounded-md  ml-auto font-semibold hover:bg-emerald-800"
        >
          + Upload Lecture
        </button>
      </div>


      {showUploadTypeModal && (
        <UploadLectureModal
          setShowUploadTypeModal={setShowUploadTypeModal}
          cat={cat}
          fetchLectures={fetchLectures}
          setLectures={setLectures}
        />
      )}

      {/* Search + Tabs */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 sticky top-20 z-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between ">

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lectures..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                // If user clears the box, fetch immediately (don't wait for debounce)
                if (value.trim() === "") {
                  fetchLectures(1, true);
                }
              }}
              className="pl-9 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-emerald-300 outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {["all", "video", "audio"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === tab
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

      {/* Lectures List */}

      {/* Lectures List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {lectures.length === 0 && !loading && ( // <--- Updated
          <div className="text-center text-gray-500 py-10">No lectures found.</div>
        )}

      {lectures.length > 0 && lectures.map((lecture, index) => {
  const isLast = lectures.length === index + 1;
  
  const card = (
  // In CategoryLecture.jsx, update the LectureCard component:
<LectureCard
  key={lecture.id}
  mode="category"
  lecture={lecture}
  teacherName={cat?.teacherName}
  formatDuration={formatDuration}
  onPlay={handlePlayLecture}
  onUpdateState={() => fetchLectures(1, true)}
  onDeleteRequest={setLectureToDelete}
  // Add this new prop:
  onDownload={(lec) => {
    if (lec.type === 'video') {
      setVideoForLibrary(lec); // This opens the confirmation modal
    } else {
      lectureUtils.handleDownload(lec); // Direct download for audio
    }
  }}
/>
  );

  return isLast ? <div ref={lastLectureElementRef} key={lecture.id}>{card}</div> : card;
})}

        {/* Loading indicator at the bottom */}
        {loading && (
          <>
            <LectureCardSkeleton />
            <LectureCardSkeleton />
            <LectureCardSkeleton />
          </>
          
        )}
      </div>

   
{audioModalLecture && (
  <AudioPlayerModal 
    lecture={audioModalLecture} 
    onClose={() => setAudioModalLecture(null)}
    fromBookmark={false}
    
    // CHANGE THIS PROP:
    onBookmark={async (lectureId, time) => {
      // 1. Call the API
      await lectureUtils.toggleBookmark(lectureId, time);
      
      // 2. Update the State so the UI refreshes immediately
      lectureUtils.updateBookmarkState(
        lectureId, 
        time, 
        setLectures, 
        setAudioModalLecture
      );
    }}
    
    onDownload={() => lectureUtils.handleDownload(audioModalLecture)}
  />
)}

      {lectureToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Lecture
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {lectureToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setLectureToDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  // later: deleteLecture(lectureToDelete.id)
                  setLectureToDelete(null);
                  handleDeleteLecture(lectureToDelete.id);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Educational Video Library Confirmation Modal */}

<DownloadConfirmationModal 
  lecture={videoForLibrary}
  isOpen={!!videoForLibrary}
  onClose={() => setVideoForLibrary(null)}
  onConfirm={async () => {
    await lectureUtils.confirmLibrarySave(
      videoForLibrary, 
      (isSaved) => {
        setLectures(prev => prev.map(l => 
          l.id === videoForLibrary.id ? { ...l, isSaved } : l
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

export default CategoryLecture; 
