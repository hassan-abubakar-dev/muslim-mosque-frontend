import { ChevronRight, LogOut, MessageSquare, Moon, Settings, UserRound } from 'lucide-react';
import privateAxiosInstance from '../../auth/privateAxiosInstance';
import { useUserContext } from '../context/UserContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ProfileMenu = () => {
  const {setLoggedInUser, showProfileMenu, setShowProfileMenu, loggedInUser, userProfile} = useUserContext();
const navigate = useNavigate();


  const isDev = import.meta.env.VITE_ENV === 'development';


  const logOut = async() => {
    try{
      const res = await privateAxiosInstance.post('/auths/log-out');
      if(res.status < 400){
        setShowProfileMenu(false);
        localStorage.removeItem('accessToken');
        setLoggedInUser(null);
      navigate('/', { replace: true });
      }
    }
    catch(err){
       setShowProfileMenu(false);
      if(isDev){
        console.log(err.response.data);
      }
    }finally {
    
      setShowProfileMenu(false);
      localStorage.removeItem('accessToken'); 
      setLoggedInUser(null);
      navigate('/', { replace: true });
    }
  }

  return (
       <div className={`bg-white mt-3 rounded-xl shadow-xl p-1.5 absolute top-16 right-2 left-auto w-64 max-w-[min(100vw-1rem,16rem)] z-50 ${!showProfileMenu && 'hidden'}` }
                             style={{
                    boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.2)'
                        }}
                        >
                        
                      <div className='hover:bg-gray-50 flex items-center py-2 px-3 rounded-xl cursor-pointer' onClick={() => { navigate('/profile'); setShowProfileMenu(false);}}>
    <img src={userProfile} alt="Profile" className='rounded-full cursor-pointer h-9 w-9 flex-shrink-0' />
    
    {/* 🛠️ FIXED: Added truncate, block, and max-width classes */}
    <p className='text-[16px] font-medium ml-2 text-black cursor-pointer truncate max-w-[180px]' title={`${loggedInUser?.firstName} ${loggedInUser?.surName}`}>
        {loggedInUser?.firstName} {loggedInUser?.surName}
    </p>
</div>
                        <hr className='text-gray-300 w-[95%] justify-self-center my-1' />
                       <button className='text-[15px] font-medium bg-emerald-100 text-emerald-700 px-24 cursor-pointer rounded-xl py-1.5 my-2 whitespace-nowrap' onClick={logOut}>
                        Log out
                       </button>
       </div>
  );
};

export default ProfileMenu;
