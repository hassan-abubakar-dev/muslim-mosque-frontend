const MosqueTeamSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-3xl mx-auto space-y-8 my-10 mb-20 animate-pulse">
        {/* Skeleton for Appoint Assistant Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg" />
            <div className="w-24 h-12 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Skeleton for Roster List */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="h-6 w-64 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MosqueTeamSkeleton;



