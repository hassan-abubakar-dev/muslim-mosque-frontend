import { Video, Headphones, Bookmark, Download, Trash2 } from "lucide-react";

const LectureCard = ({ 
  lecture, 
  teacherName, 
  formatDuration, 
  onPlay, 
  onBookmark, 
  onDownload, 
  onDelete 
}) => {
  const isBookmarked = lecture.bookmarks && lecture.bookmarks.length > 0;

  return (
    <div className="relative bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
      {/* Left: Thumbnail & Info */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => onPlay(lecture)}
          className="w-18 h-14 flex items-center justify-center bg-emerald-100 rounded-md overflow-hidden cursor-pointer"
        >
          {lecture.type === 'video' && lecture.thumbnail ? (
            <img src={lecture.thumbnail} alt={lecture.title} className="w-full h-full object-cover" />
          ) : lecture.type === 'video' ? (
            <Video className="text-emerald-700 w-6 h-6" />
          ) : (
            <Headphones className="text-emerald-700 w-6 h-6" />
          )}
        </button>
        <div>
          <h3 className="font-semibold text-gray-800">{lecture.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {teacherName} • {formatDuration(lecture.duration)}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button title="Bookmark" onClick={() => onBookmark(lecture.id)}>
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "text-emerald-600 font-bold" : "text-gray-400"}`} />
        </button>
        <button title="Download" onClick={() => onDownload(lecture)} className="text-gray-400 hover:text-emerald-700 p-1">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(lecture)}>
          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default LectureCard;