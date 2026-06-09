import { Video, Headphones, Bookmark, Download, Trash2 } from "lucide-react";
import { lectureUtils } from "../util/lectureActions";

const LectureCard = ({
    lecture,
    mode = "category", // "category" | "bookmark"
    teacherName,
    formatDuration,
    onPlay,
    onDeleteRequest, 
    onUpdateState,
    onDownload
}) => {

    const isBookmarked = mode === "bookmark" ? true : (lecture.bookmarks && lecture.bookmarks.length > 0);


const handleBookmarkClick = async () => {
    // Optimistically toggle or wait for the result
    const wasBookmarked = isBookmarked;
    await lectureUtils.toggleBookmark(lecture.id);
    
    // Notify parent of the change and the new status
    onUpdateState(!wasBookmarked); 
};

    return (
        <div className="relative bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
            {/* Left: Thumbnail & Info */}
            <div className="flex items-start gap-4">
                <button onClick={() => onPlay(lecture)} className="w-18 h-14 flex items-center justify-center bg-emerald-100 rounded-md overflow-hidden">
                    {lecture.type === 'video' && lecture.thumbnail ? (
                        <img src={lecture.thumbnail} alt={lecture.title} className="w-full h-full object-cover" />
                    ) : (
                        lecture.type === 'video' ? <Video className="text-emerald-700 w-6 h-6" /> : <Headphones className="text-emerald-700 w-6 h-6" />
                    )}
                </button>
                <div>
                    <h3 className="font-semibold text-gray-800">{lecture.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {teacherName || lecture.type} {lecture.duration && `• ${formatDuration(lecture.duration)}`}
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">

                <button onClick={handleBookmarkClick}>
                    <Bookmark
                        className={`w-5 h-5 transition-colors ${isBookmarked
                            ? "text-emerald-600 fill-emerald-600" // Always Emerald when saved
                            : "text-gray-400"                       // Gray when not
                            }`}
                    />
                </button>

                <button
                    onClick={() => onDownload(lecture)} // Change this
                    className="text-gray-400 hover:text-emerald-700 p-1"
                >
                    <Download className="w-4 h-4" />
                </button>

                {/* Conditional Delete Button */}
                {mode === "category" && (
                    <button onClick={() => onDeleteRequest(lecture)}>
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default LectureCard;