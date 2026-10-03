import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    if (lockoutSeconds > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password.';
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col justify-center items-center p-4 relative selection:bg-sky-500/20 selection:text-sky-600 transition-colors duration-200">
      <div className="w-full max-w-sm">
        {/* Brand Header: Logo + Service Name */}
        <div className="flex items-center justify-center gap-2.5 mb-6 select-none">
          <img
            src="/logo.png"
            alt="Qulochat"
            className="w-9 h-9 object-contain drop-shadow-xs pointer-events-none"
          />
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-zinc-50">
            Qulochat
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
              Sign in
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Rate Limit Alert */}
          {lockoutSeconds > 0 ? (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-200">
                  Too many failed attempts
                </p>
                <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/90">
                  Please wait{' '}
                  <span className="font-mono font-semibold">
                    {formatLockoutTime(lockoutSeconds)}
                  </span>{' '}
                  before trying again.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                disabled={isLoading || lockoutSeconds > 0}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quplochat.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 transition outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  disabled={isLoading || lockoutSeconds > 0}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 transition outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <span>Locked ({formatLockoutTime(lockoutSeconds)})</span>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>

        {/* Minimal Footer */}
        <p className="text-center text-[11px] text-slate-400 dark:text-zinc-600 mt-6 select-none">
          © {new Date().getFullYear()} Qulochat. All rights reserved.
        </p>
      </div>
    </div>
  );
};
