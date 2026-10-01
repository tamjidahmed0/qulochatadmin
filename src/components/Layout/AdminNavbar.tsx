import React, { useState, useEffect } from 'react';
import { Menu, Megaphone, Shield, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const AdminNavbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { admin } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="h-16 px-4 lg:px-8 border-b border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>{time || '--:--:--'}</span>
        </div>

        {/* Quick Broadcast Button */}
        {location.pathname !== '/broadcast' && (
          <button
            onClick={() => navigate('/broadcast')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white rounded-lg text-xs font-medium transition shadow-sm shadow-sky-500/20 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>New Broadcast</span>
          </button>
        )}

        {/* Theme Toggle Button (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-zinc-200 border border-slate-200/60 dark:border-zinc-800/80 transition-all cursor-pointer"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.25]" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 stroke-[2.25]" />
          )}
        </button>

        {/* Admin Role Chip */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-full text-xs text-slate-700 dark:text-zinc-300">
          <Shield className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span className="font-semibold text-slate-800 dark:text-zinc-200">{admin?.username || 'Superadmin'}</span>
        </div>
      </div>
    </header>
  );
};
