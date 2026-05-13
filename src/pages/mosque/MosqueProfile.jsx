import { useState } from "react";
import axios from "axios";
import { Camera, Globe, MapPin } from "lucide-react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";
import { useUserContext } from "../../context/UserContext";

const MosqueProfile = ({ mosque }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
const {loggedInUser} = useUserContext();
  // original image (fallback source)
  const [originalImage, setOriginalImage] = useState(mosque?.mosqueProfile?.image);

    const handleFollowMosque = async (e, mosque) => {
      e.stopPropagation(); // prevent opening mosque
      try {
        const res = await privateAxiosInstance.post(`/mosques/${mosque.id}/follow`);
        if (res.status < 400) {
          console.log('Followed successfully', res.data);
          // Optionally, update the local state to reflect the follow
        
        }
      } catch (err) {
        if (isDev) {
          console.log(err.response.data.message || err.message);
        }
      }
    };

  // SELECT IMAGE
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // CANCEL CHANGE
  const handleCancel = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  // SAVE (UPLOAD)
  const handleUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
      
        const data = await res.json();
       
          const imageUrl = data.secure_url;
          const publicId = data.public_id;
         const apiRes = await privateAxiosInstance.put(`/profiles/update-mosque-profile/${mosque.id}`, { imageUrl, publicId });
         if(apiRes.status < 400){
          console.log('mosque Profile updated successfully', apiRes.data.userProfile);
            setOriginalImage(imageUrl); // update original image to new one
         }

      // reset state
      setPreview(null);
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-[87%] mx-auto mt-5">

      {/* IMAGE SECTION */}
      <div className="relative h-[340px] w-full group bg-gray-200">

        {/* IMAGE (preview overrides original) */}
        <img
          src={preview || originalImage}
          className="h-full w-full object-cover"
          alt="Mosque"
        />

        {/* TOP OVERLAY (only when editing) */}
        {preview && (
          <div className="absolute top-0 left-0 right-0 bg-black/60 text-white flex items-center justify-between px-4 py-3">

            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <p className="text-sm">Preview mode</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 bg-white/20 rounded-lg hover:bg-white/30"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-1.5 bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* CAMERA BUTTON */}
        <label className="absolute bottom-3 right-3 bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-emerald-800">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectImage}
          />
        </label>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4">

        {/* NAME + STATUS */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {mosque.name}
          </h2>

          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {mosque.status}
          </span>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>
            {mosque.localGovernment}, {mosque.state}, {mosque.country}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {mosque.description}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {mosque.followersCount} {mosque.followersCount > 1 ? "followers" : "follower"}
          </span>
 \

   {loggedInUser && mosque.isFollowing === 1 ? (
     <span className="text-sm text-emerald-600 font-medium">
              Following
            </span>
           
          ) : (
           <span className="text-sm text-emerald-600 font-medium">
              unfollowing
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MosqueProfile;