import { useState } from "react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";
import { useUserContext } from "../../context/UserContext";

const SuspendMosqueModal = ({ isOpen, onClose, mosque }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isSuspended = mosque.status === 'suspended';
  const newStatus = isSuspended ? 'verified' : 'suspended';

  const {updateMosqueLocally} = useUserContext();

  const handleToggleStatus = async () => {
    setIsProcessing(true);
    try {
      // Assuming your backend uses this endpoint for both suspend and unsuspend
      // If you need separate endpoints, update this path accordingly.
      await privateAxiosInstance.patch(`/mosques/moderate/${mosque.id}`);
      updateMosqueLocally(mosque.id, { status: newStatus });
      onClose();
    } catch (err) {
      console.error("Status change failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold mb-2">
          {isSuspended ? "Unsuspend Mosque?" : "Suspend Mosque?"}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {isSuspended 
            ? `Are you sure you want to verify and restore the mosque: ${mosque.name}?`
            : `Are you sure you want to suspend ${mosque.name}? This will restrict access for its users.`
          }
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            disabled={isProcessing}
            onClick={handleToggleStatus}
            className={`w-full py-2 rounded-lg font-bold text-white ${
              isSuspended ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
            } disabled:opacity-50`}
          >
            {isProcessing ? "Processing..." : isSuspended ? "Confirm Unsuspend" : "Confirm Suspend"}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendMosqueModal;