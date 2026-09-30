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
  Smartphone,
  Eye,
  Loader2,
} from 'lucide-react';
import {
  useBroadcastHistory,
  useBroadcastChatAnnouncement,
  useBroadcastPushNotification,
} from '../hooks';
import { Badge } from '../components/Common/Badge';
import { Modal } from '../components/Common/Modal';
import { toast } from 'sonner';

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

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Notification & Announcement Center</h2>
        <p className="text-xs text-slate-400 mt-1">
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
              ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">অফিশিয়াল চ্যাট অ্যানাউন্সমেন্ট</h3>
              <Badge variant="primary">Official Chat</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sends an official system message directly into every workspace owner's dedicated chat channel with live websocket delivery.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('push')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer ${
            activeTab === 'push'
              ? 'bg-emerald-600/10 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'push' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">ইন-অ্যাপ / পুশ নোটিফিকেশন</h3>
              <Badge variant="success">Push & In-App</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dispatches global in-app alerts stored in the database, real-time toast popups, and FCM push notifications to mobile/web.
            </p>
          </div>
        </button>
      </div>

      {/* Broadcast Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
            {activeTab === 'chat' ? (
              <Megaphone className="w-5 h-5 text-blue-400" />
            ) : (
              <Bell className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <h3 className="text-sm font-bold text-white">
                {activeTab === 'chat' ? 'Compose Official Chat Announcement' : 'Compose In-App & Push Notification'}
              </h3>
              <p className="text-xs text-slate-400">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Announcement Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    placeholder="e.g., 🎉 Version 2.5 Released: AI Voice Live Talk"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Announcement Message (Markdown supported) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Write your official update, feature release notes, or system news..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    <span>Banner Image or Attachment URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={chatBannerUrl}
                    onChange={(e) => setChatBannerUrl(e.target.value)}
                    placeholder="https://cdn.example.com/banner.jpg"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition font-mono text-xs"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notification Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    placeholder="e.g., Scheduled Server Maintenance Notice"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notification Message Body <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    placeholder="e.g., We will perform database maintenance tonight at 2:00 AM UTC. Estimated downtime is under 5 minutes."
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Action URL (Optional Link on click)</span>
                  </label>
                  <input
                    type="text"
                    value={pushActionUrl}
                    onChange={(e) => setPushActionUrl(e.target.value)}
                    placeholder="/settings or https://quplochat.com/news"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition font-mono text-xs"
                  />
                </div>
              </>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
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

        {/* Right: Live Realistic Device Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Live Recipient Preview</span>
          </div>

          {activeTab === 'chat' ? (
            /* Chat Inbox Simulation */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
                  Q
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Qulochat Official</h4>
                  <span className="text-[10px] text-blue-400 font-medium">Verified System Channel</span>
                </div>
              </div>

              {/* Chat Bubble Container */}
              <div className="py-4 space-y-3">
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-200 space-y-2.5 shadow-md">
                  {chatBannerUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-700/80 mb-2">
                      <img
                        src={chatBannerUrl}
                        alt="Announcement Banner"
                        className="w-full max-h-48 object-cover"
                        onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      />
                    </div>
                  )}

                  {chatTitle && (
                    <p className="font-bold text-sm text-white tracking-tight border-b border-slate-700/50 pb-1.5">
                      {chatTitle}
                    </p>
                  )}

                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {chatMessage || 'Your announcement message will render here in real-time.'}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="text-blue-400 font-medium">Official Broadcast</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                This appears in every workspace inbox with real-time audio chime & push alert.
              </p>
            </div>
          ) : (
            /* Push Notification Simulation */
            <div className="space-y-4">
              {/* Mobile Push Simulation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile Lock Screen / Banner</span>
                  </div>
                  <span className="text-[10px]">NOW</span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3 shadow-inner">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    Q
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">
                        {pushTitle || 'Notification Headline'}
                      </p>
                      <span className="text-[10px] text-slate-500">now</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                      {pushBody || 'Your push notification body will appear here on subscriber devices.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* In-App Bell simulation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <Bell className="w-3.5 h-3.5 text-blue-400" />
                  <span>In-App Notification Center Feed</span>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">
                      {pushTitle || 'Notification Headline'}
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {pushBody || 'Notification body text'}
                    </p>
                    {pushActionUrl && (
                      <p className="text-[11px] text-blue-400 font-mono mt-1 underline">
                        Target: {pushActionUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Broadcast Transmission History</h3>
              <p className="text-xs text-slate-400">Previous official announcements and global push dispatches</p>
            </div>
          </div>
          <button
            onClick={() => refetchHistory()}
            className="text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
          >
            Refresh History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Channel Type</th>
                <th className="px-6 py-3">Title / Subject</th>
                <th className="px-6 py-3">Message Snippet</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoadingHistory ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
                    <span>Loading transmission logs...</span>
                  </td>
                </tr>
              ) : history && history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <Badge variant={item.type === 'OFFICIAL_CHAT' ? 'primary' : 'success'}>
                        {item.type === 'OFFICIAL_CHAT' ? 'Official Chat' : 'In-App Push'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-200">
                      {item.title || 'Official Announcement'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 max-w-md truncate">
                      {item.message}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
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
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-300">
              <p className="font-semibold text-amber-200">Platform-Wide Distribution Warning</p>
              <p className="mt-0.5">
                This action will broadcast this message to{' '}
                <strong className="text-white">every workspace and user</strong> across the entire
                system. It cannot be recalled once dispatched.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-400">Target Channel:</span>{' '}
              <span className="font-bold text-white">
                {activeTab === 'chat' ? 'Official Inboxes (System Conversation)' : 'In-App & Push Alerts'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Headline:</span>{' '}
              <span className="font-bold text-white">
                {activeTab === 'chat' ? chatTitle || 'Official Announcement' : pushTitle}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Message Body:</span>
              <p className="text-slate-300 mt-1 italic line-clamp-3">
                "{activeTab === 'chat' ? chatMessage : pushBody}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={handleExecuteBroadcast}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
