import React from 'react';
import { Menu, Megaphone, Sun, Moon } from 'lucide-react';
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

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview';
      case '/broadcast':
        return 'Broadcast';
      case '/users':
        return 'Users';
      case '/system':
        return 'System Health';
      case '/settings':
        return 'Security & Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 px-4 lg:px-8 border-b border-slate-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile hamburger & clean breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-zinc-500 font-medium">Console</span>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <h1 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Broadcast CTA */}
        {location.pathname !== '/broadcast' && (
          <button
            onClick={() => navigate('/broadcast')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white text-xs font-semibold shadow-xs shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>New Broadcast</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-zinc-400 hover:text-amber-400 transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-slate-500 hover:text-slate-900 transition-colors" />
          )}
        </button>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-0.5" />

        {/* Admin Profile Area */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#09090b]" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-tight">
              {admin?.name || admin?.username || 'Superadmin'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono leading-tight">
              {admin?.email || 'admin@quplochat.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
