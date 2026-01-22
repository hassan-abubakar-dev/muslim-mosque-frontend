const MosqueListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Image */}
          <div className="h-40 bg-gray-300 animate-pulse" />

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              <div className="h-5 w-16 bg-emerald-100 rounded-full animate-pulse" />
            </div>

            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>


          
        </div>
      ))}
    </div>
  );
};

export default MosqueListSkeleton;
