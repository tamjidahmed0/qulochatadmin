import React, { useState } from 'react';
import {
  RefreshCw,
  AppWindow,
  Globe,
  ShieldBan,
  Radio,
  ArrowUpRight,
} from 'lucide-react';
import { useAnalyticsOverview } from '../hooks';
import { StatCard } from '../components/Common/StatCard';
import { Badge } from '../components/Common/Badge';
import { Skeleton } from '../components/Common/Skeleton';
import { MessageVolumeChart } from '../components/Charts/MessageVolumeChart';
import { UserGrowthChart } from '../components/Charts/UserGrowthChart';
import { DistributionPieChart } from '../components/Charts/DistributionPieChart';
import { useNavigate } from 'react-router-dom';

function DashboardSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Secondary Metrics Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>

      {/* Distribution Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-36" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<string>('30d');

  // TanStack Query Hook
  const { data, isLoading, isFetching, error, refetch } = useAnalyticsOverview(range);

  const ranges = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: 'all', label: 'All Time' },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-7">
      {/* Top Bar: Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Platform Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time aggregate data across all workspaces, users, and conversations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Range Segmented Control */}
          <div className="bg-slate-100 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  range === r.key
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-700 transition disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
          {error.message || 'Failed to load platform analytics.'}
        </div>
      )}

      {/* KPI Stat Cards (Clean 3-column layout without gradient icon squares) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        <StatCard
          title="Total Users"
          value={data?.kpis.totalUsers.value}
          subtitle={`${data?.kpis.totalUsers.active ?? 0} Active • ${data?.kpis.totalUsers.inactive ?? 0} Inactive`}
          trend={data?.kpis.totalUsers.trend}
          trendUp={data?.kpis.totalUsers.trendUp}
        />

        <StatCard
          title="Total Messages Exchanged"
          value={data?.kpis.totalMessages.value}
          subtitle={`${(data?.kpis.totalMessages.periodCount ?? 0).toLocaleString()} in this period`}
          trend={data?.kpis.totalMessages.trend}
          trendUp={data?.kpis.totalMessages.trendUp}
        />

        <StatCard
          title="Total Conversations"
          value={data?.kpis.totalConversations.value}
          subtitle={`${data?.kpis.totalConversations.active ?? 0} Active • ${data?.kpis.totalConversations.closed ?? 0} Closed`}
        />
      </div>

      {/* Secondary Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <AppWindow className="w-4 h-4 stroke-[2.25]" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Total Widgets</p>
            <p className="text-base font-bold text-slate-900 dark:text-zinc-50">{data?.kpis.assets.totalWidgets ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Globe className="w-4 h-4 stroke-[2.25]" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Total Visitors</p>
            <p className="text-base font-bold text-slate-900 dark:text-zinc-50">{data?.kpis.assets.totalVisitors ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldBan className="w-4 h-4 stroke-[2.25]" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Blocked Visitors</p>
            <p className="text-base font-bold text-slate-900 dark:text-zinc-50">{data?.kpis.assets.blockedVisitors ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Radio className="w-4 h-4 stroke-[2.25]" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">AI Knowledge Brains</p>
            <p className="text-base font-bold text-slate-900 dark:text-zinc-50">{data?.kpis.assets.totalBrains ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Volume Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Message Activity Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Daily message traffic by Visitors, Agents, and AI Bots</p>
            </div>
          </div>
          <MessageVolumeChart data={data?.timeline || []} />
        </div>

        {/* User Growth Chart (1 col) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">User Growth Timeline</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">New user registrations across the selected period</p>
            <UserGrowthChart data={data?.timeline || []} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
            <span>Recent Growth Rate</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{data?.kpis.totalUsers.trend}</span>
          </div>
        </div>
      </div>

      {/* Breakdowns & Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plans Distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50 mb-1">Subscription Tiers</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">User distribution by subscription plan</p>
          <DistributionPieChart data={data?.breakdowns.plans || []} />
        </div>

        {/* Roles Distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50 mb-1">Account Types</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">Workspace Owners vs Team Members</p>
          <DistributionPieChart data={data?.breakdowns.roles || []} />
        </div>

        {/* Auth Methods */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50 mb-1">Authentication Channels</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">Sign-in methods preferred by users</p>
          <DistributionPieChart data={data?.breakdowns.authMethods || []} />
        </div>
      </div>

      {/* Recent Registered Users Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Latest Platform Registrations</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Recently created owner and agent accounts</p>
          </div>
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition cursor-pointer"
          >
            <span>View All Users</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Auth Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {data?.recentUsers && data.recentUsers.length > 0 ? (
                data.recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">{u.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">{u.email}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={u.role === 'OWNER' ? 'primary' : 'neutral'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={u.plan === 'FREE' ? 'neutral' : 'purple'}>
                        {u.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-slate-700 dark:text-zinc-300 capitalize font-medium">
                        {u.authMethod.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-zinc-500">
                    No users registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
