import React, { useState } from 'react';
import {
  Database,
  Cpu,
  HardDrive,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Zap,
  Cloud,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mic,
  Server,
  Sparkles,
} from 'lucide-react';
import { useSystemHealth } from '../hooks';
import { Badge } from '../components/Common/Badge';
import { Skeleton } from '../components/Common/Skeleton';

const SystemHealthSkeleton: React.FC = () => (
  <div className="space-y-7 animate-in fade-in duration-300">
    {/* Hero Banner Skeleton */}
    <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-32 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>

    {/* Primary Datastores Latency Grid Skeleton (3 columns) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>

    {/* Storage Architecture Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-56 rounded" />
          <Skeleton className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((k) => (
          <Skeleton key={k} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    </div>

    {/* Memory & Host Metrics Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SystemHealth: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // TanStack Query Hook with auto-poll support
  const { data: health, isLoading, isFetching, refetch } = useSystemHealth(autoRefresh);

  const isOperational = health?.status === 'operational';
  const storage = health?.services.storage;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            System Infrastructure & Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time status monitoring for PostgreSQL, Redis, and Node.js process runtime
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

      {isLoading && !health ? (
        <SystemHealthSkeleton />
      ) : (
        <>
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

          {/* Primary Datastores Latency Grid (PostgreSQL, Redis, Cloudflare R2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PostgreSQL Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Database className="w-5 h-5 stroke-[2.25]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">PostgreSQL</h4>
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
                <span className="text-slate-500 dark:text-zinc-400">Query Roundtrip:</span>
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
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Redis Cache & Bus</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">In-Memory Pub/Sub & Limits</p>
                  </div>
                </div>
                <Badge variant={health?.services.redis.status === 'healthy' ? 'success' : 'danger'}>
                  {health?.services.redis.status === 'healthy' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-950/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-400">Ping Response:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {health?.services.redis.latencyMs !== undefined && health.services.redis.latencyMs >= 0
                    ? `${health.services.redis.latencyMs} ms`
                    : isLoading
                    ? 'Probing...'
                    : 'Error'}
                </span>
              </div>
            </div>

            {/* Cloudflare R2 Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Cloud className="w-5 h-5 stroke-[2.25]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Cloudflare R2</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Object Storage & Presigning</p>
                  </div>
                </div>
                <Badge
                  variant={storage?.status === 'healthy' ? 'success' : storage?.status === 'degraded' ? 'danger' : 'neutral'}
                >
                  {storage?.status === 'healthy' ? 'Connected' : storage?.status === 'degraded' ? 'Degraded' : 'Unconfigured'}
                </Badge>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-950/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-400">Bucket Probe ({storage?.region || 'APAC'}):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {storage?.latencyMs !== undefined && storage.latencyMs >= 0
                    ? `${storage.latencyMs} ms`
                    : isLoading
                    ? 'Probing...'
                    : 'Error'}
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated Cloudflare R2 Object Storage Architecture & Delivery Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">
                  <Server className="w-5 h-5 stroke-[2.25]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                    Cloudflare R2 Object Storage & CDN Architecture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Direct-to-bucket media upload protocol via S3 Presigned URLs with edge CDN delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Presigner Operational
                </span>
              </div>
            </div>

            {/* Storage Volume & Usage KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                  Total Stored Files
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  {storage?.stats?.totalFiles ?? 0}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                  Across chats & docs
                </span>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                  Storage Consumed
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  {storage?.stats?.totalSizeMB !== undefined ? `${storage.stats.totalSizeMB} MB` : '0 MB'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                  Zero egress fees
                </span>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                  Presigned URL TTL
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  {storage?.presignedTtlSeconds ?? 60}s
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                  Direct client PUT
                </span>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                  Upload Rate Limit
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono">
                  {storage?.rateLimits?.ipLimitPerMin ?? 10}/min
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                  Redis sliding window
                </span>
              </div>
            </div>

            {/* Two-Column Deep Inspection Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Column 1: Endpoint & Protocol Configuration */}
              <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bucket & CDN Endpoints</span>
                </h4>

                {/* Bucket Name */}
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">
                      Active Bucket Name
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                      {storage?.bucket || 'qulochat'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(storage?.bucket || 'qulochat', 'bucket')}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition cursor-pointer"
                    title="Copy Bucket Name"
                  >
                    {copiedKey === 'bucket' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* CDN Public URL */}
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">
                      Public Delivery CDN Domain
                    </span>
                    <a
                      href={storage?.publicUrl || 'https://cdn.qulochat.tamjidahmed.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline truncate block"
                    >
                      {storage?.publicUrl || 'https://cdn.qulochat.tamjidahmed.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          storage?.publicUrl || 'https://cdn.qulochat.tamjidahmed.com',
                          'publicUrl'
                        )
                      }
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition cursor-pointer"
                      title="Copy Public CDN URL"
                    >
                      {copiedKey === 'publicUrl' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={storage?.publicUrl || 'https://cdn.qulochat.tamjidahmed.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition"
                      title="Open CDN Domain"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* S3 API Endpoint */}
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">
                      S3 Compatibility API Endpoint
                    </span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300 truncate block text-[11px]">
                      {storage?.endpoint || 'https://*.r2.cloudflarestorage.com'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(storage?.endpoint || '', 'endpoint')}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition cursor-pointer"
                    title="Copy S3 Endpoint"
                  >
                    {copiedKey === 'endpoint' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Column 2: Media Breakdown & Presigned Workflow */}
              <div className="p-4 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Media Breakdown & Type Support</span>
                </h4>

                {/* File Distribution Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">Images</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {storage?.stats?.imagesCount ?? 0} files
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">Audio / Voice</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {storage?.stats?.audioCount ?? 0} clips
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">Documents</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {storage?.stats?.documentsCount ?? 0} files
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-semibold">Brain Docs</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {storage?.stats?.brainDocsCount ?? 0} synced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Allowed Types Pills */}
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 space-y-2">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase font-bold">
                    Whitelisted File Formats
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(storage?.allowedExtensions || [
                      'jpg', 'jpeg', 'png', 'webp', 'gif',
                      'pdf', 'mp3', 'wav', 'm4a', 'ogg', 'webm'
                    ]).map((ext) => (
                      <span
                        key={ext}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-md text-[10px] font-mono uppercase"
                      >
                        .{ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Explainer Callout */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-500/20 flex items-start gap-3 text-xs text-slate-600 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <p>
                <strong>Zero-Server-Hop Upload Architecture:</strong> Chat visitors and support agents request signed authorization tokens from the API, and upload binary blobs directly to Cloudflare R2 via AWS S3 SigV4 presigned PUT URLs with a 60-second validity window. This guarantees zero server memory consumption during large file transmissions.
              </p>
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
        </>
      )}
    </div>
  );
};
