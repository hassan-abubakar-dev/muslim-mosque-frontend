const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 my-10 animate-pulse">
        
        {/* Profile Header Section */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full bg-gray-200" />
          <div className="h-8 w-48 bg-gray-300 mt-6 rounded" />
          <div className="h-4 w-32 bg-gray-200 mt-3 rounded" />
        </div>

        {/* Info Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg h-20" />
          ))}
        </div>

        {/* Managed Mosques Skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="h-4 w-40 bg-gray-200 mb-4 rounded" />
          <div className="h-24 w-full bg-gray-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;