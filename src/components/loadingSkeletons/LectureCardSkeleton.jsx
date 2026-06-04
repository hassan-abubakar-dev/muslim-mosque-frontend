const LectureCardSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full animate-pulse flex items-center gap-4">
      {/* Icon Placeholder */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      
      {/* Text Lines Placeholder */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
      </div>
      
      {/* Buttons Placeholder */}
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default LectureCardSkeleton;