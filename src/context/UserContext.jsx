import { createContext, useContext, useEffect, useState } from "react";
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
    const [logOutError, setLogOutError] = useState(false);
    const [followedMosques, setFollowedMosques] = useState([]);
   
      const [showProfileMenu, setShowProfileMenu] = useState(false);
      const [toastToCreateAccountMessage, setToastToCreateAccountMessage] = useState(null);
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

    const fetchUserData = async () => {
      setAppLoading(true);
      try {
        const res = await privateAxiosInstance.get('/users/login-user');
        if (res.status < 400) {
          setLoggedInUser(res?.data.user);
          if (isDev) {
            // console.log('Fetched user data:', res.data.user);
          }
          return true;
        }
      } catch (err) {
        if (isDev) {
          console.error('Failed to fetch user data:', err.response?.data?.message || err.message);
        }
      } finally {
        setAppLoading(false);
      }

      return false;
    };

    const fetchUserProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await privateAxiosInstance.get('/profiles/user-profile');
        if (res.status < 400) {
          setUserProfile(res.data.userProfile.image);
        }
      } catch (err) {
        if (isDev) {
          console.error('Failed to fetch user profile:', err.response?.data?.message || err.message);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchUserFollowedMosques = async () => {
      try {
        const res = await privateAxiosInstance.get('/mosques/get-followed-mosques');
        if (res.status < 400) {
          // Handle followed mosques data
          // console.log('Fetched followed mosques:', res.data.mosques);
          setFollowedMosques(res.data.mosques);
        }
      } catch (err) {
        if (isDev) {
          console.error('Failed to fetch followed mosques:', err.response?.data?.message || err.message);
        }
      }
    };

    // 3. New helper to clear the badge
const resetNotificationCount = () => {
    setNotificationsCount(0);
};

const fetchNotifications = async (page = 1, limit = 15, reset = false) => {
    setIsFetchingNotifications(true);
    try {
        const res = await privateAxiosInstance.get('/notifications/get', {
            params: { page, limit }
        });
        
        if (res.status < 400) {
            const { notifications: newNotifs, totalItems } = res.data;
            console.log('notifications', newNotifs);
            
          
            setNotifications(prev => reset ? newNotifs : [...prev, ...newNotifs]);
            // Pagination check
            setHasMoreNotifications(newNotifs.length === limit);
        }
    } catch (err) {
        console.error('Error fetching notifications:', err);
    } finally {
        setIsFetchingNotifications(false);
    }
};





const fetchMosques = async (page = 1, limit = 10, searchQuery = '', state = '', reset = false) => {
  setIsFetching(true);
  try {
    const res = await publicAxiosInstance.get('/mosques/get-mosques', {
      params: { page, limit, search: searchQuery, state }
    });

    if (res.status < 400) {
      const newMosques = res.data.mosques;
      console.log('mosques', res.data);
      
      // Update data: replace if reset=true, else append
      setMosques(prev => reset ? newMosques : [...prev, ...newMosques]);
      
      // If we received fewer items than the limit, we've reached the end
      setHasMore(newMosques.length === limit);
    }
  } catch (err) {
    if (isDev) console.log(err);
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
          // console.log(res.data.followedMosqueIds)
            setFollowMosqueIds(res.data.followedMosqueIds);
        }
    } catch (err) {
        console.error("Failed to fetch followed IDs:", err);
    }
};


    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');

      const fetchPrivateData = async () => {
        const isLoggedIn = await fetchUserData();
        if (isLoggedIn) {
          await fetchUserProfile();
          await fetchUserFollowedMosques();
          await fetchFollowedMosqueIds();
       
          // other data that need login can be fetched here
        }
        setAuthLoading(false);
      };

      const fetchPublicData = async () => {
        await fetchMosques(1, 20, '', '', true);
      };

      (async () => {
        if (accessToken) {
          await fetchPrivateData();
        } else {
          setAuthLoading(false);
        }

        await fetchPublicData();
      })();
    }, []);

  return (
    <UserContext.Provider value={{ 
        loggedInUser, setLoggedInUser, fetchUserData, profileLoading, setProfileLoading, userProfile, fetchUserProfile,  appLoading,
        authLoading, setAuthLoading, logOutError, setLogOutError, setUserProfile, followedMosques, setFollowedMosques, notifications, setNotifications, fetchNotifications, showProfileMenu,
         setShowProfileMenu, toastToCreateAccountMessage, setToastToCreateAccountMessage, mosques, setMosques, fetchMosques, hasMore, isFetching,
          followMosqueIds, setFollowMosqueIds, fetchFollowedMosqueIds, notificationsCount, setNotificationsCount, resetNotificationCount, hasMoreNotifications,
           isFetchingNotifications, updateMosqueLocally
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