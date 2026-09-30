import React, { useState, useEffect } from 'react';
import { Menu, Megaphone, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const AdminNavbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { admin } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview & Analytics';
      case '/broadcast':
        return 'Notification & Announcement Broadcaster';
      case '/users':
        return 'Platform User Directory';
      case '/system':
        return 'Server & Infrastructure Health';
      case '/settings':
        return 'Admin Security & Credentials';
      default:
        return 'Admin Console';
    }
  };

  return (
    <header className="h-16 px-4 lg:px-8 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>{time || '--:--:--'}</span>
        </div>

        {/* Quick Broadcast Button */}
        {location.pathname !== '/broadcast' && (
          <button
            onClick={() => navigate('/broadcast')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-sm shadow-blue-600/30"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>New Broadcast</span>
          </button>
        )}

        {/* Admin Role Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs text-slate-300">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-200">{admin?.username || 'Superadmin'}</span>
        </div>
      </div>
    </header>
  );
};
