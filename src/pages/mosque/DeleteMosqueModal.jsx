import { useState, useEffect } from "react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";

const isDev = import.meta.env.VITE_ENV === 'development'; 

const DeleteMosqueModal = ({ isOpen, onClose, mosque, navigate}) => {
  const [typedName, setTypedName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 1. Added loading state
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    let timer;
    if (isConfirmed && countdown > 0 && !isDeleting) { // Prevent timer if deleting
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isConfirmed && !isDeleting) {
      executeDelete();
    }
    return () => clearTimeout(timer);
  }, [isConfirmed, countdown, isDeleting]);

  const executeDelete = async () => {
    setIsDeleting(true); // 2. Trigger loading UI
    try {
     const res = await privateAxiosInstance.delete(`/mosques/dete-mosque/${mosque.id}`);
     onClose();
      navigate('/'); 
  
    } catch (err) {
      if (isDev) {
        console.error("Deletion failed:", err?.response?.data?.message || err);
      }
      setIsDeleting(false); // Reset loading on error
      setIsConfirmed(false); // Return to step 1
      setCountdown(4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        {isDeleting ? (
          <div className="text-center py-6">
            <h3 className="text-xl font-bold text-gray-700">Deleting Mosque...</h3>
            <p className="text-sm text-gray-500">Cleaning up files and records.</p>
            {/* You could add a spinner icon here */}
          </div>
        ) : !isConfirmed ? (
          <>
            <h3 className="text-lg font-bold mb-2">Delete {mosque.name}?</h3>
            <p className="text-sm text-gray-600 mb-4">Type the mosque name below to confirm:</p>
            <input 
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder={mosque.name}
            />
            <div className="flex flex-col gap-2">
              <button 
                disabled={typedName !== mosque.name}
                onClick={() => setIsConfirmed(true)}
                className="w-full bg-rose-600 text-white py-2 rounded font-bold disabled:opacity-50"
              >
                Confirm Deletion
              </button>
              <button onClick={onClose} className="w-full bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-rose-600 mb-4">Deleting in {countdown}...</h3>
            <button 
              onClick={() => { setIsConfirmed(false); setCountdown(4); }} 
              className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700 transition-colors"
            >
              Cancel Deletion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteMosqueModal;