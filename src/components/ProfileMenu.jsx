import { ChevronRight, LogOut, MessageSquare, Moon, Settings, UserRound } from 'lucide-react';
import privateAxiosInstance from '../../auth/privateAxiosInstance';
import { useUserContext } from '../context/UserContext';
import { useState } from 'react';


const ProfileMenu = () => {
  const {setLoggedInUser, setLogOutError} = useUserContext();
  const [showProfileMenu, setShowProfileMenu] = useState(true);



  const isDev = import.meta.env.VITE_ENV === 'development';
  // mock user
  const user = {
    name: 'Hassan Maiwada',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  const logOut = async() => {
    try{
      const res = await privateAxiosInstance.post('/auths/log-out');
      if(res.status < 400){
        localStorage.removeItem('accessToken');
        setLoggedInUser(null);
      setShowProfileMenu(false);
      }
    }
    catch(err){
       setShowProfileMenu(false);
      if(isDev){
        console.log(err.response.data);
      }else{
         setLogOutError(true);
      }
     
    }
  }

  return (
       <div className={`bg-white mt-3 mx-4 rounded-xl shadow-xl p-1.5  absolute top-16 right-0 w-64 z-50 ${!showProfileMenu && 'hidden'}` }
                             style={{
                    boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.2)'
                        }}  
                        >
                        
                        <div className='hover:bg-gray-50 flex py-2 px-3 rounded-xl cursor-pointer'>
                            <img src={user.avatar} alt="" className='rounded-full cursor-pointer h-9 w-9' />
                            <p className='text-[16px] font-medium mt-1.5 ml-2 text-black cursor-pointer'>{user.name}</p>
                        </div>
                        <hr className='text-gray-300 w-[95%] justify-self-center my-1' />
                       <button className='text-[15px] font-medium bg-emerald-100 text-emerald-700 px-24 cursor-pointer rounded-xl py-1.5 my-2 whitespace-nowrap' onClick={logOut}>
                        Log out
                       </button>
                        </div>
  );
};

export default ProfileMenu;
