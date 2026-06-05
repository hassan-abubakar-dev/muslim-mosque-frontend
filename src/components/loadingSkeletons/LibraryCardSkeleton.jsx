import React from 'react';

const VideoLibrarySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
          {/* Thumbnail Skeleton */}
          <div className="aspect-video w-full bg-gray-200" />
          
          {/* Content Skeleton */}
          <div className="p-4 flex flex-col gap-3">
            <div className="h-5 bg-gray-200 rounded-md w-3/4" />
            <div className="h-4 bg-gray-100 rounded-full w-1/3" />
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoLibrarySkeleton;