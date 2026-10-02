import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  RefreshCw,
  Megaphone,
  Bell,
  CheckCircle2,
  Calendar,
  Link2,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  Copy,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { useBroadcastHistory } from '../hooks';
import { Badge } from '../components/Common/Badge';
import { Modal } from '../components/Common/Modal';
import { StatCard } from '../components/Common/StatCard';
import { Skeleton } from '../components/Common/Skeleton';
import { BroadcastHeader } from '../components/Broadcast/BroadcastHeader';
import { toast } from 'sonner';
import type { BroadcastItem } from '../types/admin';

export const BroadcastHistory: React.FC = () => {
  const navigate = useNavigate();
  const { data: history = [], isLoading, isFetching, refetch } = useBroadcastHistory();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'ALL' | 'OFFICIAL_CHAT' | 'PUSH_NOTIFICATION'>('ALL');
  const [selectedItem, setSelectedItem] = useState<BroadcastItem | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Compute counts
  const chatCount = useMemo(
    () => history.filter((item) => item.type === 'OFFICIAL_CHAT').length,
    [history],
  );
  const pushCount = useMemo(
    () => history.filter((item) => item.type === 'PUSH_NOTIFICATION').length,
    [history],
  );

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Channel match
      if (selectedChannel !== 'ALL' && item.type !== selectedChannel) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const msgMatch = (item.message || '').toLowerCase().includes(query);
        if (!titleMatch && !msgMatch) {
          return false;
        }
      }
      return true;
    });
  }, [history, selectedChannel, searchQuery]);

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success('Message content copied to clipboard');
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleReuseBroadcast = (item: BroadcastItem) => {
    navigate('/broadcast', {
      state: {
        prefill: {
          type: item.type,
          title: item.title,
          message: item.message,
          fileUrl: item.fileUrl,
          actionUrl: item.data?.actionUrl,
        },
      },
    });
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Switcher */}
      <BroadcastHeader
        title="Broadcast Transmission History"
        subtitle="Complete audit trail and delivery records of previous announcements and global push dispatches"
      />

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Dispatched"
          value={history.length}
          subtitle="All platform broadcast events"
          loading={isLoading}
        />
        <StatCard
          title="Chat Announcements"
          value={chatCount}
          subtitle="Delivered to workspace system inboxes"
          loading={isLoading}
        />
        <StatCard
          title="Push Dispatches"
          value={pushCount}
          subtitle="In-app alerts and mobile pushes"
          loading={isLoading}
        />
        <StatCard
          title="Delivery Health"
          value="100%"
          subtitle="All recorded dispatches delivered"
          loading={isLoading}
        />
      </div>

      {/* Search, Filter & Actions Toolbar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transmission history by title or message..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Channel Filters and Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-800">
            <button
              onClick={() => setSelectedChannel('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedChannel === 'ALL'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setSelectedChannel('OFFICIAL_CHAT')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedChannel === 'OFFICIAL_CHAT'
                  ? 'bg-white dark:bg-zinc-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Chat ({chatCount})
            </button>
            <button
              onClick={() => setSelectedChannel('PUSH_NOTIFICATION')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedChannel === 'PUSH_NOTIFICATION'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Push ({pushCount})
            </button>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh history"
            className="p-2 rounded-xl border border-slate-200/80 dark:border-zinc-800 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 flex items-center justify-center mx-auto mb-3">
            {searchQuery ? <Filter className="w-6 h-6" /> : <History className="w-6 h-6" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            {searchQuery ? 'No transmissions matching your query' : 'No transmission records found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any broadcasts matching "${searchQuery}". Try a different keyword or reset filters.`
              : 'Dispatched official announcements and push notifications will appear here with delivery details.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {searchQuery || selectedChannel !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedChannel('ALL');
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/broadcast')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Create New Broadcast</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on Small Screens) */}
          <div className="hidden md:block bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold border-b border-slate-200/70 dark:border-zinc-800/80">
                  <tr>
                    <th className="px-5 py-3.5">Channel</th>
                    <th className="px-5 py-3.5">Subject / Headline</th>
                    <th className="px-5 py-3.5">Message Snippet</th>
                    <th className="px-5 py-3.5">Media / Link</th>
                    <th className="px-5 py-3.5">Dispatched At</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          {item.type === 'OFFICIAL_CHAT' ? (
                            <Badge variant="primary" className="gap-1">
                              <Megaphone className="w-3 h-3 text-sky-500" />
                              <span>Official Chat</span>
                            </Badge>
                          ) : (
                            <Badge variant="success" className="gap-1">
                              <Bell className="w-3 h-3 text-emerald-500" />
                              <span>In-App Push</span>
                            </Badge>
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-zinc-100 max-w-[200px] truncate">
                        {item.title || (item.type === 'OFFICIAL_CHAT' ? 'Official Announcement' : 'Global Alert')}
                      </td>

                      <td className="px-5 py-4 text-slate-500 dark:text-zinc-400 max-w-xs truncate">
                        {item.message}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          {item.fileUrl && (
                            <span
                              title="Media banner attached"
                              className="p-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-sky-600 dark:text-sky-400"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {item.data?.actionUrl && (
                            <span
                              title={`Action URL: ${item.data.actionUrl}`}
                              className="p-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {!item.fileUrl && !item.data?.actionUrl && (
                            <span className="text-slate-300 dark:text-zinc-600 font-mono">—</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                        {formatTimestamp(item.createdAt)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (Shown on Small Screens) */}
          <div className="md:hidden space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs space-y-3 cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  {item.type === 'OFFICIAL_CHAT' ? (
                    <Badge variant="primary" className="gap-1">
                      <Megaphone className="w-3 h-3 text-sky-500" />
                      <span>Official Chat</span>
                    </Badge>
                  ) : (
                    <Badge variant="success" className="gap-1">
                      <Bell className="w-3 h-3 text-emerald-500" />
                      <span>In-App Push</span>
                    </Badge>
                  )}
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {item.title || (item.type === 'OFFICIAL_CHAT' ? 'Official Announcement' : 'Global Alert')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <span>Inspect Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detailed Transmission Inspection Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Transmission Details"
        >
          <div className="space-y-5">
            {/* Header Status Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                {selectedItem.type === 'OFFICIAL_CHAT' ? (
                  <Badge variant="primary" className="gap-1.5 py-1 px-2.5">
                    <Megaphone className="w-3.5 h-3.5 text-sky-500" />
                    <span>Official Workspace Chat</span>
                  </Badge>
                ) : (
                  <Badge variant="success" className="gap-1.5 py-1 px-2.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-500" />
                    <span>In-App Alert & Mobile Push</span>
                  </Badge>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatTimestamp(selectedItem.createdAt)}</span>
              </div>
            </div>

            {/* Title / Subject */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">
                Headline / Subject
              </label>
              <div className="text-base font-bold text-slate-900 dark:text-zinc-50">
                {selectedItem.title || (selectedItem.type === 'OFFICIAL_CHAT' ? 'Official Platform Announcement' : 'Global Alert')}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Message Content
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(selectedItem.message)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition cursor-pointer"
                >
                  {hasCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedItem.message}
              </div>
            </div>

            {/* Attached Banner Image Preview */}
            {selectedItem.fileUrl && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Attached Media</span>
                </label>
                <div className="rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-slate-50 dark:bg-zinc-950 p-2 flex items-center gap-3">
                  <img
                    src={selectedItem.fileUrl}
                    alt="Broadcast attachment"
                    className="w-16 h-16 rounded-lg object-cover bg-zinc-800"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-slate-600 dark:text-zinc-300 truncate">
                      {selectedItem.fileName || selectedItem.fileUrl}
                    </p>
                    <a
                      href={selectedItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline mt-1"
                    >
                      <span>Open media</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Attached Action URL */}
            {selectedItem.data?.actionUrl && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Action Target URL</span>
                </label>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-zinc-300 truncate">
                  {selectedItem.data.actionUrl}
                </div>
              </div>
            )}

            {/* Target Distribution Scope */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400">
              <span className="font-semibold text-slate-900 dark:text-zinc-200">Delivery Scope: </span>
              {selectedItem.type === 'OFFICIAL_CHAT'
                ? 'Delivered to all workspace owner system chat channels with real-time websocket synchronization.'
                : 'Dispatched to in-app notification centers and mobile push subscribers platform-wide.'}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleReuseBroadcast(selectedItem)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Reuse as New Broadcast</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
