import React from 'react';

const PendingMosqueReview = ({ pendingMosques, setSelectedMosque }) => {
  return (
    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-900 mb-4">Pending Mosques Review</h2>
      
      {pendingMosques && pendingMosques.length > 0 ? (
        pendingMosques.map(mosque => (
          <div key={mosque.id} className="flex justify-between py-3 border-b last:border-0 border-gray-50">
            <span className="text-sm font-bold text-slate-700 truncate">{mosque.name}</span>
            <button 
              onClick={() => setSelectedMosque(mosque)} 
              className="text-emerald-700 font-bold text-xs hover:text-emerald-900 transition-colors"
            >
              Review
            </button>
          </div>
        ))
      ) : (
        <div className="py-4 text-center">
            <p className="text-xs text-gray-400 italic">No pending mosques to review.</p>
        </div>
      )}
    </div>
  );
};

export default PendingMosqueReview;