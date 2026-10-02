import React, { useState, useEffect } from 'react';
import { KeyRound, Lock, User, Mail, Save, Loader2, Sun, Moon, ShieldCheck, Laptop, Smartphone, RefreshCw, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUpdateAdminCredentials } from '../hooks';
import { adminService } from '../services/adminService';
import { Skeleton } from '../components/Common/Skeleton';
import { toast } from 'sonner';

const SettingsSkeleton: React.FC = () => (
  <div className="space-y-7 max-w-4xl animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-6 w-60" />
      <Skeleton className="h-3.5 w-96" />
    </div>

    {/* Theme Preferences Card Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-72" />
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>

    {/* Profile Credentials Form Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const { admin, refreshProfile, isLoading } = useAdminAuth();
  const { theme, setTheme } = useTheme();
  const updateMutation = useUpdateAdminCredentials();

  const [name, setName] = useState(admin?.name || 'Super Administrator');
  const [email, setEmail] = useState(admin?.email || '');
  const [username, setUsername] = useState(admin?.username || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stateful Redis Sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const data = await adminService.getSessions();
      setSessions(data || []);
    } catch {
      // Ignore if session call not available
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadSessions();
    }
  }, [admin]);

  const handleRevokeSingleSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    try {
      const res = await adminService.revokeSession(sessionId);
      if (res.isCurrent) {
        toast.success('Logged out successfully');
        window.location.href = '/login';
        return;
      }
      toast.success('Session revoked! Device has been logged out.');
      await loadSessions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke session');
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeAllOthers = async () => {
    setIsRevoking(true);
    try {
      const res = await adminService.revokeAllOtherSessions();
      toast.success(res.message || 'All other active sessions revoked');
      await loadSessions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke sessions');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error('Current password is required to set a new password');
      return;
    }

    try {
      const payload: any = {};
      if (name.trim() !== admin?.name) payload.name = name.trim();
      if (email.trim().toLowerCase() !== admin?.email) payload.email = email.trim().toLowerCase();
      if (username.trim().toLowerCase() !== admin?.username)
        payload.username = username.trim().toLowerCase();

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        toast.info('No changes made');
        return;
      }

      await updateMutation.mutateAsync(payload);
      toast.success('Admin credentials updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update admin credentials');
    }
  };

  if (isLoading && !admin) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-7 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
          Admin Security & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Configure master admin credentials, customize theme appearance, and review active security policies
        </p>
      </div>

      {/* Theme Preferences Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-1">
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
          Choose your visual console theme (stored in your browser preferences)
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm ring-1 ring-sky-500/30'
                : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
              <Sun className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Light Mode</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">Clean slate canvas</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-sm ring-1 ring-sky-500/30'
                : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
              <Moon className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Dark Mode</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">True black OLED</p>
            </div>
          </button>
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <form onSubmit={handleUpdate} className="space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 pb-3 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-sky-500" />
            <span>Configure Admin Account</span>
          </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Admin Master Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Password Change Sub-section */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-500" />
                  <span>Change Password (Leave blank to keep current)</span>
                </h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-1.5">
                  Current Password (Required for changes)
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs text-slate-900 dark:text-zinc-100 outline-none transition font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition shadow-sm shadow-sky-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Stateful Redis Sessions & Security Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm shadow-slate-200/40 dark:shadow-black/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-center text-sky-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Stateful Redis Sessions</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Stateful & Revocable
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Sessions are stored in Redis with real-time revocation capabilities across devices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSessions}
                disabled={isLoadingSessions}
                className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
                title="Refresh sessions list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSessions ? 'animate-spin text-sky-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleRevokeAllOthers}
                disabled={isRevoking || sessions.length <= 1}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isRevoking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span>Revoke All Other Sessions</span>
              </button>
            </div>
          </div>

          {/* Session List */}
          <div className="space-y-2.5">
            {isLoadingSessions && sessions.length === 0 ? (
              <div className="space-y-2 py-2">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800/80 text-xs text-slate-500 dark:text-zinc-400 text-center">
                Current active session connected via Redis.
              </div>
            ) : (
              sessions.map((sess, idx) => {
                const isMobile = /mobile|android|iphone|ipad/i.test(sess.userAgent || '');
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                      sess.isCurrent
                        ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50'
                        : 'bg-white dark:bg-zinc-950/40 border-slate-200/70 dark:border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          sess.isCurrent
                            ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                        }`}
                      >
                        {isMobile ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 font-mono">
                            {sess.ip === '127.0.0.1' || sess.ip === '::1' ? 'Localhost (127.0.0.1)' : sess.ip}
                          </span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                              This Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-sm sm:max-w-md mt-0.5">
                          {sess.userAgent}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px] text-slate-500 dark:text-zinc-400 shrink-0 hidden sm:block">
                        <div>Logged in: {new Date(sess.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                          TTL: 7 days
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSingleSession(sess.id || sess.token)}
                          disabled={revokingSessionId === (sess.id || sess.token)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Log out this specific device"
                        >
                          {revokingSessionId === (sess.id || sess.token) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <LogOut className="w-3.5 h-3.5" />
                          )}
                          <span>Log Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>Stateful session architecture: Invalidation takes effect instantly without waiting for token expiry.</span>
          </div>
        </div>
      </div>
    );
};
