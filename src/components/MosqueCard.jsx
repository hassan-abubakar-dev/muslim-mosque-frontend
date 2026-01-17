import React from 'react';

const MosqueCard = ({ mosque, onClick, small }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-lg shadow p-4 flex items-start gap-4 hover:shadow-md ${small ? 'w-64' : ''}`}
    >
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-semibold">{(mosque.name || 'M').slice(0,1)}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{mosque.name}</h3>
          {mosque.is_verified && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Verified</span>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{mosque.city || mosque.country}</p>
        {mosque.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{mosque.description}</p>}
      </div>
    </div>
  );
};

export default MosqueCard;
