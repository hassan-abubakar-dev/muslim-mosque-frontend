




import { MessageCircle, MoveLeft, Search, UserPlus, Bell } from 'lucide-react';
import AppLogo from '../assets/masjiba-logo-icon.png';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useUserContext } from '../context/UserContext';
import Toast from './Toast';

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [results, setResults] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    const currentMosqueId = location.pathname.split('/')[2] || null;
    const { loggedInUser, profileLoading, userProfile, authLoading, logOutError } = useUserContext();

    // Mock Nigerian States for the dropdown
    const nigerianStates = ["Lagos", "Kano", "Kaduna", "Oyo", "Rivers", "FCT", "Borno", "Jigawa", "Plateau", "Enugu"];

    const mockNotifications = [
        { id: 1, title: 'Prayer Time Change', description: 'Maghrib prayer time has been updated for this week. Please check the new schedule.' },
        { id: 2, title: 'Youth Study Group', description: 'A new youth study group will meet every Wednesday evening to review Quranic lessons.' },
        { id: 3, title: 'Community Iftar', description: 'Join us this Friday for a community iftar with food, prayer, and fellowship. All are welcome.' },
        { id: 4, title: 'Volunteer Signup', description: 'We are looking for volunteers to help with the mosque cleanup and event support this weekend.' },
        { id: 5, title: 'Ramadan Preparation', description: 'Ramadan preparations are underway. Attend the planning meeting on Tuesday to share your ideas.' },
        { id: 6, title: 'Charity Drive', description: 'Our charity drive is collecting donations for families in need. Please contribute items or funds if you can.' },
        { id: 7, title: 'Eid Celebration', description: 'Eid celebration details are finalized. Expect special prayers, food, and activities for children.' },
        { id: 8, title: 'Health Workshop', description: 'A health and wellness workshop will be held next Saturday focusing on family nutrition.' },
        { id: 9, title: 'Guest Speaker', description: 'A guest speaker will join us on Sunday to speak about spiritual growth and community service.' },
        { id: 10, title: 'Mosque Maintenance', description: 'Routine maintenance work will take place on Monday morning. Please avoid the prayer hall during that time.' }
    ];

    const openSearch = () => {
        setShowSearch(true);
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem('mosques');
            const mosques = raw ? JSON.parse(raw) : [];
            if (query.trim().length > 1 || selectedState) {
                const q = query.toLowerCase();
                const matched = mosques.filter(m => {
                    const matchesName = (m.name || '').toLowerCase().includes(q);
                    const matchesState = selectedState ? m.state === selectedState : true;
                    return matchesName && matchesState;
                }).slice(0, 5);
                setResults(matched);
            } else {
                setResults([]);
            }
        } catch (e) { setResults([]); }
    }, [query, selectedState]);

    const openMosque = (mosque) => {
        if (!mosque) return;
        navigate(`/mosque/${mosque.id}`, { state: { mosque } });
        setQuery('');
        setResults([]);
        setShowSearch(false);
    };

    return (
        <header className="bg-linear-to-r from-emerald-800 via-emerald-700 to-green-600 text-white shadow-md fixed top-0 left-0 right-0 h-24 flex items-center z-40">
            {logOutError && <Toast />}
            <div className='flex items-center justify-between px-4 w-full'>
                <div className={`flex items-center gap-4 ${showSearch ? 'hidden' : 'flex'}`}>
                    <button className='w-14 h-14 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 shrink-0' onClick={() => navigate('/')} aria-label="Home">
                        <img src={AppLogo} alt="App Logo" className='w-full h-full rounded-full mt-3 ml-3' />
                    </button>

                    {/* Desktop Search Display: Show "Search" button, click to expand */}
                    {!showSearch && (
                        <div className='hidden md:flex items-center gap-2'>
                             <button 
                                onClick={openSearch}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full border border-white/30 transition-all text-white cursor-pointer'
                            >
                                <Search className='w-4 h-4' />
                                <span>Search Mosques...</span>
                            </button>
                        </div>
                    )}

                    {/* mobile search trigger icon */}
                    <button className='md:hidden bg-white rounded-full p-2' onClick={openSearch} aria-label="Open search">
                        <Search className='text-emerald-700 w-5 h-5' />
                    </button>
                </div>

                <div className='flex items-center gap-5'>
                    {/* Notification Icon with Badge */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowNotifications((prev) => !prev);
                            }}
                            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-sm hover:bg-white/30"
                        >
                            <Bell className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-emerald-700">
                                3
                            </span>
                        </button>

                        {showNotifications && (
                            <div className="absolute left-1/2 top-14 z-50 w-[min(100vw-2rem,320px)] -translate-x-1/2 overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-900 shadow-2xl sm:left-auto sm:right-0 sm:translate-x-0">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-sm font-semibold">Notifications</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNotifications(false);
                                            const notificationsPath = currentMosqueId ? `/mosque/${currentMosqueId}/notifications` : '/notifications';
                                            navigate(notificationsPath, {
                                                state: {
                                                    mosqueFromState: location?.state?.mosque || null,
                                                    mosqueId: currentMosqueId,
                                                },
                                            });
                                        }}
                                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                    >
                                        See all
                                    </button>
                                </div>
                                <div className="max-h-96 space-y-2 overflow-y-auto p-3">
                                    {mockNotifications.slice(0, visibleNotificationsCount).map((notification) => (
                                        <div key={notification.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                                            <p className="text-sm text-gray-600 mt-2">{notification.description}</p>
                                        </div>
                                    ))}
                                </div>
                                {visibleNotificationsCount < mockNotifications.length && (
                                    <div className="border-t border-gray-200 p-3">
                                        <button
                                            type="button"
                                            onClick={() => setVisibleNotificationsCount(mockNotifications.length)}
                                            className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`flex items-center gap-3 ${showSearch ? 'hidden' : 'flex'}`}>
                        <button onClick={() => setMobileMenuOpen(prev => !prev)} className='sm:hidden px-2 py-1 rounded-md bg-transparent text-white' aria-label="Toggle menu">☰</button>
                    </div>
                    
                    <div className={`hidden sm:flex items-center ${showSearch ? 'hidden' : 'flex'}`}>
                        <button
                            onClick={() => { navigate('/register'); }}
                            className='bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold hover:opacity-90 text-nowrap cursor-pointer'
                        >
                            <UserPlus className='w-4 h-4 inline-block mr-1' />
                            Register Mosque
                        </button>
                    </div>

                    <div className='flex items-center'>
                        {!loggedInUser && profileLoading === false && authLoading && (
                            <div className="h-14 w-14 rounded-full bg-gray-300 animate-pulse" />
                        )}

                        {!loggedInUser && profileLoading === false && !authLoading && (
                            <div className='flex items-center gap-2'>
                                <button onClick={() => { window.history.pushState({}, '', '/signup'); window.dispatchEvent(new PopStateEvent('popstate')); }} className='text-white/90 text-sm px-3 py-1 rounded-md border border-white/20 hover:bg-white/10 cursor-pointer'>Sign Up</button>
                                <button onClick={() => { window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')); }} className='bg-white text-emerald-700 px-3 py-1 rounded-md font-semibold cursor-pointer'>Log In</button>
                            </div>
                        )}

                        {loggedInUser && profileLoading === false && !authLoading && (
                            <div>
                                <div className='w-14 h-14 cursor-pointer' onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                    <img src={userProfile} alt="Profile" className='w-full h-full rounded-full border-2 border-white/50' />
                                </div>
                                {showProfileMenu && <ProfileMenu />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FULL Search Overlay (Mobile & Expanded Desktop) */}
            <div className={`fixed top-0 left-0 right-0 bg-white shadow-xl pb-4 px-4 ${!showSearch && 'hidden'} z-50 animate-in fade-in slide-in-from-top duration-300`}>
                <div className='flex flex-col md:flex-row items-center gap-3 mt-4 max-w-6xl mx-auto'>
                    <div className='flex items-center gap-2 w-full'>
                        <button
                            className="bg-emerald-700 text-white px-3 h-12 rounded-full flex items-center justify-center shrink-0"
                            onClick={() => { setShowSearch(false); setQuery(''); setSelectedState(''); }}
                            aria-label="Close search"
                        >
                            <MoveLeft className="w-5" />
                        </button>

                        <div className='flex flex-1 items-center bg-gray-100 rounded-full border border-gray-200 overflow-hidden px-4'>
                            <Search className='text-gray-400 w-5 h-5' />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                type="text"
                                className="h-12 w-full outline-none bg-transparent placeholder:text-gray-500 pl-2 text-gray-800"
                                placeholder="Search by name..."
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Nigerian State Dropdown */}
                    <div className='w-full md:w-64'>
                        <select 
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className='h-12 w-full rounded-full border border-gray-200 bg-gray-100 px-4 outline-none text-gray-700 appearance-none cursor-pointer'
                        >
                            <option value="">All States</option>
                            {nigerianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Area */}
                <div className='mt-3 max-w-6xl mx-auto'>
                    {(query.trim().length > 1 || selectedState) && (
                        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                            {results.length === 0 ? (
                                <div className='p-6 text-center text-gray-500'>
                                    <p>No mosques found matching these criteria.</p>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                                    {results.map(r => (
                                        <button key={r.id} onClick={() => openMosque(r)} className='w-full text-left px-6 py-4 hover:bg-emerald-50 transition-colors border-b last:border-0 border-gray-50'>
                                            <div className='font-bold text-emerald-900'>{r.name}</div>
                                            <div className='text-sm text-gray-500'>{r.localGovernment}, {r.state}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
