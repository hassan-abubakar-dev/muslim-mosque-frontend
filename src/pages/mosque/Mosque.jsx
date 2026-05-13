import { useEffect, useState, useContext } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MosqueLoadingSkeleton from '../../components/loadingSkeletons/MosqueLoadingSkeleton';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import Toast from '../../components/Toast';
import { Calendar, MoreVertical, Pencil, Trash2, Bell, Pin } from 'lucide-react';
import MosqueProfile from './MosqueProfile';
import Model from './Model';
import AnnouncementModal from './AnnouncementModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import mockNotifications from './notificationsData';
import InlineLoader from '../../components/loadingSkeletons/InlineLoader';
import { UserContext } from '../../context/UserContext';
import truncateByWords from '../../util/splitWord';

const Mosque = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
  const [isValidMosque, setIsValidMosque] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(5);

  const isDev = import.meta.env.VITE_ENV === 'development';

  const { id } = useParams();
  const location = useLocation();

  const [mosqueFromState, setMosqueFromState] = useState(location.state?.mosque || null);
  const [Error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  // console.log(test?.id);
  

  const [isEdit, setIsEdit] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Ramadan Prayer Schedule',
      description: 'Join us for special Ramadan prayers every evening. Full description here...',
      image: null,
      createdAt: '2024-03-15'
    },
    {
      id: 2,
      title: 'Community Iftar',
      description: 'Community Iftar event this Friday. Bring your family!',
      image: 'https://example.com/image.jpg',
      createdAt: '2024-03-10'
    }
  ];

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

        <MosqueProfile mosque={mosqueFromState} />

        {/* Announcement Buttons */}
        <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4 relative">
          <button
            onClick={() => navigate(`/mosque/${id}/announcements`, {state: {mosqueFromState}})}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-700 cursor-pointer"
          >
            Announcements
          </button>
          {loggedInUser && loggedInUser.managedMosques?.some(m => String(m.id) === String(mosqueFromState.id)) && (
            <button
              onClick={() => setShowCreateAnnouncementModal(true)}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-600 cursor-pointer"
            >
              Create Announcement
            </button>
          )}

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowNotifications((prev) => !prev);
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Bell size={20} />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 min-w-[320px] max-w-[360px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(`/mosque/${id}/notifications`, { state: { mosqueFromState } });
                    }}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    See all
                  </button>
                </div>
                <div className="max-h-96 space-y-2 overflow-y-auto p-3">
                  {mockNotifications.slice(0, visibleNotificationsCount).map((notification) => (
                    <div key={notification.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{notification.description}</p>
                    </div>
                  ))}
                </div>
                {visibleNotificationsCount < mockNotifications.length && (
                  <div className="border-t border-gray-200 p-3">
                    <button
                      onClick={() => setVisibleNotificationsCount(mockNotifications.length)}
                      className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcement Card */}
        {mockAnnouncements.length > 0 && (
          <div className="max-w-6xl mx-auto mb-6">
            <div
              className="relative bg-white p-4 rounded-xl shadow-md border-l-4 border-emerald-500 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedAnnouncement(mockAnnouncements[0])}
            >
              <div className="absolute right-4 top-4 rounded-full bg-emerald-600 p-2 text-white shadow-lg">
                <Pin size={16} />
              </div>
              <h3 className="text-lg font-semibold text-emerald-700">{mockAnnouncements[0].title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {/* Mobile: 12 words limit */}
                <span className="md:hidden">
                  {truncateByWords(mockAnnouncements[0].description, 6)}
                </span>
                {/* MD and above: 20 words limit */}
                <span className="hidden md:inline">
                  {truncateByWords(mockAnnouncements[0].description, 16)}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Calendar size={16} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">21/2/2025</p>
              </div>
            </div>
          </div>
        )}


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

        {showCreateAnnouncementModal && (
          <CreateAnnouncementModal
            isOpen={showCreateAnnouncementModal}
            onClose={() => setShowCreateAnnouncementModal(false)}
            mosqueFromState={mosqueFromState}
            onCreated={() => {
              setShowCreateAnnouncementModal(false);
            }}
          />
        )}

        {/* Announcement Modal */}
        <AnnouncementModal
          announcement={selectedAnnouncement}
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />


        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-emerald-800">Islamic Knowledge Categories</h1>
            {loggedInUser && loggedInUser.managedMosques?.some(m => String(m.id) === String(mosqueFromState.id)) && (
                 <button className="bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 cursor-pointer" onClick={() => { setShowModal(true), setIsEdit(false) }}>
              + Create Category
            </button>
            )}
          
        
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-50">
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
