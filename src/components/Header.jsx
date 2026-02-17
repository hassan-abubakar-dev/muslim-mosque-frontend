import { MessageCircle, MoveLeft, Search, UserPlus } from 'lucide-react';
import AppLogo from '../assets/muslim-mosque-logo.jpg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useUserContext } from '../context/UserContext';
import Toast from './Toast';

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const {loggedInUser, profileLoading, userProfile, authLoading, logOutError} = useUserContext()

    const openSearch = () => {
        setShowSearch(true)
    }

    useEffect(() => {
        // try to read mosques from localStorage for client-side search
        try{
            const raw = localStorage.getItem('mosques');
            const mosques = raw ? JSON.parse(raw) : [];
            if(query.trim().length > 1){
                const q = query.toLowerCase();
                const matched = mosques.filter(m => (m.name || '').toLowerCase().includes(q)).slice(0,5);
                setResults(matched);
            } else {
                setResults([]);
            }
        }catch(e){ setResults([]); }
    }, [query]);

    const openMosque = (mosque) => {
        if(!mosque) return;
        navigate(`/mosque/${mosque.id}`, { state: { mosque } });
        setQuery('');
        setResults([]);
        setShowSearch(false);
    }

    return (
        <header className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 text-white shadow-md fixed top-0 left-0 right-0 h-24 flex items-center z-40">
{logOutError && <Toast />}
            <div className='flex items-center justify-between px-4 w-full'>
                <div className={`flex items-center gap-4 ${showSearch && 'hidden'}`}>
                    <button className='w-14 h-14 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300' onClick={() => navigate('/') } aria-label="Home">
                        <img src={AppLogo} alt="App Logo" className='w-full h-full rounded-full mt-3 ml-3' />
                    </button>

                    <div className='hidden sm:flex items-center bg-white rounded-full overflow-hidden shadow-sm'>
                        <div className='px-3 text-emerald-700'><Search /></div>
                        <input
                            type="text"
                            placeholder="Search mosques"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-10 w-64 px-2 outline-none text-gray-800"
                            aria-label="Search mosques"
                        />
                    </div>

                    {/* mobile search trigger */}
                    <button className='sm:hidden bg-white rounded-full p-2' onClick={() => setShowSearch(true)} aria-label="Open search">
                        <Search className='text-emerald-700' />
                    </button>
                </div>

                <div className='flex items-center gap-3'>
                  <button onClick={() => setMobileMenuOpen(prev => !prev)} className='sm:hidden px-2 py-1 rounded-md bg-transparent text-white' aria-label="Toggle menu">☰</button>
                </div>

            </div>

            <div className='flex items-start'>
                <div className={`flex-1 flex justify-center ${mobileMenuOpen ? 'block' : 'hidden'} sm:flex`}>
                    <button
                        onClick={() => { navigate('/register'); }}
                        className='bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold hover:opacity-90 ml-auto sm:inline text-nowrap cursor-pointer mt-7 mr-3'
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

            {/* mobile search panel */}
            <div className={`fixed top-0 left-0 right-0 bg-white pb-3 px-4 ${!showSearch && 'hidden'} z-50`}>
                <div className='flex items-center gap-2 mt-3'>
                    <button
                        className="bg-emerald-700 text-white px-3 h-10 rounded-full flex items-center justify-center"
                        onClick={() => { setShowSearch(false) }}
                        aria-label="Close search"
                    >
                        <MoveLeft className="w-4" />
                    </button>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        className="h-10 w-full mt-2 rounded-full outline-none bg-gray-50 placeholder:text-gray-500 pl-4 pr-3 border border-gray-200"
                        placeholder="Search mosques"
                        autoFocus
                    />
                </div>

                {/* small area for results on mobile */}
                <div className='mt-3'>
                    {query.trim().length > 1 && (
                        <div className='bg-white rounded-md shadow-md overflow-hidden'>
                            {results.length === 0 ? (
                                <div className='p-3 text-sm text-gray-500'>No results</div>
                            ) : (
                                results.map(r => (
                                    <button key={r.id} onClick={() => openMosque(r)} className='w-full text-left px-4 py-3 hover:bg-gray-50'>
                                        <div className='font-medium text-gray-800'>{r.name}</div>
                                        <div className='text-xs text-gray-500'>{r.localGovernment}, {r.state}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* desktop search results dropdown */}
            {query.trim().length > 1 && (
                <div className='absolute top-full left-0 right-0 mt-2 z-40 pointer-events-none'>
                    <div className='max-w-6xl mx-auto px-4 pointer-events-auto'>
                        <div className='bg-white rounded-md shadow-md overflow-hidden'>
                            {results.length === 0 ? (
                                <div className='p-3 text-sm text-gray-500'>No results</div>
                            ) : (
                                results.map(r => (
                                    <button key={r.id} onClick={() => openMosque(r)} className='w-full text-left px-4 py-3 hover:bg-gray-50'>
                                        <div className='font-medium text-gray-800'>{r.name}</div>
                                        <div className='text-xs text-gray-500'>{r.localGovernment}, {r.state}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}



   



        </header>
    );
};

export default Header;
