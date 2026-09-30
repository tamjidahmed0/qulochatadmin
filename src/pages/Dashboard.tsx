import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  MessageCircle,
  Smile,
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
import { MessageVolumeChart } from '../components/Charts/MessageVolumeChart';
import { UserGrowthChart } from '../components/Charts/UserGrowthChart';
import { DistributionPieChart } from '../components/Charts/DistributionPieChart';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<string>('30d');

  // TanStack Query Hook
  const { data, isLoading, isFetching, error, refetch } = useAnalyticsOverview(range);

  const ranges = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-7">
      {/* Top Bar: Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Platform Analytics & Metrics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate data across all workspaces, users, and conversations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Range Segmented Control */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  range === r.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
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
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition disabled:opacity-50 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error.message || 'Failed to load platform analytics.'}
        </div>
      )}

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={isLoading ? '...' : (data?.kpis.totalUsers.value ?? '—')}
          subtitle={`${data?.kpis.totalUsers.active ?? 0} Active • ${data?.kpis.totalUsers.inactive ?? 0} Inactive`}
          trend={data?.kpis.totalUsers.trend}
          trendUp={data?.kpis.totalUsers.trendUp}
          icon={Users}
          colorClass="from-blue-600 to-indigo-600"
        />

        <StatCard
          title="Total Messages Exchanged"
          value={isLoading ? '...' : (data?.kpis.totalMessages.value ?? '—')}
          subtitle={`${(data?.kpis.totalMessages.periodCount ?? 0).toLocaleString()} in this period`}
          trend={data?.kpis.totalMessages.trend}
          trendUp={data?.kpis.totalMessages.trendUp}
          icon={MessageSquare}
          colorClass="from-emerald-600 to-teal-600"
        />

        <StatCard
          title="Total Conversations"
          value={isLoading ? '...' : (data?.kpis.totalConversations.value ?? '—')}
          subtitle={`${data?.kpis.totalConversations.active ?? 0} Active • ${data?.kpis.totalConversations.closed ?? 0} Closed`}
          icon={MessageCircle}
          colorClass="from-purple-600 to-violet-600"
        />

        <StatCard
          title="Satisfaction Rating (CSAT)"
          value={isLoading ? '...' : `${data?.kpis.satisfaction.score ?? 0}%`}
          subtitle={`${data?.kpis.satisfaction.totalRatings ?? 0} ratings received`}
          icon={Smile}
          colorClass="from-amber-500 to-orange-500"
        />
      </div>

      {/* Secondary Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <AppWindow className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Widgets</p>
            <p className="text-base font-bold text-white">{data?.kpis.assets.totalWidgets ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Visitors</p>
            <p className="text-base font-bold text-white">{data?.kpis.assets.totalVisitors ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldBan className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Blocked Visitors</p>
            <p className="text-base font-bold text-white">{data?.kpis.assets.blockedVisitors ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">AI Knowledge Brains</p>
            <p className="text-base font-bold text-white">{data?.kpis.assets.totalBrains ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Volume Trend (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Message Activity Breakdown</h3>
              <p className="text-xs text-slate-400">Daily message traffic by Visitors, Agents, and AI Bots</p>
            </div>
          </div>
          <MessageVolumeChart data={data?.timeline || []} />
        </div>

        {/* User Growth Chart (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">User Growth Timeline</h3>
            <p className="text-xs text-slate-400 mb-4">New user registrations across the selected period</p>
            <UserGrowthChart data={data?.timeline || []} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Recent Growth Rate</span>
            <span className="font-semibold text-emerald-400">{data?.kpis.totalUsers.trend}</span>
          </div>
        </div>
      </div>

      {/* Breakdowns & Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plans Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Subscription Tiers</h3>
          <p className="text-xs text-slate-400 mb-2">User distribution by subscription plan</p>
          <DistributionPieChart data={data?.breakdowns.plans || []} />
        </div>

        {/* Roles Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Account Types</h3>
          <p className="text-xs text-slate-400 mb-2">Workspace Owners vs Team Members</p>
          <DistributionPieChart data={data?.breakdowns.roles || []} />
        </div>

        {/* Auth Methods */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-1">Authentication Channels</h3>
          <p className="text-xs text-slate-400 mb-2">Sign-in methods preferred by users</p>
          <DistributionPieChart data={data?.breakdowns.authMethods || []} />
        </div>
      </div>

      {/* Recent Registered Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-sm font-bold text-white">Latest Platform Registrations</h3>
            <p className="text-xs text-slate-400">Recently created owner and agent accounts</p>
          </div>
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
          >
            <span>View All Users</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Auth Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {data?.recentUsers && data.recentUsers.length > 0 ? (
                data.recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-200">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
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
                      <span className="text-slate-300 capitalize">
                        {u.authMethod.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    {isLoading ? 'Loading users...' : 'No users registered yet'}
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
