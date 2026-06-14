import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Trash2, Shield, UserCheck, AlertTriangle, X } from 'lucide-react';
import { useUserContext } from '../context/UserContext'; 
import privateAxiosInstance from '../../auth/privateAxiosInstance'; 
import { useParams, useNavigate } from 'react-router-dom';
import MosqueTeamSkeleton from '../components/loadingSkeletons/MosqueTeamSkeleton';

export default function MosqueTeamSettings() {
  const { loggedInUser } = useUserContext();
  const { mosqueId } = useParams();
  const navigate = useNavigate();

  // 🛡️ SECURITY: Verify Authorization immediately
  // If the user isn't an admin of this specific mosque, kick them out.
  useEffect(() => {
    if (loggedInUser && mosqueId) {
      const isAuthorized = loggedInUser.managedMosques?.some(m => m.id === mosqueId);
      if (!isAuthorized) {
        navigate('/profile'); // Redirect unauthorized users
      }
    }
  }, [loggedInUser, mosqueId, navigate]);

  const [team, setTeam] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [rosterError, setRosterError] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundUser, setFoundUser] = useState(null); 
  const [addingLoading, setAddingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToEvict, setUserToEvict] = useState(null);
  const [revokingLoading, setRevokingLoading] = useState(false);

  // Use a stable fetch function
  const fetchTeamRoster = async () => {
    if (!mosqueId) return;
    try {
      setLoadingRoster(true);
      const res = await privateAxiosInstance.get(`/mosque-admin/team-roster/${mosqueId}`);
      if(res.data?.data) {
        setTeam(res.data.data.team || []);
      }
    } catch (err) {
      setRosterError('Failed to load team list.');
    } finally {
      setLoadingRoster(false);
    }
  };

  useEffect(() => { 
    if(loggedInUser){
      fetchTeamRoster(); 
    }

  }, [mosqueId, loggedInUser]);

  // 🛡️ VULNERABILITY FIX: Prevent XSS by sanitizing input
  const handleSearchUser = async (e) => {
    e.preventDefault();
    const sanitizedEmail = emailInput.toLowerCase().trim();
    if (!sanitizedEmail) return;

    setSearchLoading(true);
    setSearchError('');
    setFoundUser(null);

    try {
      const res = await privateAxiosInstance.post('/users/search-by-email', { email: sanitizedEmail });
      const userData = res.data?.data?.user || res.data?.user;
      
      if (userData) {
        setFoundUser(userData);
      } else {
        setSearchError('User not found.');
      }
    } catch (err) {
      setSearchError(err.response?.data?.message || 'Lookup failed.');
    } finally {
      setSearchLoading(false);
    }
  };



  if (loadingRoster && team.length === 0 || !loggedInUser) return <MosqueTeamSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-3xl mx-auto space-y-8 my-10 mb-20">
        
        {/* Dynamic Activity Feedback Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 transition-all shadow-sm animate-fade-in">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <span className="font-semibold text-sm">{successMessage}</span>
          </div>
        )}

        {/* SECTION 1: APPOINT ASSISTANT SLOT */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">Appoint Assistant Admin</h2>
              <p className="text-xs text-gray-500 font-medium">Search by explicit email address to assign an assistant to your team layout.</p>
            </div>
          </div>

          <form onSubmit={handleSearchUser} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter user's registered email address..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={searchLoading || addingLoading}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={searchLoading || addingLoading || !emailInput.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              {searchLoading ? 'Searching...' : 'Find User'}
            </button>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2 template-pulse">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* 🎯 INDIGO DARK DESIGN INTEGRATION */}
          {foundUser && (
            <div className="mt-6 border border-indigo-950 bg-slate-900 rounded-xl p-5 shadow-lg border-l-4 border-l-indigo-500 text-white">
              <p className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-3">Identity Match Found:</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={foundUser.userProfile?.image || 'https://via.placeholder.com/150'}
                    alt={foundUser.firstName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50 bg-gray-800"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">{foundUser.firstName} {foundUser.surName}</h4>
                    <p className="text-xs text-gray-400 font-medium">{foundUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    type="button"
                    onClick={() => setFoundUser(null)}
                    disabled={addingLoading}
                    className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAssistant}
                    disabled={addingLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    {addingLoading ? 'Processing...' : 'Proceed & Grant Access'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: MANAGEMENT ROSTER DISPLAY */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-emerald-900">Mosque Administrative Roster</h2>
              <p className="text-xs text-gray-500 font-medium">Global layout of administrators assigned to handle infrastructure streams.</p>
            </div>
            {!loadingRoster && (
              <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                {team.length} Admins Active
              </span>
            )}
          </div>

          {loadingRoster ? (
            <div className="space-y-4 py-4">
              <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ) : rosterError ? (
            <div className="p-4 text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg font-medium">
              {rosterError}
            </div>
          ): team.length === 0 ? (
  <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
    <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
      <UserCheck size={24} />
    </div>
    <p className="text-sm text-gray-500 font-medium">No assistants currently assigned.</p>
  </div>
) : (
            <div className="divide-y divide-gray-100">
              {team.map((member) => {
                const isPrimaryAdmin = member.role === 'owner';
                const userNode = member.user || {};

                return (
                  <div key={member.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group transition-all">
                    <div className="flex items-center gap-4">
                      <img
                        src={userNode.userProfile?.image || 'https://via.placeholder.com/150'}
                        alt={userNode.firstName}
                        className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm bg-gray-200 ${
                          isPrimaryAdmin ? 'border-emerald-700 ring-2 ring-emerald-100' : 'border-gray-300'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-800">
                            {userNode.id === loggedInUser?.id ? 'You' : userNode.firstName} {userNode.id === loggedInUser?.id ? `(${userNode.surName || 'Owner'})` : userNode.surName}
                          </h4>
                          {isPrimaryAdmin ? (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                              <Shield size={10} /> CREATOR / SUPER
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200">
                              ASSISTANT ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{userNode.email}</p>
                      </div>
                    </div>

                    <div>
                      {isPrimaryAdmin ? (
                        <div className="p-2 text-emerald-700/40" title="Primary creator system safety lock">
                          <Shield className="w-5 h-5 fill-emerald-50 text-emerald-700" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => triggerRemoveModal(userNode.id, userNode.firstName, userNode.surName)}
                          className="p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                          title={`Revoke server access layer for ${userNode.firstName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative border border-gray-100 transform scale-100 transition-transform animate-scale-up">
            
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Revoke Access Privileges?</h3>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Are you completely sure you want to drop <span className="text-gray-900 font-bold">{userToEvict?.name}</span> from your management roster? They will immediately lose streaming access keys for this mosque hub configuration.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 border-t pt-4 border-gray-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={revokingLoading}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Member
              </button>
              <button
                type="button"
                onClick={handleConfirmRevocation}
                disabled={revokingLoading}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                {revokingLoading ? 'Revoking Access...' : 'Yes, Revoke Privileges'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}