import React, { useState } from 'react';
import {
  Database,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe2,
} from 'lucide-react';
import { useSystemHealth } from '../hooks';
import { Badge } from '../components/Common/Badge';

export const SystemHealth: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // TanStack Query Hook with auto-poll support
  const { data: health, isLoading, isFetching, refetch } = useSystemHealth(autoRefresh);

  const isOperational = health?.status === 'operational';

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            System Infrastructure & Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time status monitoring for PostgreSQL, Redis, Node runtime, and external services
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
            />
            <span>Auto-poll (10s)</span>
          </label>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-medium transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-sky-500' : ''}`} />
            <span>Check Now</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden transition-colors ${
          isOperational
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
              isOperational ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          >
            {isOperational ? <ShieldCheck className="w-6 h-6 stroke-[2.25]" /> : <AlertCircle className="w-6 h-6 stroke-[2.25]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isOperational ? 'All Core Systems Operational' : 'Degraded System Performance'}
              </h3>
              <Badge variant={isOperational ? 'success' : 'warning'}>
                {isOperational ? 'HEALTHY' : 'WARNING'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Last probe check: {health ? new Date(health.timestamp).toLocaleTimeString() : 'checking...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-700 dark:text-zinc-300">
          <div>
            <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase font-bold">Node Process</span>
            <span>{health?.process.nodeVersion || (isLoading ? '...' : 'v24.x')}</span>
          </div>
          <div className="border-l border-slate-200 dark:border-zinc-800 pl-4">
            <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase font-bold">Process Uptime</span>
            <span>{health?.process.uptimeFormatted || '—'}</span>
          </div>
        </div>
      </div>

      {/* Primary Datastores Latency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PostgreSQL Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Database className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">PostgreSQL (Supabase)</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Primary Relational Storage</p>
              </div>
            </div>
            <Badge
              variant={health?.services.database.status === 'healthy' ? 'success' : 'danger'}
            >
              {health?.services.database.status === 'healthy' ? 'Connected' : 'Degraded'}
            </Badge>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-950/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-zinc-400">Query Roundtrip Latency:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {health?.services.database.latencyMs !== undefined &&
              health.services.database.latencyMs >= 0
                ? `${health.services.database.latencyMs} ms`
                : isLoading
                ? 'Probing...'
                : 'Error'}
            </span>
          </div>
        </div>

        {/* Redis Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Zap className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Redis Cache & Pub/Sub</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">In-Memory Bus & Rate-Limiter</p>
              </div>
            </div>
            <Badge variant={health?.services.redis.status === 'healthy' ? 'success' : 'danger'}>
              {health?.services.redis.status === 'healthy' ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-950/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-zinc-400">Ping Response Latency:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {health?.services.redis.latencyMs !== undefined && health.services.redis.latencyMs >= 0
                ? `${health.services.redis.latencyMs} ms`
                : isLoading
                ? 'Probing...'
                : 'Error'}
            </span>
          </div>
        </div>
      </div>

      {/* Memory & Host Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node Memory Allocation */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-500 stroke-[2.25]" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Node.js Process Memory</h4>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              {health?.memory.heapUsedMB || 0} MB / {health?.memory.heapTotalMB || 0} MB
            </span>
          </div>

          {/* Visual Heap Progress Bar */}
          <div>
            <div className="w-full bg-slate-100 dark:bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-zinc-800">
              <div
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, health?.memory.heapUsagePercent || 0)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">
              <span>Heap Allocation: {health?.memory.heapUsagePercent || 0}%</span>
              <span>Resident Set (RSS): {health?.memory.rssMB || 0} MB</span>
            </div>
          </div>
        </div>

        {/* Host OS Metrics */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500 stroke-[2.25]" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Host Environment</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80 rounded-xl">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">OS Platform</span>
              <span className="text-slate-900 dark:text-zinc-100 font-semibold capitalize">{health?.os.platform || 'Linux'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80 rounded-xl">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">CPU Cores</span>
              <span className="text-slate-900 dark:text-zinc-100 font-semibold">{health?.os.cpus || 1} VCPU</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80 rounded-xl">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">Free RAM</span>
              <span className="text-slate-900 dark:text-zinc-100 font-semibold">{health?.os.freeMemoryMB || 0} MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* External Third-Party Integrations Status */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-sky-500 stroke-[2.25]" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Third-Party Service Connectors</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {health?.integrations &&
            Object.entries(health.integrations).map(([key, item]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{item.name}</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    item.configured ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {item.configured ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Configured</span>
                    </>
                  ) : (
                    <span>Not Set</span>
                  )}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
