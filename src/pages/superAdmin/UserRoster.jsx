import React, { useState } from 'react';
import { Search, User, Info, Loader2 } from 'lucide-react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

const UserRoster = ({ users, fetchUsers, hasMore, currentPage,  updateUserRoleLocally}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For your future UserDetailModal
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search logic
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Clear previous timer and set new one (simple debounce)
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchUsers(term, 1, true); // Search term, page 1, reset=true
    }, 600);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    await fetchUsers(searchTerm, currentPage + 1, false); // Keep current search, increment page, reset=false
    setIsLoading(false);
  };

const handleToggleRole = async () => {
    setIsLoading(true);
    try {
      const res = await privateAxiosInstance.patch(`/users/toggle-role/${selectedUser.id}`);
      
      // 1. Success: Update local state
      const updatedRole = res.data.user.role;
      updateUserRoleLocally(selectedUser.id, updatedRole);
      
      // 2. Success: Only close the modal here
      setSelectedUser(null);
    } catch (err) {
      // 3. Error: Do NOT set setSelectedUser(null). 
      // This keeps the modal open so the user sees it didn't work.
      console.error("Failed to update role:", err);
      
      // Optional: You could set an 'errorMessage' state here to display 
      // inside the modal if you want to be user-friendly.
      alert(err.response?.data?.message || "Failed to update role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, surname or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-emerald-500"
        />
      </div>

      {/* USER LIST */}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
                {user.userProfile?.image ? (
                  <img src={user.userProfile.image} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-emerald-700" size={18} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{user.firstName} {user.surName}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${user.role === 'agent' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                {user.role}
              </span>
              <button 
                onClick={() => setSelectedUser(user)}
                className="p-2 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                <Info size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <button 
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-3 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Load More Users"}
        </button>
      )}

      {/* Placeholder for the UserDetailModal you will create */}
    {selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/20 backdrop-blur-sm p-4">
    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl border border-emerald-50">
      <h3 className="font-black text-lg text-emerald-900">Manage {selectedUser.firstName}</h3>
 <p className="text-xs text-gray-500 mb-6">
  {selectedUser.role === 'agent' ? (
    <>
      Are you sure you want to remove agent permissions from 
      <span className="font-bold text-emerald-900 mx-1">{selectedUser.firstName}</span>?
    </>
  ) : (
    <>
      Are you sure you want to promote 
      <span className="font-bold text-emerald-900 mx-1">{selectedUser.firstName}</span> 
      to an agent?
    </>
  )}
</p>
      
      <div className="flex gap-3">
        <button 
        disabled={isLoading}
          onClick={() => setSelectedUser(null)} 
          className="flex-1 py-2 border border-gray-200 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
       

<button 
  onClick={handleToggleRole} // Add this
  disabled={isLoading}       // Add this
  className={`flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer text-white transition-colors ${
    selectedUser.role === 'agent' 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-emerald-700 hover:bg-emerald-800'
  }`}
>
  {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : (selectedUser.role === 'agent' ? 'Remove Agent' : 'Assign Agent')}
</button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserRoster;