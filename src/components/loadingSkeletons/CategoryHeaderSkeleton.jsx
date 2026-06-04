import LectureCardSkeleton from "./LectureCardSkeleton";

const CategoryHeaderSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 mt-5">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Left: Text Skeleton */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-emerald-100 rounded-full w-20"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-full max-w-lg"></div>
        </div>

        {/* Right: Image Skeleton */}
        <div className="w-full md:w-48 h-28 rounded-lg bg-gray-200 shrink-0"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-12 bg-white rounded-xl shadow w-full border border-gray-100"></div>
      <LectureCardSkeleton />
      <LectureCardSkeleton />
      <LectureCardSkeleton />
    </div>
  );
};

export default CategoryHeaderSkeleton;