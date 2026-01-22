const MosqueNotFound = () => {
    return (
        <div className="p-4 rounded-xl shadow-md bg-white animate-pulse mt-24">
  <div className="h-40 w-full bg-gray-300 mb-4" />   {/* image skeleton */}
  <div className="h-6 w-1/2 bg-gray-300 mb-2" />    {/* title skeleton */}
  <div className="h-4 w-3/4 bg-gray-200" />         {/* description skeleton */}
  <p className="mt-4 text-red-600 font-semibold">Mosque not found</p>
</div>
    )
};

export default MosqueNotFound;