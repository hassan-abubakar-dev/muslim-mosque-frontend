const MosqueProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-[87%] mx-auto mt-5 animate-pulse">
      {/* IMAGE SECTION */}
      <div className="relative h-[340px] w-full bg-gray-200" />

      {/* CONTENT SECTION */}
      <div className="p-4">
        {/* NAME + STATUS */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/3 bg-gray-200 rounded-md" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1 mt-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded-md" />
          <div className="h-4 w-full bg-gray-200 rounded-md" />
          <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default MosqueProfileSkeleton;