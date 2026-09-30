import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { AdminProfile } from '../types/admin';

interface AuthContextType {
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(() => {
    const cached = localStorage.getItem('quplo_admin_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const profile = await adminService.getMe();
      setAdmin(profile);
      localStorage.setItem('quplo_admin_user', JSON.stringify(profile));
    } catch {
      setAdmin(null);
      localStorage.removeItem('quplo_admin_token');
      localStorage.removeItem('quplo_admin_user');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('quplo_admin_token');
    if (token) {
      refreshProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      setAdmin(null);
    };

    window.addEventListener('admin_auth_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('admin_auth_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await adminService.login(identifier, password);
    localStorage.setItem('quplo_admin_token', res.token);
    localStorage.setItem('quplo_admin_user', JSON.stringify(res.admin));
    setAdmin(res.admin);
  };

  const logout = async () => {
    await adminService.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: Boolean(admin),
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
