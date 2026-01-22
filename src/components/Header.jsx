import { MessageCircle, MoveLeft, Search, UserPlus } from 'lucide-react';
import AppLogo from '../assets/muslim-mosque-logo.jpg';
import { useState } from 'react';
import ProfileMenu from './ProfileMenu';
import { useUserContext } from '../context/UserContext';
import Toast from './Toast';

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const {loggedInUser, profileLoading, userProfile, authLoading, logOutError} = useUserContext()

    const openSearch = () => {
        setShowSearch(true)
    }

    return (
        <header className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 text-white shadow-md fixed top-0 left-0 right-0 h-24 flex items-center z-40">
{logOutError && <Toast />}
            <div className='flex items-center justify-between  px-4'>
                <div className={`flex items-center ${showSearch && 'hidden'}`}>
                    <div className='w-14 h-14 rounded-full '>
                        <img src={AppLogo} alt="App Logo" className='w-full h-full rounded-full mt-3 ml-3' />
                    </div>
                    <div className='flex  mt-6 ml-5 cursor-text' onClick={openSearch}>
                        <div className='bg-gray-50 h-12 w-12 pt-3 pl-2 text-black rounded-full z-10'>
                            <Search />
                        </div>

                        <div className='bg-gray-50 h-12 w-52 -ml-12 rounded-full' />
                    </div>
                </div>


            </div>

            <div className='flex items-start'>
                <div className='flex-1 flex justify-center '>
                    <button
                        onClick={() => { window.history.pushState({}, '', '/register'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                        className='bg-gray-50 text-emerald-700 px-4 py-2 rounded-md font-semibold hover:opacity-90 ml-auto   sm:inline text-nowrap cursor-pointer mt-7 mr-3'
                    >
                        <UserPlus className='w-4 h-4 inline-block mr-1' />
                        <>Register Mosque</>
                    </button>
                </div>
            </div>

           
             <div className='flex items-center gap-4 ml-auto mr-3'>
           
            {!loggedInUser &&  profileLoading === false && authLoading &&(
                <div className="h-14 w-14 rounded-full bg-gray-300 animate-pulse" />
            )}

             {!loggedInUser &&  profileLoading === false && !authLoading &&(
                <div className='flex items-center gap-4 ml-auto mr-3'>
                <div className='flex flex-col items-end gap-2 ml-auto'>
                    <button onClick={() => { window.history.pushState({}, '', '/signup'); window.dispatchEvent(new PopStateEvent('popstate')); }} className='text-white/90 text-sm px-3 py-1 rounded-md border border-white/20 hover:bg-white/10 cursor-pointer'>Sign Up</button>
                    <button onClick={() => { window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')); }} className='bg-white text-emerald-700 px-3 py-1 rounded-md font-semibold cursor-pointer'>Log In</button>
                </div>
            </div>
            )}
    

        {loggedInUser && profileLoading === false && !authLoading &&(
       
               <div>
              <div className='w-14 h-14 cursor-pointer'onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img src={userProfile} alt="" className='w-full h-full rounded-full' />
            </div>
            {showProfileMenu && <ProfileMenu />}
          </div>
          
        )}

</div>

            <div className={`fixed top-0 left-0 bg-gray-50 pb-3 w-[323px] rounded-2xl shadow-2xl h-24 ${!showSearch && 'hidden'}`}>

                <div className='flex gap-2 mt-3'>
                    <div
                        className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 cursor-pointer ml-2 px-2 h-10 mt-2 rounded-full"
                        onClick={() => { setShowSearch(false) }}
                    >

                        {<MoveLeft className="mt-2 w-5 " />}
                    </div>
                    <input type="text" name="" id="" className="h-10 w-64 mt-2 rounded-full outline-none bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 placeholder:text-white pl-3 border-gray-600 border"
                        placeholder="Seach Mosque" autoFocus
                    />

                </div>


                <div className=' mt-5 px-2'>


                </div>

            </div>



   



        </header>
    );
};

export default Header;
