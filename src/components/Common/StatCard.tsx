import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface StatCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all group">
      {/* Top Header Row: Metric Title & Trend Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        {trend && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${
              trendUp
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20'
            }`}
          >
            {trendUp ? (
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3">
        <div className="text-3xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight font-sans">
          {typeof value === 'number' ? value.toLocaleString() : (value ?? '—')}
        </div>
      </div>

      {/* Subtitle / Context */}
      {subtitle && (
        <div className="mt-2.5 text-xs text-slate-500 dark:text-zinc-400 font-normal">
          {subtitle}
        </div>
      )}
    </div>
  );
};
