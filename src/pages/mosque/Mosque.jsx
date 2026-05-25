import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2, Flag, X, Check, Bell } from 'lucide-react';
import MosqueLoadingSkeleton from '../../components/loadingSkeletons/MosqueLoadingSkeleton';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import Toast from '../../components/Toast';
import MosqueProfile from './MosqueProfile';
import Model from './Model';
import AnnouncementModal from './AnnouncementModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import { UserContext } from '../../context/UserContext';
import ReportCard from './ReportCartModel';
import { toggleMosqueFollow } from '../../util/follow.js'; 
import ToastToCreateAccount from '../../components/ToastToCreateAccount.jsx';
import CategoryCart from './CategoryCart.jsx';

const Mosque = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedInUser, toastToCreateAccountMessage, setToastToCreateAccountMessage, followMosqueIds, 
  setFollowMosqueIds } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
  const [isValidMosque, setIsValidMosque] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [openReportModel, setOpenReportModel] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [Error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: 'Quran', information: '', teacherName: '' });

  const isDev = import.meta.env.VITE_ENV === 'development';
  const [mosqueFromState, setMosqueFromState] = useState(location.state?.mosque || null);

  const isOwner = loggedInUser?.managedMosques?.some(
    (m) => String(m.id) === String(mosqueFromState?.id)
  );

  const handleProtectedAction = (actionCallback) => {
    if (!loggedInUser) {
      setToastToCreateAccountMessage("Please log in to perform this action.");
      return;
    }
    actionCallback();
  };

  // Updated: Now using the imported utility
  const isFollowing = followMosqueIds.includes(String(mosqueFromState?.id));
  
  const handleToggleFollow = async () => {
  const { success, mosqueId, follow } = await toggleMosqueFollow(mosqueFromState.id);
  
  if (success) {
    const formattedId = String(mosqueId);
    
    // Update global state
    if (follow) {
      setFollowMosqueIds(prev => Array.from(new Set([...prev, formattedId])));
    } else {
      setFollowMosqueIds(prev => prev.filter(id => id !== formattedId));
    }
    
    setShowUnfollowConfirm(false);
  } else {
    setError(true);
  }
};

  const fetchAllCategories = async (mosqueId) => {
    try {
      const res = await privateAxiosInstance.get(`/categories/get-category/${mosqueId}`);
      if (res.status < 400) setCategories(res.data.categories);
    } catch (err) {
      if (isDev) console.error(err);
      else setError(true);
    }
  };

  useEffect(() => {
    if (mosqueFromState && String(mosqueFromState.id) === String(id)) setIsValidMosque(true);
  }, [mosqueFromState, id]);

  useEffect(() => {
    if (isValidMosque) fetchAllCategories(mosqueFromState.id);
  }, [isValidMosque]);

  if (!isValidMosque) return <MosqueLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      {Error && <Toast />}

      {/* Login Toast Notification */}
      {toastToCreateAccountMessage && (
       <ToastToCreateAccount
         toastToCreateAccountMessage={toastToCreateAccountMessage}
         setToastToCreateAccountMessage={setToastToCreateAccountMessage}
        />
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Unfollow Mosque?</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure? You will stop receiving notifications and updates from this mosque.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUnfollowConfirm(false)} className="text-gray-500 font-medium px-4">Cancel</button>
              <button onClick={handleToggleFollow} className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold">Confirm Unfollow</button>
            </div>
          </div>
        </div>
      )}

      <MosqueProfile
         mosque={mosqueFromState}
         followMosqueIds={followMosqueIds}
       />

      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between gap-4 mt-5 md:ml-10">
        <div className="flex items-center gap-10 md:gap-48">
          <button onClick={() => navigate(`/mosque/${id}/announcements`, { state: { mosqueFromState } })} className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">Announcements</button>
          {isOwner && (
            <button onClick={() => setShowCreateAnnouncementModal(true)} className="bg-gray-200 text-emerald-800 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-300 ">+ <span className='hidden md:inline'>Create</span> Announcement</button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {!isOwner && (
            <button onClick={() => handleProtectedAction(() => setOpenReportModel(true))} className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-rose-100 flex items-center gap-2">
              <Flag size={15} /> Report
            </button>
          )}
          {!isOwner && (
            isFollowing? (
              <button onClick={() => setShowUnfollowConfirm(true)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 flex items-center gap-2">
                <Check size={15} /> Following
              </button>
            ) : (
              <button onClick={() => handleProtectedAction(handleToggleFollow)} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-100 flex items-center gap-2">
                <Bell size={15} /> Follow
              </button>
            )
          )}
        </div>

        {isOwner && (
          <button className="bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-800 md:mr-10" onClick={() => { setShowModal(true); setIsEdit(false); }}>+ <span className='hidden md:inline '>Create</span> Category</button>
        )}
      </div>

      {showModal && <Model newCategory={newCategory} setNewCategory={setNewCategory} setShowModal={setShowModal} isEdit={isEdit} setError={setError} mosqueFromState={mosqueFromState} fetchAllCategories={fetchAllCategories} />}
      {showCreateAnnouncementModal && <CreateAnnouncementModal isOpen={showCreateAnnouncementModal} onClose={() => setShowCreateAnnouncementModal(false)} mosqueFromState={mosqueFromState} onCreated={() => setShowCreateAnnouncementModal(false)} />}
      {openReportModel && <ReportCard mosqueId={mosqueFromState.id} mosqueName={mosqueFromState.name} onClose={() => setOpenReportModel(false)} />}
      <AnnouncementModal announcement={selectedAnnouncement} isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />

    <CategoryCart
      categories={categories}
      isOwner={isOwner}
      setCategories={setCategories}
      setIsEdit={setIsEdit}
      setShowModal={setShowModal}
      setNewCategory={setNewCategory}
    />
    </div>
  );
};

export default Mosque;




