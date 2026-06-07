import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import MosqueProfile from './MosqueProfile';
import AnnouncementModal from './AnnouncementModal';
import truncateByWords from '../../util/splitWord';
import SplashScreen from '../../components/loadingSkeletons/SplashScreen';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

const AnnouncementsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Mosque state persists from navigation or could be fetched via ID
  const [mosque] = useState(location?.state?.mosqueFromState || null);
  const observerTarget = useRef(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
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
    if (mosque || id) fetchAnnouncements(1, true);
  }, [mosque, id]);

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

  if (loading) return <SplashScreen />;

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
                <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
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
      </div>
    </div>
  );
};

export default AnnouncementsPage;