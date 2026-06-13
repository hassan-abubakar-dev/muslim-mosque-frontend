import { Bookmark, BookmarkPlus, FileText, Library, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        { icon: BookmarkPlus, label: 'Video Library', path: '/video-library' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        onClose?.();
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 md:hidden z-30 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-24 left-0 w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300 md:translate-x-0 h-[calc(100vh-6rem)]  ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-6 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>

                {/* Navigation Items */}
                <nav className="px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;