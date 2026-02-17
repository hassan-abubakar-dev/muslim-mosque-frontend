import { useState } from 'react';
import Profile from '../../assets/profile.jpg';
import { Camera } from 'lucide-react';
const MosqueProfile = () => {

    const [uploadedFile, setUploadedFile] = useState(null);

      const getMosqueProfile = (e) => {
    const file = e.target.files[0];
    if(file){
      setUploadedFile(file);
    }
    if (!file) return
  };

    return (
          <div className="bg-white rounded-xl mb-4 shadow-md overflow-hidden hover:shadow-lg transition w-full md:w-[87%] justify-self-center mt-5">

          {/* Image wrapper */}
          <div className="relative bg-gray-200 w-full h-[340px] rounded-md group">

            {/* Mosque image */}
            <img
              src={Profile}
              className="h-full w-full object-cover"
              alt="Mosque Profile"
            />

            {/* Upload button (admin only later) */}
            <label
              className="absolute top-3 right-3 bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-md
                 hover:bg-emerald-800 transition opacity-90 group-hover:opacity-100"
              title="Update mosque image"
            >
              <Camera className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={getMosqueProfile}
              />
            </label>
          </div>

          {/* Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-emerald-800">
              Annor Mosque
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Category description
            </p>

            <div className="mt-4 flex justify-between items-center">
              <button className="text-emerald-700 text-sm font-medium hover:underline">
                View Content
              </button>

              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                Admin
              </span>
            </div>
          </div>
        </div>
    )
};

export default MosqueProfile;