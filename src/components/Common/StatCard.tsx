import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  icon: Icon,
  colorClass = 'from-sky-500 to-sky-600',
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-md shadow-sm shadow-slate-200/50 dark:shadow-black/50 transition-all relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 mt-1 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${colorClass} flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5 stroke-[2.25]" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 dark:text-zinc-400">{subtitle}</span>}
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
