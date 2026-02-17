


import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Video, Headphones, MoreVertical, Bookmark, Share2, Download } from "lucide-react";
import CategoryLactureHeader from "./CateoryLactureHeader";
import UploadLactureModel from './UploadLactureModel';
import AudioPlayerModal from './AudioPlayerModal';
import privateAxiosInstance from "../../../auth/privateAxiosInstance";




const CategoryLecture= () => {
  const [activeTab, setActiveTab] = useState("all"); // all | video | audio
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [lectures, setLectures] = useState([]);

  const cat = location.state?.cat || null;

const fetchLactures = async() => {
 try{
  const res = await privateAxiosInstance.get(`/lectures/all/${cat?.id}`);
 if(res.status < 400){  
    console.log(res.data, 'fetch lectures res');
  setLectures(res.data.lectures);
}
 }
 catch(err){
  console.log(err, 'fetch lectures err');
 
}

};

useEffect(() => {
  if (cat?.id) {
    fetchLactures();
  }
}, [cat?.id]);


  const [openMenuId, setOpenMenuId] = useState(null);
const [lectureToDelete, setLectureToDelete] = useState(null);
const [showUploadTypeModal, setShowUploadTypeModal] = useState(false);
 
  const [audioModalLecture, setAudioModalLecture] = useState(null);
  const navigate = useNavigate();

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const handlePlayLecture = async (lecture) => {
  if (lecture.type === "audio") {
    try {
      const res = await privateAxiosInstance.get(
        `/lectures/play/${lecture.id}`
      );

      if (res.status < 400) {
        console.log(res.data.signedUrl);
        
        setAudioModalLecture({
          ...lecture,
          url: res.data.signedUrl,
        });
      }
    } catch (err) {
      console.error("Failed to play lecture", err.response.data);
    }
  } else {
       const res = await privateAxiosInstance.get(
        `/lectures/play/${lecture.id}`
      );
  if(res.status < 400){
      navigate("/video-player", {
      state: {
        title: lecture.title,
        src: res.data.signedUrl,
      },
    });
  }
  }
};


  // Filter logic (frontend)
  const filteredLectures = useMemo(() => {
    let data = lectures;

    if (search.trim()) {
      data = data.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      data = data.filter((l) => l.type === activeTab);
    }

    return data;
  }, [activeTab, search, lectures]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-24">
      
      {/* Category Header */}
    <CategoryLactureHeader />

    {/* Audio Player Modal */}





<div className="flex mb-4">
  <button
  onClick={() => setShowUploadTypeModal(true)}
  className="bg-emerald-700 text-white px-4 py-2 rounded-md  ml-auto font-semibold hover:bg-emerald-800"
>
  + Upload Lecture
</button>
</div>


{showUploadTypeModal && (
 <UploadLactureModel
    setShowUploadTypeModal={setShowUploadTypeModal}
    cat={cat}
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
                setSearch(e.target.value);
                setActiveTab("all");
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
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
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

      {/* Lectures List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredLectures.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No lectures found.
          </div>
        )}

        {lectures.length > 0 && filteredLectures.map((lecture) => (
        <div
  key={lecture.id}
  className="relative bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition"
>
  {/* Left */}
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
        <Headphones className="text-emerald-700 w-6 h-6"  />
      )}
    </button>

    <div>
      <h3 className="font-semibold text-gray-800">
        {lecture.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        {cat?.teacherName} • {formatDuration(lecture.duration)}
      </p>
    </div>
  </div>

  {/* Right actions */}
  <div className="flex items-center gap-3 text-gray-400">
    <button title="Save (future)">
      <Bookmark className="w-4 h-4" />
    </button>

    <button title="Download (future)">
      <Download className="w-4 h-4" />
    </button>

    {/* Admin menu (visible for now) */}
    <button
      onClick={() =>
        setOpenMenuId(openMenuId === lecture.id ? null : lecture.id)
      }
      className="relative"
    >
      <MoreVertical className="w-5 h-5" />
    </button>
  </div>

  {/* Admin dropdown */}
  {openMenuId === lecture.id && (
    <div className="absolute right-4 top-12 bg-white border rounded-lg shadow-lg w-36 z-20">
      <button
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        onClick={() => {
          setOpenMenuId(null);
          // later: open edit mode
        }}
      >
        ✏️ Edit
      </button>

      <button
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        onClick={() => {
          setOpenMenuId(null);
          setLectureToDelete(lecture);
        }}
      >
        🗑 Delete
      </button>
    </div>
  )}
</div>

        ))}
      </div>

        {audioModalLecture && (
          <AudioPlayerModal lecture={audioModalLecture} onClose={() => setAudioModalLecture(null)} />
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
          }}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CategoryLecture; 
