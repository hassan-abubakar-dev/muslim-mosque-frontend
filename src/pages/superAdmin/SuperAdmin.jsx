import React, { useEffect, useState } from 'react';
import { Activity, Eye } from 'lucide-react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance.js';
import SelectedMosqueModel from './SelectedMosqueModel.jsx';
import SplashScreen from '../../components/loadingSkeletons/SplashScreen.jsx';
import { useUserContext } from '../../context/UserContext.jsx';
import AdminMetrics from './AdminMetrics.jsx';
import PendingMosqueReview from './PendingMosqueReview.jsx';
import UserRoster from './UserRoster.jsx';
import ReportList from './ReportList.jsx';
import FeedbackList from './FeedbackList.jsx';
import SuspendedMosqueList from './SuspendedMosqueList.jsx';


export default function SuperAdminDashboard() {
  const { loggedInUser } = useUserContext();
  const [activeTab, setActiveTab] = useState('agents');
  const [authLoading, setAuthLoading] = useState(true);

  const [stats, setStats] = useState({
    usersCounts: { totalActiveUsers: 0, totalInActiveUsers: 0, totalAgents: 0 },
    mosquesCounts: { totalVerifiedMosques: 0, totalPendingMosques: 0 },
    pendingReportsCount: 0,
    pendingFeedbackCount: 0
  });

  const [pendingMosques, setPendingMosques] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [suspendedMosques, setSuspendedMosques] = useState([]);

  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await privateAxiosInstance.get('/super-admin/dashboard-stats');
      if (res.status === 200) {
        setStats(res.data.data);
      }
    } catch (err) { console.error("Stats fetch failed", err); }
  };

  const fetchPendingMosques = async () => {
    try {
      const res = await privateAxiosInstance.get('mosques/get-pending-mosque', { params: { limit: 10, page: 1 } });
      setPendingMosques(res.data.pendingMosques);
    } catch (err) { console.error(err); }
  };

const fetchUsers = async (search = '', page = 1, reset = false) => {
  try {
    const res = await privateAxiosInstance.get('users/get-users', { 
      params: { page, limit: 10, search } 
    });
    
    if (res.status === 200) {
      const { users, totalPages, currentPage } = res.data;
      
      setUserDirectory(prev => {
        const combined = reset ? users : [...prev, ...users];
        // Remove duplicates based on ID
        const uniqueUsers = Array.from(new Map(combined.map(u => [u.id, u])).values());
        return uniqueUsers;
      });
      
      setHasMoreUsers(currentPage < totalPages);
      setUserPage(currentPage);
    }
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};


const updateUserRoleLocally = (userId, newRole) => {
  setUserDirectory(prevUsers => 
    prevUsers.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    )
  );
};


useEffect(() => {
  // Add a simple check: only fetch if directory is empty
  if (loggedInUser?.role === 'superAdmin' && userDirectory.length === 0) {
    setAuthLoading(false);
    fetchDashboardStats();
    fetchPendingMosques();
    fetchUsers('', 1, true);
  }
}, [loggedInUser]); // Removing userDirectory from dependencies

  if (authLoading) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8 mb-20">
        <h1 className="text-3xl font-black text-emerald-900 flex items-center gap-2">
          <Activity className="text-emerald-700 w-8 h-8" /> Platform Control Center
        </h1>

        {/* COMPREHENSIVE STATS GRID */}
        <AdminMetrics stats={stats} />

        {/* QUEUE & TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="h-full">
            <PendingMosqueReview
              pendingMosques={pendingMosques}
              setSelectedMosque={setSelectedMosque}
            />
          </div>

          <div className="lg:col-span-2 h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
            <div className="flex border-b border-gray-100 px-4 pt-2 gap-2">
              {['agents', 'reports', 'feedbacks', 'suspensions'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-xs font-bold border-b-2 capitalize ${activeTab === tab ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-gray-400'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">
          
              {activeTab === 'agents' && (
                <UserRoster
                  users={userDirectory}
                  fetchUsers={fetchUsers}
                 updateUserRoleLocally={updateUserRoleLocally}
                  hasMore={hasMoreUsers}
                  currentPage={userPage}
                />
              )}
              {activeTab === 'reports' && (
                <ReportList />
              )}
              {activeTab === 'feedbacks' && (
                <FeedbackList />
              )}
               {activeTab === 'suspensions' && (
                <SuspendedMosqueList 
                  setSelectedMosque={setSelectedMosque}
                   mosques={suspendedMosques}         
                   setMosques={setSuspendedMosques}
               />
              )}
            </div>
          </div>
        </div>
      </div>
{selectedMosque && (
  <SelectedMosqueModel
    selectedMosque={selectedMosque}
    setSelectedMosque={setSelectedMosque}
    setPendingMosques={setPendingMosques}
    setSuspendedMosques={setSuspendedMosques} 
  />
)}
    </div>
  );
}