import { MessageCircle, MoveLeft, Search, UserPlus, Bell, Menu, Bookmark, FileText, Library, X, Loader2 } from 'lucide-react';
import AppLogo from '../assets/masjiba-logo-icon.png';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu.jsx';
import { useUserContext } from '../context/UserContext.jsx';
import Toast from './Toast.jsx';
import NotificationsDropdown from './NotificationsDropdown.jsx';
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const Header = ({ onToggleSidebar }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(5);
    const [notificationsCount, setNotificationsCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const currentMosqueId = location.pathname.split('/')[2] || null;

    const { 
        loggedInUser, profileLoading, userProfile, authLoading, 
        logOutError, showProfileMenu, setShowProfileMenu, fetchMosques, isFetching 
    } = useUserContext();

    const nigerianStates = ["Lagos", "Kano", "Kaduna", "Oyo", "Rivers", "FCT", "Borno", "Jigawa", "Plateau", "Enugu"];

    const openSearch = () => setShowSearch(true);

    const fetchUnreadNotificationsCount = async () => {
        try {
            const res = await privateAxiosInstance.get('notifications/unread-count');
            setNotificationsCount(res.data.unreadCount);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    useEffect(() => {
        fetchUnreadNotificationsCount();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMosques(1, 10, query, selectedState, true);
        }, 600);
        return () => clearTimeout(delayDebounce);
    }, [query, selectedState]);

    return (
        <header className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 text-white shadow-md fixed top-0 left-0 right-0 h-24 flex items-center z-50">
            {logOutError && <Toast />}
            <div className='flex items-center justify-between px-4 w-full -mt-2'>
                
                {/* LEFT: Menu (Mobile), Logo, and Search Trigger */}
                <div className={`flex items-center gap-2 ${showSearch ? 'hidden' : 'flex'}`}>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='md:hidden p-2 rounded-full hover:bg-white/20' aria-label="Menu">
                        {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                    
                    <button className='w-13 h-13 rounded-full focus:outline-none shrink-0' onClick={() => navigate('/')} aria-label="Home">
                        <img src={AppLogo} alt="App Logo" className='w-full h-full rounded-full' />
                    </button>

                    {/* Mobile Search Trigger */}
                    <button className='md:hidden bg-white rounded-full p-2 ml-1' onClick={openSearch} aria-label="Open search">
                        <Search className='text-emerald-700 w-5 h-5' />
                    </button>

                    {/* Desktop Search Button */}
                    {!showSearch && (
                        <button onClick={openSearch} className='hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full border border-white/30 transition-all'>
                            <Search className='w-4 h-4' /> <span>Search Mosques...</span>
                        </button>
                    )}
                </div>

                {/* RIGHT: Register, Notifications, Profile */}
                <div className={`flex items-center gap-4 ${showSearch ? 'hidden' : 'flex'}`}>
                    <button onClick={() => navigate('/register')} className='hidden md:flex bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold hover:opacity-90 items-center gap-2 text-nowrap'>
                        <UserPlus className='w-4 h-4' /> Register Mosque
                    </button>

                    <div className="relative">
                        {loggedInUser && (
                            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full bg-white/20 hover:bg-white/30">
                                <Bell className="w-6 h-6" />
                                <span className={`absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold px-1.5 rounded-full border-2 border-emerald-700 ${notificationsCount < 1 && 'hidden'}`}>
                                    {notificationsCount > 99 ? '99+' : notificationsCount}
                                </span>
                            </button>
                        )}
                        {showNotifications && (
                            <NotificationsDropdown 
                                showNotifications={showNotifications} 
                                setShowNotifications={setShowNotifications} 
                                navigate={navigate} 
                                location={location} 
                            />
                        )}
                    </div>

                    <div className='flex items-center'>
                        {!loggedInUser && profileLoading === false && !authLoading && (
                            <button onClick={() => navigate('/login')} className='bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold'>Log In</button>
                        )}
                        {loggedInUser && profileLoading === false && !authLoading && (
                            <div className='relative'>
                                <img src={userProfile} alt="Profile" onClick={() => setShowProfileMenu(prev => !prev)} className='w-11 h-11 rounded-full border-2 border-white/50 object-cover cursor-pointer' />
                                {showProfileMenu && <ProfileMenu />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Overlay */}
            <div className={`fixed top-0 left-0 right-0 bg-white shadow-xl pb-4 px-4 ${!showSearch && 'hidden'} z-50 animate-in fade-in duration-300`}>
                <div className='flex flex-col md:flex-row items-center gap-3 mt-4 max-w-6xl mx-auto'>
                    <div className='flex items-center gap-2 w-full'>
                        <button className="bg-emerald-700 text-white p-3 rounded-full" onClick={() => { setShowSearch(false); setQuery(''); }}>
                            <MoveLeft className="w-5" />
                        </button>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} className="h-12 w-full bg-gray-100 rounded-full px-6 outline-none text-gray-800" placeholder="Search by name..." autoFocus />
                    </div>
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className='h-12 w-full md:w-64 rounded-full bg-gray-100 px-4 outline-none text-gray-700'>
                        <option value="">All States</option>
                        {nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className='mt-3 max-w-6xl mx-auto'>
                    {(query.trim().length > 1 || selectedState) && (
                        <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center'>
                            {isFetching ? (
                                <div className='flex flex-col items-center gap-2 text-emerald-700'>
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <p className="font-medium">Fetching mosques...</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">Search results will appear on the main page.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;