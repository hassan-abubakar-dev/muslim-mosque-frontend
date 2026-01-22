const AppSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header placeholder (static height, no skeleton shimmer) */}
      <div className="fixed top-0 left-0 right-0 h-21 bg-white shadow-sm z-50 flex items-center px-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="ml-auto flex gap-3">
          <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Body skeleton */}
      <main className="max-w-6xl mx-auto p-6 pt-24">
        {/* Page title */}
        <div className="h-7 w-56 bg-gray-300 rounded-md animate-pulse mb-6" />

        {/* Mosque cards skeleton grid */}
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
                <div className="flex justify-between items-center">
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
      </main>
    </div>
  );
};

export default AppSkeletonLoader;
