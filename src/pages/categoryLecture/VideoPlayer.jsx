import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VideoPlayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const lecture = state || { title: 'Video Lecture', src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{lecture.title}</h2>
          <button onClick={() => navigate(-1)} className="px-3 py-1 rounded-md bg-gray-100">Back</button>
        </div>

        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video controls className="w-full h-full">
            <source src={lecture.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="text-sm text-gray-500 mt-3">Playing mock video. Replace with real source when available.</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
