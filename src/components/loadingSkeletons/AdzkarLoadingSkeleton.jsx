const AdzkarLoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <article key={i} className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <div className="flex justify-between mb-3">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-3">
            <div className="h-6 w-32 bg-emerald-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </article>
    ))}
  </div>
);

export default AdzkarLoadingSkeleton;