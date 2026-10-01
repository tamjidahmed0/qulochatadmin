import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Loader2, KeyRound, Sun, Moon } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide both admin username/email and password.');
      return;
    }

    if (lockoutSeconds > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      await login(identifier.trim(), password);
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify your credentials.';
      setError(msg);

      if (err.statusCode === 429 && err.retryAfter) {
        setLockoutSeconds(Number(err.retryAfter) || 900);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden select-none transition-colors duration-200">
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 shadow-sm transition-all cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.25]" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 stroke-[2.25]" />
          )}
        </button>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 object-contain drop-shadow-md select-none pointer-events-none"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 flex items-center justify-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-sky-500" />
            <span>Master Console • Restricted Access Only</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#09090b] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/50 backdrop-blur-xl transition-colors duration-200">
          {/* Rate Limit Warning Alert */}
          {lockoutSeconds > 0 ? (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 dark:text-rose-300">
                <p className="font-semibold text-rose-800 dark:text-rose-200">Security Rate-Limit Triggered</p>
                <p className="mt-0.5">
                  Too many invalid attempts. Access locked for{' '}
                  <span className="font-mono font-bold text-rose-900 dark:text-white text-sm bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-500/30">
                    {formatLockoutTime(lockoutSeconds)}
                  </span>
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 tracking-wide">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  disabled={isLoading || lockoutSeconds > 0}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin or admin@quplochat.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 tracking-wide">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  disabled={isLoading || lockoutSeconds > 0}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition outline-none disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-semibold text-sm transition shadow-sm shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <span>Locked ({formatLockoutTime(lockoutSeconds)})</span>
              ) : (
                <span>Sign In to Admin Console</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/80 text-center">
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Protected by Redis IP Rate Limiting & TLS Encryption</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
