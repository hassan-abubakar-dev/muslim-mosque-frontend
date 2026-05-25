import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const lecture = location.state?.lecture || null; 
  console.log('lecture:', lecture);

  // Safely build the secure YouTube embed URL using the videoId from the DB
  const embedUrl = lecture?.videoId 
    ? `https://www.youtube.com/embed/${lecture.videoId}?autoplay=1&rel=0` 
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-28">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-sm">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{lecture?.title || "Untitled Lecture"}</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>

        {/* 🎥 The Video Player Wrapper */}
        <div className="aspect-video bg-black rounded-md overflow-hidden shadow-inner relative group">
          
          {embedUrl ? (
            <iframe
              className="w-full h-full border-0"
              src={embedUrl}
              title={lecture?.title || "YouTube Video Player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              /* We add style inline here to show the thumbnail image as a background 
                while the third-party iframe initiates and buffers!
              */
              style={{
                backgroundImage: `url(${lecture?.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-between justify-center text-white bg-gray-900">
              <p>Video resource unavailable.</p>
            </div>
          )}

        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Streaming smoothly from YouTube servers</span>
          {lecture?.createdAt && (
            <span>Uploaded on: {new Date(lecture.createdAt).toLocaleDateString()}</span>
          )}
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;