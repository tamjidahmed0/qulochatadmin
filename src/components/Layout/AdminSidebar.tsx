import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Activity,
  Settings,
  LogOut,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { admin, logout } = useAdminAuth();

  const navItems = [
    { to: '/', label: 'Analytics & Overview', icon: LayoutDashboard, exact: true },
    { to: '/broadcast', label: 'Broadcast System', icon: Megaphone },
    { to: '/users', label: 'User Directory', icon: Users },
    { to: '/system', label: 'Server & System Health', icon: Activity },
    { to: '/settings', label: 'Admin Security', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#09090b] border-r border-slate-200/60 dark:border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-zinc-50 tracking-tight">QuploChat</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20 rounded">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Master Control Console</p>
            </div>
          </div>
        </div>

        {/* Live System Badge */}
        <div className="px-4 py-3 mx-4 my-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">System Live</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-500">
            <Radio className="w-3 h-3 text-emerald-500" />
            <span>Encrypted</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-zinc-900 dark:text-zinc-50 font-semibold shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-sky-500 dark:text-sky-400 stroke-[2.25]'
                          : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{admin?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">{admin?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
