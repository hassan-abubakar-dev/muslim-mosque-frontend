import React from 'react';
import { Video } from 'lucide-react';

const DownloadConfirmationModal = ({ lecture, isOpen, onClose, onConfirm, isMutating }) => {
  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Video className="text-emerald-700 w-5 h-5" /> Save to In-App Video Library?
        </h2>
        <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block mt-2">
          Target Lecture: {lecture.title}
        </p>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          To save your device's storage space, this video will be securely added to your online <strong>Video Library</strong> rather than downloading directly onto your local browser file system memory.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isMutating}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isMutating}
            className="px-4 py-2 rounded-md bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition shadow-sm disabled:opacity-50"
          >
            {isMutating ? "Saving..." : "Yes, Save Video"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadConfirmationModal;