const VersesLoading = () => {
  return (
     <div className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 text-center">
          <div className="inline-flex flex-col gap-3">
            <div className="h-3 w-36 rounded-full bg-emerald-200 animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="h-3 w-24 rounded-full bg-emerald-200 animate-pulse" style={{ animationDelay: '0.15s' }} />
            <div className="h-3 w-44 rounded-full bg-emerald-200 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="mt-4 text-sm text-emerald-700">تحميل الآيات...</p>
        </div>
    );
};

export default VersesLoading;