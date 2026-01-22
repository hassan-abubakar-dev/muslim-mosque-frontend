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
       try{
         const res = await privateAxiosInstance.get('/users/login-user');
        if(res.status < 400){
            setAppLoading(false);
            setLoggedInUser(res?.data.user);
            setAuthLoading(false);
        }
       }catch(err){
        setAppLoading(false);
        setAuthLoading(false);
        if(isDev){
            console.error('Failed to fetch user data:', err.response?.data?.message || err.message);
        }
       }
    };

    const fetchUserProfile = async () => {
        setProfileLoading(true);
        try{
            const res = await privateAxiosInstance.get('/profiles/user-profile');
            if(res.status < 400){
                setProfileLoading(false);
                setUserProfile(res.data.userProfile.image)
            }
        }
        catch(err){
            setProfileLoading(false);
            if(isDev){
                console.error('Failed to fetch user data', err.response?.data?.message || err.message);
            }
        }
    }

    useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

        const fetchPrivateData = async () => {
            await fetchUserProfile();
            // other data need login
        };

        const fetchPublicData = async() => {
            // other data not need login
        }
       
        (async () => {
            await fetchUserData();

            if(accessToken){
            fetchPrivateData();
          }

          fetchPublicData();
        })();

          
        
    }, [])
  return (
    <UserContext.Provider value={{ 
        loggedInUser, setLoggedInUser, fetchUserData, profileLoading, setProfileLoading, userProfile, fetchUserProfile,  appLoading,
        authLoading, setAuthLoading, logOutError, setLogOutError
 }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = () => {
  return useContext(UserContext);
};