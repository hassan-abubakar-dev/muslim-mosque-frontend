import React from 'react';

const AudioPlayerModal = ({ lecture, url, onClose }) => {
  if (!lecture) return null;

  // mock audio src; in real app this should come from lecture metadata
  const src = url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-lg p-6 mx-4">
        <h2 className="text-lg font-semibold text-gray-800">{lecture.title}</h2>
        <p className="text-sm text-gray-500">Audio Lecture</p>

        <div className="mt-4">
          <audio controls className="w-full">
            <source src={src} />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerModal;
