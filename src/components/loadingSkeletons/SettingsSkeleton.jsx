import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

const SettingsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-48 mb-6" />

        {/* Tab Switcher Skeleton */}
        <div className="flex bg-gray-200/60 p-1 rounded-2xl mb-8 max-w-sm">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>

        {/* Main Card Skeleton */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xs p-6 sm:p-10 space-y-6">
          {/* Avatar and Info Row */}
          <div className="flex gap-5 border-b border-gray-50 pb-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>

          {/* Input Field Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;