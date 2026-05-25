import { Bookmark, FileText, Library, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      {/* Header of the mobile menu */}
      <div className="flex justify-between items-center p-4 border-b">
        <span className="font-semibold text-emerald-800 text-lg">Menu</span>
        <button onClick={onClose} className="p-2 text-slate-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Items */}
      <div className="p-4 space-y-2">
        <button 
          onClick={() => handleNav('/bookmarks')} 
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-slate-700"
        >
          <Bookmark className="w-5 h-5" /> Bookmarks
        </button>
        <button 
          onClick={() => handleNav('/reports')} 
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-slate-700"
        >
          <FileText className="w-5 h-5" /> Reports
        </button>
        <button 
          onClick={() => handleNav('/video-library')} 
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-slate-700"
        >
          <Library className="w-5 h-5" /> Video Library
        </button>
      </div>

      {/* Register Action Section */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button 
          onClick={() => handleNav('/register')} 
          className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800"
        >
          <UserPlus className="w-5 h-5" /> Register Mosque
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;