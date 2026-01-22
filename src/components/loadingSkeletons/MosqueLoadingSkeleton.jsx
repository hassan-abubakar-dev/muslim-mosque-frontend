const MosqueLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20 animate-pulse">
      {/* Mosque card skeleton */}
      <div className="bg-white rounded-xl mb-4 shadow-md overflow-hidden w-full md:w-[87%] mx-auto">
        <div className="bg-gray-300 w-full h-[340px] rounded-md"></div>

        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex justify-between mt-4">
            <div className="h-6 bg-gray-300 rounded w-24"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-44 bg-gray-300 w-full"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-24 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MosqueLoadingSkeleton;
