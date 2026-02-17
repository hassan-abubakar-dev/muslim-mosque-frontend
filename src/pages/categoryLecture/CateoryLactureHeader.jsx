
const CategoryLactureHeader = () => {

    return (
         <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">

  {/* Left: Text */}
  <div className="flex-1 min-w-0">
    <h1 className="text-2xl font-bold text-emerald-800 truncate">
      Tafseer
    </h1>

    {/* Teacher + Lecture count */}
    <div className="flex items-center gap-3 mt-1 flex-wrap">
      <p className="text-sm text-gray-600">
        Sheikh Hassan
      </p>

      {/* Lecture count badge */}
      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
        18 Lectures
      </span>
    </div>

    <p className="text-sm text-gray-500 mt-3 line-clamp-3 max-w-2xl">
      Detailed explanation of Qur’anic verses for daily understanding.
    </p>
  </div>

  {/* Right: Category Image */}
  <div className="relative w-full md:w-48 h-28 rounded-lg overflow-hidden bg-emerald-100 flex items-center justify-center shrink-0">

    {/* If image exists */}
    {/* 
    <img
      src={cat.image}
      alt={cat.name}
      className="w-full h-full object-cover"
    /> 
    */}

    {/* If NO image (fallback) */}
    <span className="text-emerald-700 text-4xl font-bold">
      T
    </span>

    {/* Small lecture count overlay (optional but nice) */}
    <span className="absolute bottom-2 right-2 text-[11px] bg-black/60 text-white px-2 py-0.5 rounded">
      18
    </span>
  </div>

</div>
    )
};

export default CategoryLactureHeader;