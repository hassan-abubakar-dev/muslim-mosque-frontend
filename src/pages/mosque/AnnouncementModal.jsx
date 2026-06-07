import { useEffect } from 'react';
import { Calendar, X } from 'lucide-react'; // Using an icon instead of '✕' for a cleaner look

const AnnouncementModal = ({ announcement, isOpen, onClose, formatDate }) => {
  // Handle Esc key to close
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !announcement) return null;

  return (
    // Backdrop with click-to-close
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal content with stopPropagation to prevent closing when clicking inside */}
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          {announcement.image && (
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm"
            />
          )}
          
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {announcement.content}
          </div>
          
           <div className="flex items-center gap-2 mt-4 text-emerald-700">
                  <Calendar size={16} />
                  <span className="text-xs font-medium">{formatDate(announcement.createdAt)}</span>
                </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;