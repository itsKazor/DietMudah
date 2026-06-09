import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Camera, TrendingUp, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavItem = ({ path, icon: Icon, label }) => {
    const isActive = currentPath === path;
    return (
      <Link 
        to={path} 
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary-dark' : 'text-text-muted'}`}
      >
        <Icon size={24} className={isActive ? 'text-primary-light' : ''} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-2 z-50 pb-safe">
      <NavItem path="/" icon={Home} label="Beranda" />
      <NavItem path="/log" icon={ClipboardList} label="Log" />
      
      {/* FAB for Scan */}
      <div className="relative -top-5 flex justify-center items-center">
        <Link 
          to="/scan" 
          className="bg-primary-dark w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Camera size={28} className="text-white" />
        </Link>
      </div>

      <NavItem path="/progress" icon={TrendingUp} label="Progress" />
      <NavItem path="/settings" icon={User} label="Profil" />
    </div>
  );
}
