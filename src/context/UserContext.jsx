import { createContext, useContext, useEffect, useState } from "react";
import privateAxiosInstance from "../../auth/privateAxiosInstance";

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

    const fetchUserData = async () => {
      setAppLoading(true);
      try {
        const res = await privateAxiosInstance.get('/users/login-user');
        if (res.status < 400) {
          setLoggedInUser(res?.data.user);
          if (isDev) {
            console.log('Fetched user data:', res.data.user);
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

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');

      const fetchPrivateData = async () => {
        const isLoggedIn = await fetchUserData();
        if (isLoggedIn) {
          await fetchUserProfile();
          // other data that need login can be fetched here
        }
        setAuthLoading(false);
      };

      const fetchPublicData = async () => {
        // other data not need login
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
        authLoading, setAuthLoading, logOutError, setLogOutError, setUserProfile
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