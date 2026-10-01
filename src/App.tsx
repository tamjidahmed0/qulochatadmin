import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { AdminLayout } from './components/Layout/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Broadcast } from './pages/Broadcast';
import { Users } from './pages/Users';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';
import { Toaster } from 'sonner';

const ThemedToaster: React.FC = () => {
  const { theme } = useTheme();
  return <Toaster position="top-right" theme={theme} richColors closeButton />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemedToaster />
          <Routes>
            {/* Public Routes (Admin Login only) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/broadcast" element={<Broadcast />} />
                <Route path="/users" element={<Users />} />
                <Route path="/system" element={<SystemHealth />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
