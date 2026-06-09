import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { Calendar, Loader2, Trash2 } from 'lucide-react';
import MosqueProfile from './MosqueProfile';
import AnnouncementModal from './AnnouncementModal';
import truncateByWords from '../../util/splitWord';
import SplashScreen from '../../components/loadingSkeletons/SplashScreen';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import { UserContext } from '../../context/UserContext';
import AnnouncementSkeleton from '../../components/loadingSkeletons/AnnouncementSkeleton';
import MosqueProfileSkeleton from '../../components/loadingSkeletons/MosqueProfileSkeleton';

const AnnouncementsPage = () => {
  const { id } = useParams();
  const { mosques, loggedInUser } = useContext(UserContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const observerTarget = useRef(null);

  const mosque = useMemo(
    () => mosques.find((m) => String(m.id) === String(id)) || null,
    [mosques, id]
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

const isSuperAdmin = loggedInUser?.role === 'superAdmin';

const isOwner = loggedInUser?.managedMosques?.some(
  (m) => String(m.id) === String(mosque?.id)
);

const canDeleteAnnouncement = isSuperAdmin || isOwner;



  const handleDeleteAnnouncement = async (announcementId) => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const res = await privateAxiosInstance.delete(`/announcements/delete-announcement/${announcementId}`);

      if (res.status < 400) {
        console.log(res.data)
        setAnnouncements((prev) => prev.filter((item) => String(item.id) !== String(announcementId)));
        if (selectedAnnouncement?.id === announcementId) {
          setSelectedAnnouncement(null);
        }
        setAnnouncementToDelete(null);
      } else {
        throw new Error('Failed to delete announcement.');
      }
    } catch (err) {
      console.error('Announcement delete failed:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete announcement.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAnnouncements = async (pageNum, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await privateAxiosInstance.get(`/announcements/get-announcements/${mosque?.id || id}`, {
        params: { page: pageNum, limit: 10 }
      });

      const { announcements: newData, totalItems } = res.data;
      
      setAnnouncements(prev => isInitial ? newData : [...prev, ...newData]);
      setHasMore(announcements.length + newData.length < totalItems);
   
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    if (id) fetchAnnouncements(1, true);
  }, [id]);

  // Infinite Scroll Observer
// Infinite Scroll Observer
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      // We check !isFetchingMore and hasMore here
      if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAnnouncements(nextPage);
      }
    },
    { threshold: 0.1 } // Changed to 0.1 so it triggers before the user hits the very bottom
  );

  const currentTarget = observerTarget.current;
  if (currentTarget) observer.observe(currentTarget);

  return () => {
    if (currentTarget) observer.unobserve(currentTarget);
  };
  // ADDED: 'announcements' to dependencies
}, [hasMore, isFetchingMore, page, announcements]);

  if (loading) return <><MosqueProfileSkeleton /><AnnouncementSkeleton /> </>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20 mb-10">
      <div className="max-w-4xl mx-auto">
        {mosque && <MosqueProfile mosque={mosque} />}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Announcements</h2>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                  {canDeleteAnnouncement && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnnouncementToDelete(announcement);
                      }}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-rose-600 transition"
                      aria-label="Delete announcement"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {truncateByWords(announcement.content, 16)}
                </p>
                <div className="flex items-center gap-2 mt-4 text-emerald-700">
                  <Calendar size={16} />
                  <span className="text-xs font-medium">{formatDate(announcement.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Observer Target */}
          <div ref={observerTarget} className="py-8 flex justify-center">
            {isFetchingMore && <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />}
          </div>
        </div>

        <AnnouncementModal 
          announcement={selectedAnnouncement}
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          formatDate={formatDate}
        />

        {announcementToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delete announcement?</h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. Are you sure you want to delete "{announcementToDelete.title}"?
              </p>
              {deleteError && (
                <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setAnnouncementToDelete(null)}
                  disabled={isDeleting}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(announcementToDelete.id)}
                  disabled={isDeleting}
                  className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Delete announcement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;