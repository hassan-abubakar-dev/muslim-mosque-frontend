import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  AlertOctagon, 
  Search, 
  Activity,
  Eye,
  UserPlus,
  ChevronDown,
  Flag
} from 'lucide-react';

import privateAxiosInstance from '../../../auth/privateAxiosInstance.js'
import SelectedMosqueModel from './SelectedMosqueModel.jsx';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('agents');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // ==========================================
  // 📉 INDEPENDENT PROGRESSIVE LIMIT TRACKERS
  // ==========================================
  const [reportLimit, setReportLimit] = useState(5);
  const [feedbackLimit, setFeedbackLimit] = useState(5);

  const [usersCounts, setUsersCounts] = useState(null);
  const [mosquesCounts, setMosquesCounts] = useState(null);
  
  // ==========================================
  // 🛠️ PAGINATION & LAZY LOADING STATE
  // ==========================================
  const [pendingMosques, setPendingMosques] = useState([]);
  const [pendingMosquePage, setPendingMosquePage] = useState(1);
  const [totalPendingMosqueCounts, setTotalPendingMosqueCounts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  // ==========================================
  // 👥 REAL BACKEND USER STATE
  // ==========================================
  const [userDirectory, setUserDirectory] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const fetchUsersCount = async() => {
    try {
      const res = await privateAxiosInstance.get('users/get-analysis');
      if(res.status < 400) setUsersCounts(res.data.usersCounts);
    } catch(err) { console.error(err.response?.data); }
  };

  const fetchMosquesCount = async() => {
    try {
      const res = await privateAxiosInstance.get('mosques/get-analysis');
      if(res.status < 400) setMosquesCounts(res.data.mosquesCounts);
    } catch(err) { console.error('mosques', err.response?.data); }
  };

  const fetchPendingMosque = async (pageToFetch) => {
    setIsLoading(true);
    try {
      const res = await privateAxiosInstance.get('mosques/get-pending-mosque', {
        params: { limit, page: pageToFetch }
      });

      if (res.status < 400) {
        setPendingMosques(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMosques = res.data.pendingMosques.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMosques];
        });
        setTotalPendingMosqueCounts(res.data.totalCounts);
        setPendingMosquePage(pageToFetch);
      }
    } catch(err) {
      console.error('mosques', err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (page = 1, search = '', reset = false) => {
    setIsUserLoading(true);
    try {
      const res = await privateAxiosInstance.get('users/get-users', {
        params: { page, limit: 10, search }
      });
      if (res.status === 200) {
        setUserDirectory(prev => reset ? res.data.users : [...prev, ...res.data.users]);
        setTotalUserCount(res.data.totalUsers);
        setUserPage(page);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(1, userSearchTerm, true);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [userSearchTerm]);

  const handleLoadMoreUsers = () => {
    fetchUsers(userPage + 1, userSearchTerm, false);
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      fetchPendingMosque(pendingMosquePage + 1);
    }
  };

  useEffect(() => {
    fetchUsersCount();
    fetchMosquesCount();
    fetchPendingMosque(1);
    fetchUsers(1, '', true);
  }, []);

  const [hasFetchedReports, setHasFetchedReports] = useState(false);
  const [hasFetchedFeedback, setHasFetchedFeedback] = useState(false);

  const mockStats = { openTicketsCount: 3 };

  const [mosqueReports, setMosqueReports] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'mosque-reports' && !hasFetchedReports) {
      setMosqueReports([
        { id: "mr-1", targetMosqueName: "Al-Huda Institute", reportedBy: "Omar F.", message: "The address listed on this mosque profile points to an incorrect street block.", status: "Open" },
        { id: "mr-2", targetMosqueName: "Central Mosque Hub", reportedBy: "Ali H.", message: "Wrong phone number listed on the profile information panel.", status: "Open" }
      ]);
      setHasFetchedReports(true);
    }
    if (tabName === 'user-feedback' && !hasFetchedFeedback) {
      setUserFeedback([
        { id: "fb-1", senderName: "Amina Alami", email: "amina@example.com", type: "Bug Report", message: "The video playback lag drops connection on Android devices.", status: "Open" },
        { id: "fb-2", senderName: "Youssef C.", email: "youssef@example.com", type: "Feedback", message: "Assalamu Alaikum, just wanted to say thank you for building this platform!", status: "Open" }
      ]);
      setHasFetchedFeedback(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-6xl mx-auto space-y-8 mb-20">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-indigo-600 w-8 h-8" /> Platform Control Center
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">High-performance management workspace utilizing lazy-loading data streams.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between">
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Active Users</p><h3 className="text-2xl font-black text-slate-900 mt-1">{usersCounts?.totalActiveUsers}</h3></div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          </div>
           <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between ring-2 ring-red-500/10">
            <div><p className="text-xs font-bold text-red-600 uppercase tracking-wider">Total In Active Users</p><h3 className="text-2xl font-black text-red-700 mt-1">{usersCounts?.totalInActiveUsers}</h3></div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Users size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between">
            <div><p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Agents</p><h3 className="text-2xl font-black text-indigo-700 mt-1">{usersCounts?.totalAgents}</h3></div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ShieldCheck size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between">
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Mosques</p><h3 className="text-2xl font-black text-slate-900 mt-1">{mosquesCounts?.totalVerifiedMosques}</h3></div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Building2 size={20} /></div>
          </div>
           <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between ring-2 ring-red-500/10">
            <div><p className="text-xs font-bold text-red-600 uppercase tracking-wider">Pending Mosques</p><h3 className="text-2xl font-black text-red-700 mt-1">{mosquesCounts?.totalPendingMosques}</h3></div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Building2 size={20} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between ring-2 ring-red-500/10">
            <div><p className="text-xs font-bold text-red-600 uppercase tracking-wider">Un resolved mosque report</p><h3 className="text-2xl font-black text-red-700 mt-1">{mockStats.openTicketsCount}</h3></div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Flag size={20} /></div>
          </div>
           <div className="bg-white p-5 rounded-2xl border border-gray-200/60 flex items-center justify-between ring-2 ring-red-500/10">
            <div><p className="text-xs font-bold text-red-600 uppercase tracking-wider">Un resolved Feedback</p><h3 className="text-2xl font-black text-red-700 mt-1">{mockStats.openTicketsCount}</h3></div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertOctagon size={20} /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Mosque Registration Queue ({pendingMosques.length})</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Flipping these from pending deploys them live on the app instantly.</p>
          </div>

          {pendingMosques.length === 0 ? (
            <div className="p-6 text-center text-sm font-semibold text-gray-400">No pending mosque registration requests active.</div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {pendingMosques.map((mosque) => (
                <div key={mosque.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-gray-50/40 transition-colors gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{mosque.name}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{mosque.localGovernment}, {mosque.state}, {mosque.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMosque(mosque)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer self-start sm:self-center"
                  >
                    <Eye size={12} /> Audit Review
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalPendingMosqueCounts > pendingMosques.length && (
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="mt-4 w-full py-2 border-2 border-dashed border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? "Loading..." : <><ChevronDown size={14} /> Load More Pending mosques</>}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200 bg-gray-50/50 px-4 pt-3 gap-2">
            <button onClick={() => handleTabChange('agents')} className={`px-4 py-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'agents' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>User Roster Directory</button>
            <button onClick={() => handleTabChange('mosque-reports')} className={`px-4 py-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'mosque-reports' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>Mosque Violation Letters</button>
            <button onClick={() => handleTabChange('user-feedback')} className={`px-4 py-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'user-feedback' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}>Support Tickets & Feedback</button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'agents' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">User Roster Registry</h3>
                    <p className="text-xs text-gray-400 font-medium">Managing verified platform users. Search triggers live database lookup.</p>
                  </div>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Search name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200/80">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider"><th className="px-6 py-4">Identity Profile</th><th className="px-6 py-4">Agent Status Flag</th><th className="px-6 py-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {userDirectory.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/20">
                          <td className="px-6 py-4 flex flex-col"><span className="font-bold text-slate-800 text-sm">{user.firstName} {user.surName}</span><span className="text-gray-400 mt-0.5">{user.email}</span></td>
                          <td className="px-6 py-4">
                            {user.role === 'agent' ? (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-sm font-bold text-[10px]">✓ AUTHORIZED AGENT</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-sm font-medium text-[10px]">REGULAR USER</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-indigo-600 font-bold text-xs cursor-pointer">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {userDirectory.length < totalUserCount && (
                  <button 
                    onClick={handleLoadMoreUsers} 
                    disabled={isUserLoading}
                    className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 hover:text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isUserLoading ? "Loading..." : <><ChevronDown size={14} /> Load More Registered Profiles</>}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'mosque-reports' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Mosque Infraction Text Letters</h3>
                  <p className="text-xs text-gray-400 font-medium">Read content issues and flags, check the target mosque name, and handle resolution tracks manually.</p>
                </div>
                <div className="space-y-3">
                  {mosqueReports.slice(0, reportLimit).map((report) => (
                    <div key={report.id} className="p-4 border border-gray-200 rounded-xl flex items-start justify-between bg-white border-l-4 border-l-red-500 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-sm">Report Text Entry</span>
                          <span className="text-slate-800 font-black">Target Profile Name: "{report.targetMosqueName}"</span>
                          <span className="text-gray-400">By: {report.reportedBy}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 mt-2">{report.message}</p>
                      </div>
                      <button onClick={() => setMosqueReports(prev=>prev.filter(r=>r.id!==report.id))} className="px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors">Resolve Issue</button>
                    </div>
                  ))}
                  {mosqueReports.length === 0 && <p className="text-sm font-semibold text-gray-400 text-center py-4">No open infraction reports logged.</p>}
                </div>
                {mosqueReports.length > reportLimit && (
                  <button onClick={() => setReportLimit(prev => prev + 5)} className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
                    <ChevronDown size={14} /> Load Older Reports
                  </button>
                )}
              </div>
            )}

            {activeTab === 'user-feedback' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Suggestions & Technical Messages</h3>
                  <p className="text-xs text-gray-400 font-medium">General support logging, app error alerts, or community greeting submissions.</p>
                </div>
                <div className="space-y-3">
                  {userFeedback.slice(0, feedbackLimit).map((fb) => (
                    <div key={fb.id} className="p-4 border border-gray-200 rounded-xl flex items-start justify-between bg-white border-l-4 border-l-blue-500 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 font-bold bg-blue-50 text-blue-700 rounded-sm">{fb.type}</span>
                          <span className="text-gray-500 font-bold">From: {fb.senderName} ({fb.email})</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 mt-2">{fb.message}</p>
                      </div>
                      <button onClick={() => setUserFeedback(prev=>prev.filter(f=>f.id!==fb.id))} className="px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors">Close Ticket</button>
                    </div>
                  ))}
                  {userFeedback.length === 0 && <p className="text-sm font-semibold text-gray-400 text-center py-4">All support logs are completely clear.</p>}
                </div>
                {userFeedback.length > feedbackLimit && (
                  <button onClick={() => setFeedbackLimit(prev => prev + 5)} className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
                    <ChevronDown size={14} /> Load Older Tickets
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMosque && (
        <SelectedMosqueModel 
          selectedMosque={selectedMosque} 
          setSelectedMosque={setSelectedMosque}
          setPendingMosques={setPendingMosques}
          setTotalPendingMosqueCounts={setTotalPendingMosqueCounts}
        />
      )}
    </div>
  );
}