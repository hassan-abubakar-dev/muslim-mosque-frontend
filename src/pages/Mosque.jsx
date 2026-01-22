import { useEffect, useState } from 'react';
import Profile from '../assets/profile.jpg';
import { Camera } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import MosqueLoadingSkeleton from '../components/loadingSkeletons/MosqueLoadingSkeleton';
import privateAxiosInstance from '../../auth/privateAxiosInstance';
import Toast from '../components/Toast';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';


const Mosque = () => {
  const [showModal, setShowModal] = useState(false);
  const [isValidMosque, setIsValidMosque] = useState(false);

  const isDev = import.meta.env.VITE_ENV === 'development';

  const { id } = useParams();
  const location = useLocation();

  const mosqueFromState = location.state?.mosque || null;

   const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);
  const [createCategoryError, setCreateCategoryError] = useState('');
  const [categories, setCategories] = useState([]);
const [openMenuId, setOpenMenuId] = useState(null);

  const fetchAllCategories = async(id) => {
  try{
    const res = await privateAxiosInstance.get(`/categories/get-category/${id}`);
    if(res.status < 400){
      setCategories(res.data.categories)
      
    }
  }
  catch(err){

    
    if(isDev){
      console.error(err?.response?.data || err.message);
    }else{
      setError(true);
    }
  }
 
  
}


  // validation


  useEffect(() => {
    if (mosqueFromState && String(mosqueFromState.id) === String(id)) {
      setIsValidMosque(true);
    }
    // optional: if you want, you can set false explicitly if invalid
  }, [mosqueFromState, id]);;


  useEffect(() => {
    // fetch initial functions if use visit correct rout
    fetchAllCategories(mosqueFromState.id);
  }, [isValidMosque]);

  const initialCategory = {
    name: 'Quran',
    information: '',
    teacherName: ''
  }

  const [newCategory, setNewCategory] = useState(initialCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async(id) => {
    const body = {
      name: newCategory.name,
      teacherName: newCategory.teacherName, 
      information: newCategory.information
    }
  

    setNewCategory(initialCategory)
    setLoading(true)
    try{
      const res = await privateAxiosInstance.post(`/categories/create-category/${id}`, body);
      if(res.status < 400){
         setShowModal(false);
    setCreateCategoryError('');
        
         setLoading(false);
      }
    }
    catch(err){
      setLoading(false)
    

      if(err.response.data.message === 'Teacher name is required'){
        setCreateCategoryError('Teacher name is required');
      }else if(err.response.data.message === 'Category with this name and teacher already exists'){
        setCreateCategoryError('Category with this name and teacher already exists')
      }else{
          setShowModal(false);
      }
       if(isDev){
            console.error(err.response.data.messge || err.message);
       }else{
        setError(true);
       }
    }
   
  };
  const getMosqueProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return
  };


  if (isValidMosque) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 mt-20">

{Error && <Toast />}


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


        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Create Category</h2>
 {createCategoryError && <div className="text-sm text-red-600">{createCategoryError}</div>}
              {/* Category Name */}
              <label className="block mb-2">
                <span className="text-gray-700 text-sm">Category Name *</span>
                <select
                  name="name"
                  required
                  value={newCategory.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="Quran">Quran</option>
                  <option value="Hadith">Hadith</option>
                  <option value="Tafseer">Tafseer</option>
                  <option value="Fiqh">Fiqh</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {/* Show input if "Other" selected */}
              {newCategory.name === "Other" && (
                <label className="block mb-2">
                  <span className="text-gray-700 text-sm">Custom Category Name *</span>
                  <input
                    type="text"
                    name="customName"
                    value={newCategory.customName || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    placeholder="Enter category name"
                  />
                </label>
              )}

              {/* Category Info */}
              <label className="block mb-2">
                <span className="text-gray-700 text-sm">Category Info</span>
                <textarea
                  name="information"
                  value={newCategory.information}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder="Enter category description"
                />
              </label>

              {/* Teacher Name */}
              <label className="block mb-2">
                <span className="text-gray-700 text-sm">Teacher Name</span>
                <input
                  type="text"
                  name="teacherName"
                  required
                  value={newCategory.teacherName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder="Enter teacher name"
                />
              </label>

              {/* Teacher Image Upload */}
              <label className="block mb-4">
                <span className="text-gray-700 text-sm">Teacher Image</span>
                <input
                  type="file"
                  name="teacherImage"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setNewCategory((prev) => ({ ...prev, teacherImage: file }));
                    console.log("Uploaded file:", file);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-emerald-700 file:text-white hover:file:bg-emerald-800"
                />
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateCategory(mosqueFromState.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-emerald-800">Islamic Knowledge Categories</h1>
            <button className="bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 cursor-pointer" onClick={() => { setShowModal(true) }}>
              + Create Category
            </button>
          </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((cat) => (
    <div
      key={cat.id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col relative"
    >

      {/* Image / Placeholder */}
      {cat.image ? (
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-5xl">
          {cat.name.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 min-h-[160px]">

        {/* Title row */}
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-lg text-gray-800">
            {cat.name}
          </h4>

          <span className="text-sm text-gray-500 font-medium">
            {cat.teacherName}
          </span>
        </div>

        {/* Information */}
        {cat.information && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {cat.information}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 relative">

             <button className="bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-emerald-800 cursor-pointer">
            View Lectures
          </button>

          {/* Ellipsis */}
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === cat.id ? null : cat.id)
            }
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown */}
          {openMenuId === cat.id && (
            <div className="absolute right-0 -top-15 bg-white border  rounded-lg shadow-lg w-36 z-20">
              <button
                onClick={() => {
                  setOpenMenuId(null);
                  handleEditCategory(cat);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full rounded-lg cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-emerald-700" />
                Edit
              </button>

              <button
                onClick={() => {
                  setOpenMenuId(null);
                  handleDeleteCategory(cat.id);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 rounded-lg cursor-pointer hover:bg-red-50 w-full"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    )
  } else {
    return <MosqueLoadingSkeleton />
  }

};

export default Mosque;
