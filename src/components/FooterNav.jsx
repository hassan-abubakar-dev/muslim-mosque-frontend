import { Home, Book, Moon, Clock, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/' },
    { id: 'quran', label: 'Qur\'an', icon: Book, route: '/quran' },
    { id: 'adhkar', label: 'Adhkar', icon: Moon, route: '/adhkar' },
    { id: 'prayer', label: 'Prayer', icon: Clock, route: '/prayer' },
    { id: 'dua', label: 'Dua', icon: Heart, route: '/dua' },
  ];

  const isActive = (route) => location.pathname === route;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-around h-16 sm:h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-md transition
                ${active
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                }
              `}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FooterNav;
