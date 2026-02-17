import { useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MosqueLoadingSkeleton from '../../components/loadingSkeletons/MosqueLoadingSkeleton';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import Toast from '../../components/Toast';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import MosqueProfile from './MosqueProfile';
import Model from './Model';
import InlineLoader from '../../components/loadingSkeletons/InlineLoader';


const Mosque = () => {
  const [showModal, setShowModal] = useState(false);
  const [isValidMosque, setIsValidMosque] = useState(false);

  const isDev = import.meta.env.VITE_ENV === 'development';

  const { id } = useParams();
  const location = useLocation();

  const mosqueFromState = location.state?.mosque || null;
  const [Error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  // console.log(test?.id);
  

  const [isEdit, setIsEdit] = useState(false);

  const fetchAllCategories = async (id) => {
    try {
      const res = await privateAxiosInstance.get(`/categories/get-category/${id}`);
      if (res.status < 400) {
        setCategories(res.data.categories)

      }
    }
    catch (err) {


      if (isDev) {
        console.error(err?.response?.data || err.message);
      } else {
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







  const editCategory = (cat) => {
    setOpenMenuId(false);
    setShowModal(true);
    setIsEdit(true);
    setNewCategory(cat)
  };

  const deleteCategory = async(id) => {
    try{
      const res = await privateAxiosInstance.delete(`/categories/delete-category/${id}`);
       if(res.status < 400){
          console.log(res.data);
          setOpenMenuId(false);
          setCategories(prev => prev.filter(cat => cat.id !== id));
       }
    }
    catch(err){
       if(isDev){
        console.log(err.response.data);
       }
       else{
        setError(true);
       }
       
    }

  }


  if (isValidMosque) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 mt-20">

        {Error && <Toast />}

        <MosqueProfile />


        {showModal && (
          <Model
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            initialCategory={initialCategory}
            setShowModal={setShowModal}
            isEdit={isEdit}
            setError={setError}
            mosqueFromState={mosqueFromState}
          />
        )}


        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-emerald-800">Islamic Knowledge Categories</h1>
            <button className="bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 cursor-pointer" onClick={() => { setShowModal(true), setIsEdit(false) }}>
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
                {cat?.categoryProfile ? (
                  <img
                    src={cat.categoryProfile.image}
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

                    <button className="bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm hover:bg-emerald-800 cursor-pointer" 
                      onClick={() => {navigate('/category/lacture', {state: {cat}}); setTest(cat)}}
                    >
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
                          onClick={() => editCategory(cat)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-emerald-700" />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCategory(cat.id)}
                          disabled={deleteLoading}
                          className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 rounded-lg cursor-pointer hover:bg-red-50 w-full ${deleteLoading && 'cursor-not-allowed'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
  {deleteLoading &&                                                <div
      className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-emerald-700"
      style={{ width: 20, height: 20 }}
    />}
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
