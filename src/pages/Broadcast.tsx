import React, { useState } from 'react';
import {
  Megaphone,
  Bell,
  Send,
  Image,
  Link2,
  CheckCircle,
  AlertTriangle,
  History,
  Loader2,
} from 'lucide-react';
import {
  useBroadcastHistory,
  useBroadcastChatAnnouncement,
  useBroadcastPushNotification,
} from '../hooks';
import { Badge } from '../components/Common/Badge';
import { Modal } from '../components/Common/Modal';
import { Skeleton } from '../components/Common/Skeleton';
import { toast } from 'sonner';

const BroadcastSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    {/* Page Title & Intro Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-3.5 w-96" />
    </div>

    {/* Segmented Channel Selector Tabs Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>

    {/* Broadcast Form Skeleton (Full-Width Clean Card) */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>

    {/* History Table Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-4">
      <Skeleton className="h-4 w-44" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const Broadcast: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'push'>('chat');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Form States: Official Chat
  const [chatTitle, setChatTitle] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatBannerUrl, setChatBannerUrl] = useState('');

  // Form States: In-App / Push Notification
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushActionUrl, setPushActionUrl] = useState('');

  // TanStack Query Hooks
  const { data: history = [], isLoading: isLoadingHistory, refetch: refetchHistory } =
    useBroadcastHistory();
  const chatMutation = useBroadcastChatAnnouncement();
  const pushMutation = useBroadcastPushNotification();

  const isSending = chatMutation.isPending || pushMutation.isPending;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'chat' && !chatMessage.trim()) {
      toast.error('Announcement message body is required');
      return;
    }
    if (activeTab === 'push' && (!pushTitle.trim() || !pushBody.trim())) {
      toast.error('Notification title and body are required');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteBroadcast = async () => {
    setShowConfirmModal(false);

    try {
      if (activeTab === 'chat') {
        const res = await chatMutation.mutateAsync({
          title: chatTitle.trim() || undefined,
          message: chatMessage.trim(),
          bannerUrl: chatBannerUrl.trim() || undefined,
        });

        toast.success(
          `Official Chat Announcement dispatched to ${res.broadcastCount || 'all'} workspace inboxes!`,
        );
        setChatTitle('');
        setChatMessage('');
        setChatBannerUrl('');
      } else {
        await pushMutation.mutateAsync({
          title: pushTitle.trim(),
          body: pushBody.trim(),
          actionUrl: pushActionUrl.trim() || undefined,
        });

        toast.success('In-App Notification and FCM Push alerts queued for global broadcast!');
        setPushTitle('');
        setPushBody('');
        setPushActionUrl('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch broadcast');
    }
  };

  if (isLoadingHistory && (!history || history.length === 0)) {
    return <BroadcastSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Notification & Announcement Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Broadcast official platform announcements directly to inboxes or push alerts to active users
        </p>
      </div>

      {/* Segmented Channel Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
              : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'chat'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
            }`}
          >
            <Megaphone className="w-6 h-6 stroke-[2.25]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Official Chat Announcement
              </h3>
              <Badge variant="primary">Official Chat</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Sends an official system message directly into every workspace owner's dedicated chat channel with live websocket delivery.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('push')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer ${
            activeTab === 'push'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'push'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
            }`}
          >
            <Bell className="w-6 h-6 stroke-[2.25]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                In-App & Push Notification
              </h3>
              <Badge variant="success">Push & In-App</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Dispatches global in-app alerts stored in the database, real-time toast popups, and FCM push notifications to mobile/web.
            </p>
          </div>
        </button>
      </div>

      {/* Broadcast Form (Full-Width Card) */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100 dark:border-zinc-800">
          {activeTab === 'chat' ? (
            <Megaphone className="w-5 h-5 text-sky-500 stroke-[2.25]" />
          ) : (
            <Bell className="w-5 h-5 text-emerald-500 stroke-[2.25]" />
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              {activeTab === 'chat' ? 'Compose Official Chat Announcement' : 'Compose In-App & Push Notification'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {activeTab === 'chat'
                ? 'Delivers to every workspace owner in their system channel'
                : 'Delivers to all active users on web and mobile'}
            </p>
          </div>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-4">
          {activeTab === 'chat' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Announcement Headline (Optional)
                </label>
                <input
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder="e.g., 🎉 Version 2.5 Released: AI Voice Live Talk"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Announcement Message (Markdown supported) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Write your official update, feature release notes, or system news..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  <span>Banner Image or Attachment URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={chatBannerUrl}
                  onChange={(e) => setChatBannerUrl(e.target.value)}
                  placeholder="https://cdn.example.com/banner.jpg"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition font-mono text-xs"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Notification Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="e.g., Scheduled Server Maintenance Notice"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Notification Message Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  placeholder="e.g., We will perform database maintenance tonight at 2:00 AM UTC. Estimated downtime is under 5 minutes."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  <span>Action URL (Optional Link on click)</span>
                </label>
                <input
                  type="text"
                  value={pushActionUrl}
                  onChange={(e) => setPushActionUrl(e.target.value)}
                  placeholder="/settings or https://quplochat.com/news"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition font-mono text-xs"
                />
              </div>
            </>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 ${
                activeTab === 'chat'
                  ? 'bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-sky-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow-emerald-500/20'
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Broadcast...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Preview & Confirm Broadcast</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-sky-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-50">Broadcast Transmission History</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Previous official announcements and global push dispatches</p>
            </div>
          </div>
          <button
            onClick={() => refetchHistory()}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition cursor-pointer"
          >
            Refresh History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Channel Type</th>
                <th className="px-6 py-3">Title / Subject</th>
                <th className="px-6 py-3">Message Snippet</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {isLoadingHistory ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-in fade-in duration-200">
                    <td className="px-6 py-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-36 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-3.5 w-64 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-3.5 w-28 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16 rounded" />
                    </td>
                  </tr>
                ))
              ) : history && history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <Badge variant={item.type === 'OFFICIAL_CHAT' ? 'primary' : 'success'}>
                        {item.type === 'OFFICIAL_CHAT' ? 'Official Chat' : 'In-App Push'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-zinc-100">
                      {item.title || 'Official Announcement'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 dark:text-zinc-400 max-w-md truncate">
                      {item.message}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-zinc-500">
                    No broadcast transmissions sent yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Safety Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Mass System Broadcast"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold text-amber-900 dark:text-amber-200">Platform-Wide Distribution Warning</p>
              <p className="mt-0.5">
                This action will broadcast this message to{' '}
                <strong className="text-amber-950 dark:text-white">every workspace and user</strong> across the entire
                system. It cannot be recalled once dispatched.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Target Channel:</span>{' '}
              <span className="font-bold text-slate-900 dark:text-zinc-100">
                {activeTab === 'chat' ? 'Official Inboxes (System Conversation)' : 'In-App & Push Alerts'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Headline:</span>{' '}
              <span className="font-bold text-slate-900 dark:text-zinc-100">
                {activeTab === 'chat' ? chatTitle || 'Official Announcement' : pushTitle}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Message Body:</span>
              <p className="text-slate-700 dark:text-zinc-300 mt-1 italic line-clamp-3">
                "{activeTab === 'chat' ? chatMessage : pushBody}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={handleExecuteBroadcast}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 transition shadow-sm shadow-sky-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Confirm & Dispatch Broadcast</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
