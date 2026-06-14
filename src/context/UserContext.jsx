import { createContext, useContext, useEffect, useRef, useState } from "react";
import privateAxiosInstance from "../../auth/privateAxiosInstance";
import publicAxiosInstance from "../../auth/publicAxiosInstance";

// Create the context
const UserContext = createContext();
  const isDev = import.meta.env.VITE_ENV === 'development';
// Context provider component
export const ContextProvider = ({ children}) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [appLoading, setAppLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [followedMosques, setFollowedMosques] = useState([]);
    const [notificationsPage, setNotificationsPage] = useState(1);
   
      const [showProfileMenu, setShowProfileMenu] = useState(false);
     
      const [mosquePages, setMosquePages] = useState(1);
      const [followMosqueIds, setFollowMosqueIds] = useState([]);

      const [notifications, setNotifications] = useState([]);
const [notificationsCount, setNotificationsCount] = useState(0); // For the bell badge
const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
const [isFetchingNotifications, setIsFetchingNotifications] = useState(false);


      

      // for mosque list in homepage and search
    const [mosques, setMosques] = useState([]);
const [hasMore, setHasMore] = useState(true);
const [isFetching, setIsFetching] = useState(false);

    // fetchUserData: when called with `showLoading = true` the global
    // `appLoading` spinner will be toggled. Callers that only need to
    // refresh user data should call `fetchUserData()` (default: no splash).
    const fetchUserData = async (showLoading = false) => {
      if (showLoading) setAppLoading(true);
      try {
        const res = await privateAxiosInstance.get('/users/login-user');
        if (res.status < 400) {
          setLoggedInUser(res?.data?.user);
         
          return true;
        }
      } catch (err) {
        if (isDev) {
          console.error('Failed to fetch user data:', err.response?.data?.message || err.message);
        }
      } finally {
        if (showLoading) setAppLoading(false);
      }

      return false;
    };

    const fetchUserProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await privateAxiosInstance.get('/profiles/user-profile');
        if (res.status < 400) {
          setUserProfile(res?.data?.userProfile?.image);
        }
      } catch (err) {
        if (isDev) {
          // console.error('Failed to fetch user profile:', err.response?.data?.message || err.message);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchUserFollowedMosques = async () => {
      try {
        const res = await privateAxiosInstance.get('/mosques/get-followed-mosques');
        if (res.status < 400) {
          setFollowedMosques(res?.data?.mosques);
        }
      } catch (err) {
        if (isDev) {
          console.error('Failed to fetch followed mosques:', err?.response?.data || err);
        }
      }
    };

    // 3. New helper to clear the badge
const resetNotificationCount = () => {
    setNotificationsCount(0);
};

const fetchNotifications = async (reset = false) => {
    setIsFetchingNotifications(true);

    const pageToFetch = reset ? 1 : notificationsPage;
    try {
        const res = await privateAxiosInstance.get('/notifications/get', {
            params: { 
                  page: pageToFetch,
                  limit: 15 
                }
        });
        
        if (res.status < 400) {
            const { notifications: newNotifs, totalItems } = res?.data;
            
          
            setNotifications(prev => reset ? newNotifs : [...prev, ...newNotifs]);
            // Pagination check
            setHasMoreNotifications(newNotifs?.length === 15);
            setNotificationsPage(prev => reset ? 2 : prev + 1);
        }
    } catch (err) {
        if (isDev) {
            console.error('Error fetching notifications:', err?.response?.data || err);
        }
    } finally {
        setIsFetchingNotifications(false);
    }
};


const fetchMosques = async (page = 1, limit = 10, searchQuery = '', state = '', reset = false) => {
  if (isFetching) return; 
  
  setIsFetching(true);
  try {
    const res = await publicAxiosInstance.get('/mosques/get-mosques', {
      params: { page, limit, search: searchQuery, state }
    });

    if (res.status < 400) {
      const newMosques = res?.data?.mosques;

      setMosques(prev => {
        if (reset) return newMosques;

        // FILTERING LOGIC: 
        // Only keep newMosques if their ID is not already in the 'prev' list
        const existingIds = new Set(prev.map(m => m.id));
        const filteredNewMosques = newMosques?.filter(m => !existingIds.has(m.id));
        
        return [...prev, ...filteredNewMosques];
      });

      setHasMore(newMosques.length === limit);
    }
  } catch (err) {
    if (isDev) console.error('fetchMosqueError', err);
    setHasMore(false); 
  } finally {
    setIsFetching(false);
  }
};



const updateMosqueLocally = (mosqueId, updatedFields) => {
  setMosques(prev => prev.map(m => 
    String(m.id) === String(mosqueId) ? { ...m, ...updatedFields } : m
  ));
};

const fetchFollowedMosqueIds = async () => {
    try {
        const res = await privateAxiosInstance.get('/mosques/get-followed-mosque-ids');
        if (res.data.status === 'success') {
            setFollowMosqueIds(res?.data?.followedMosqueIds);
        }
    } catch (err) {
        if (isDev) {
            console.error("Failed to fetch followed IDs:", err);
        }
    }
};


// Add this inside your ContextProvider, above the useEffect
const hasInitialized = useRef(false);

useEffect(() => {
    const initAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token && token !== 'null' && token !== 'undefined') {
            try {
          // On initial app start we want the splash to show, so
          // request the fetch to toggle `appLoading`.
          const isLoggedIn = await fetchUserData(true);
                if (isLoggedIn) {
                    await Promise.all([
                        fetchUserProfile(),
                        //remove followedMosques call
                        fetchFollowedMosqueIds()
                    ]);
                }
            } catch (err) {
                console.warn("Auth failed, user remains guest.");
            }
        }
        setAuthLoading(false);
    };

    if (!hasInitialized.current) {
        initAuth();
    }
}, []);

// 2. Hook for Public Content
useEffect(() => {
    // Only fetch if we haven't initialized yet
    if (!hasInitialized.current) {
        fetchMosques(1, 15, '', '', true);
        hasInitialized.current = true; // Mark as done for both
    }
}, []);


  return (
    <UserContext.Provider value={{ 
        loggedInUser, setLoggedInUser, fetchUserData, profileLoading, setProfileLoading, userProfile, fetchUserProfile,  appLoading,
        authLoading, setAuthLoading, setUserProfile, followedMosques, setFollowedMosques, notifications, setNotifications, fetchNotifications, showProfileMenu,
         setShowProfileMenu, mosques, setMosques, fetchMosques, hasMore, isFetching,
          followMosqueIds, setFollowMosqueIds, fetchFollowedMosqueIds, notificationsCount, setNotificationsCount, resetNotificationCount, hasMoreNotifications,
           isFetchingNotifications, updateMosqueLocally, fetchUserFollowedMosques
 }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = () => {
  return useContext(UserContext);

};

export { UserContext };