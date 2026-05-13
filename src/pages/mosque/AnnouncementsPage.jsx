import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import MosqueProfile from './MosqueProfile';
import AnnouncementModal from './AnnouncementModal';
import truncateByWords from '../../util/splitWord';

const AnnouncementsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data - replace with API call later
  const [mosque, setMosque] = useState(location?.state?.mosqueFromState || [])
  console.log(location?.state?.mosqueFromState);
  
  
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Ramadan Prayer Schedule',
      description: 'Join us for special Ramadan prayers every evening. Full description here with more details about the schedule, timings, and what to expect.',
      image: null,
      createdAt: '2024-03-15'
    },
    {
      id: 2,
      title: 'Community Iftar',
      description: 'Community Iftar event this Friday. Bring your family! We will have food, prayers, and community activities.',
      image: 'https://example.com/image.jpg',
      createdAt: '2024-03-10'
    }
  ];

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const openAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const closeAnnouncement = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Mosque Card at Top */}
        <MosqueProfile mosque={mosque} />

        {/* Announcements List */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Announcements</h2>
          
          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => openAnnouncement(announcement)}
              >
                <h3 className="text-lg font-semibold text-emerald-700">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {/* Mobile: 12 words limit */}
                  <span className="md:hidden">
                    {truncateByWords(announcement.description, 6)}
                  </span>
                  {/* MD and above: 20 words limit */}
                  <span className="hidden md:inline">
                    {truncateByWords(announcement.description, 16)}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Calendar size={16} className="text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-700">{announcement.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Detail Modal */}
        <AnnouncementModal 
          announcement={selectedAnnouncement}
          isOpen={!!selectedAnnouncement}
          onClose={closeAnnouncement}
        />
      </div>
    </div>
  );
};

export default AnnouncementsPage;