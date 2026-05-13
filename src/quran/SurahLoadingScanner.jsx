const SurahLoadingScanner = () => {
  return (
    <div className="min-h-screen bg-emerald-50 pb-24 pt-20">
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="h-12 w-32 rounded-full bg-emerald-200 animate-pulse mb-6" />

        <div className="rounded-3xl bg-white p-6 shadow-lg border border-emerald-100 mb-6 space-y-4">
          <div className="h-10 w-1/2 rounded-full bg-emerald-200 animate-pulse" />
          <div className="h-4 w-40 rounded-full bg-emerald-200 animate-pulse" />
          <div className="h-4 w-28 rounded-full bg-emerald-200 animate-pulse" />
          <div className="h-3 w-full rounded-full bg-emerald-100 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 h-full w-24 bg-emerald-200/80 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-3xl bg-white border border-emerald-100 shadow p-5 space-y-3 animate-pulse">
              <div className="h-4 w-1/3 rounded-full bg-emerald-200" />
              <div className="h-4 w-full rounded-full bg-emerald-200" />
              <div className="h-4 w-4/6 rounded-full bg-emerald-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahLoadingScanner;
