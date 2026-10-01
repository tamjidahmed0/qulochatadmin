import React, { useState } from 'react';
import { KeyRound, Lock, User, Mail, Save, Loader2, Sun, Moon } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUpdateAdminCredentials } from '../hooks';
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
      </div>
    );
};
