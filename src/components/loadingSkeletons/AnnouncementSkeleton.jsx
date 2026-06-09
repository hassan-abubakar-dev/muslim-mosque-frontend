import React from 'react';

const AnnouncementSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
          
          {/* Content Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
          </div>
          
          {/* Date/Icon Skeleton */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementSkeleton;