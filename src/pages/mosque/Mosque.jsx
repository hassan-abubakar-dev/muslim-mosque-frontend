import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import DeleteMosqueModal from './DeleteMosqueModal.jsx';
import SuspendMosqueModal from './SuspendMosqueModal.jsx';

const Mosque = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, toastToCreateAccountMessage, setToastToCreateAccountMessage, followMosqueIds, 
  setFollowMosqueIds, mosques } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [openReportModel, setOpenReportModel] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [Error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: 'Quran', information: '', teacherName: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const isDev = import.meta.env.VITE_ENV === 'development';

 const activeMosque = useMemo(() => {
  return mosques.find((m) => String(m.id) === String(id)) || null;
}, [mosques, id]);

 
const isSuperAdmin = loggedInUser?.role === 'superAdmin';

const isOwner = loggedInUser?.managedMosques?.some(
  (m) => String(m.id) === String(activeMosque?.id)
);

// This variable will determine if the user can perform "Admin" actions
const canManage = isOwner || isSuperAdmin;
  const handleProtectedAction = (actionCallback) => {
    if (!loggedInUser) {
      setToastToCreateAccountMessage("Please log in to perform this action.");
      return;
    }
    actionCallback();
  };

  // Updated: Now using the imported utility
 const isFollowing = followMosqueIds.includes(String(activeMosque?.id));
  
  const handleToggleFollow = async () => {
  const { success, mosqueId, follow } = await toggleMosqueFollow(activeMosque.id);
  
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
    if (!activeMosque) {
      setCategories([]);
      return;
    }
    fetchAllCategories(activeMosque.id);
  }, [activeMosque]);

  if (!activeMosque) return <MosqueLoadingSkeleton />;

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
         mosque={activeMosque}
         followMosqueIds={followMosqueIds}
       />

      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between gap-4 mt-5 md:ml-10">
        <div className="flex items-center gap-10 md:gap-48">
          <button onClick={() => navigate(`/mosque/${id}/announcements`)} className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">Announcements</button>
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

      {showModal && <Model newCategory={newCategory} setNewCategory={setNewCategory} setShowModal={setShowModal} isEdit={isEdit} setError={setError} activeMosque={activeMosque} fetchAllCategories={fetchAllCategories} />}
      {showCreateAnnouncementModal && <CreateAnnouncementModal isOpen={showCreateAnnouncementModal} onClose={() => setShowCreateAnnouncementModal(false)} mosque={activeMosque} onCreated={() => setShowCreateAnnouncementModal(false)} />}
      {openReportModel && <ReportCard mosqueId={activeMosque.id} mosqueName={activeMosque.name} onClose={() => setOpenReportModel(false)} />}
      <AnnouncementModal announcement={selectedAnnouncement} isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />

    <CategoryCart
      categories={categories}
      isOwner={isOwner}
      setCategories={setCategories}
      setIsEdit={setIsEdit}
      setShowModal={setShowModal}
      setNewCategory={setNewCategory}
    />

    {showDeleteModal && (
  <DeleteMosqueModal 
    isOpen={showDeleteModal} 
    onClose={() => setShowDeleteModal(false)}
    mosque={activeMosque}
    navigate={navigate}
  />
)}

{showSuspendModal && (
  <SuspendMosqueModal 
    isOpen={showSuspendModal} 
    onClose={() => setShowSuspendModal(false)}
    mosque={activeMosque}
    navigate={navigate}
  />
)}

{/* Consolidated Moderation Area */}
{isSuperAdmin && (
  <div className="max-w-6xl mx-auto mt-12 mb-20 flex flex-col items-center gap-4">
    
    {/* 1. SUSPEND/UNSUSPEND TOGGLE */}
    {activeMosque?.status !== 'pending' && (
      <button 
        onClick={() => setShowSuspendModal(true)} // Or call your new API route directly
        className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 border ${
          activeMosque?.status === 'suspended' 
            ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50' 
            : 'border-amber-600 text-amber-700 hover:bg-amber-50'
        }`}
      >
        {activeMosque?.status === 'suspended' ? (
          <><Check size={18} /> Verify (Unsuspend)</>
        ) : (
          <><Bell size={18} /> Suspend Mosque</>
        )}
      </button>
    )}

    {/* 2. DELETE ACTION */}
    <button 
      onClick={() => setShowDeleteModal(true)}
      className="text-rose-600 border border-rose-600 px-6 py-2 rounded-lg font-semibold hover:bg-rose-50 transition-colors flex items-center gap-2"
    >
      <Trash2 size={18} /> Delete Mosque
    </button>
  </div>
)}
    </div>
  );
};

export default Mosque;




