import { useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ToastToCreateAccount = ({ message, setMessage }) => {
  const navigate = useNavigate();

  // 1. Auto-close timer with cleanup
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000); // Extended to 5s for better readability

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [message, setMessage]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 mt-4">
      <div className="bg-white border-l-4 border-emerald-600 shadow-xl p-4 rounded-lg flex items-center gap-4">
        <p className="text-sm font-medium text-gray-800">{message}</p>
        
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          {/* Navigate to Login Button */}
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer whitespace-nowrap"
          >
            Log In
          </button>
          
          {/* Close Button */}
          <button 
            onClick={() => setMessage(null)} 
            className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastToCreateAccount;