import React from 'react';
import { NavLink } from 'react-router-dom';
import { Megaphone, History } from 'lucide-react';

interface BroadcastHeaderProps {
  title: string;
  subtitle: string;
}

export const BroadcastHeader: React.FC<BroadcastHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-800 w-fit shrink-0">
        <NavLink
          to="/broadcast"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`
          }
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>New Broadcast</span>
        </NavLink>
        <NavLink
          to="/broadcast/history"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`
          }
        >
          <History className="w-3.5 h-3.5" />
          <span>Transmission History</span>
        </NavLink>
      </div>
    </div>
  );
};
