import { api } from './api';
import type {
  AdminProfile,
  AnalyticsOverview,
  UserItem,
  BroadcastItem,
  SystemHealthData,
} from '../types/admin';

export const adminService = {
  // ── Authentication ──
  async login(identifier: string, password: string): Promise<{ token: string; admin: AdminProfile }> {
    return api.post('/admin/auth/login', { identifier, password });
  },

  async getMe(): Promise<AdminProfile> {
    return api.get<AdminProfile>('/admin/auth/me');
  },

  async updateCredentials(data: {
    name?: string;
    email?: string;
    username?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string; admin: AdminProfile }> {
    return api.patch('/admin/auth/credentials', data);
  },

  async logout(): Promise<void> {
    try {
      await api.post('/admin/auth/logout');
    } catch {
      // Ignore if offline
    } finally {
      localStorage.removeItem('quplo_admin_token');
      localStorage.removeItem('quplo_admin_user');
    }
  },

  async getSessions(): Promise<
    Array<{
      id: string;
      token: string;
      maskedToken?: string;
      isCurrent: boolean;
      ip: string;
      userAgent: string;
      createdAt: string;
      lastActiveAt: string;
    }>
  > {
    return api.get('/admin/auth/sessions');
  },

  async revokeSession(sessionId: string): Promise<{ success: boolean; message: string; isCurrent?: boolean }> {
    return api.delete(`/admin/auth/sessions/${sessionId}`);
  },

  async revokeAllOtherSessions(): Promise<{ success: boolean; message: string; revokedCount: number }> {
    return api.post('/admin/auth/revoke-all');
  },

  // ── Analytics ──
  async getAnalyticsOverview(range: string = '30d'): Promise<AnalyticsOverview> {
    return api.get<AnalyticsOverview>('/admin/analytics/overview', { range });
  },

  // ── User Management ──
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    plan?: string;
    status?: string;
  }): Promise<{ users: UserItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    return api.get('/admin/users', params);
  },

  async getUserById(id: string): Promise<any> {
    return api.get(`/admin/users/${id}`);
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<any> {
    return api.patch(`/admin/users/${id}/status`, { isActive });
  },

  async updateUserPlan(id: string, plan: string): Promise<any> {
    return api.patch(`/admin/users/${id}/plan`, { plan });
  },

  async deleteUser(id: string): Promise<any> {
    return api.delete(`/admin/users/${id}`);
  },

  // ── Broadcast & Announcements ──
  async broadcastChatAnnouncement(data: {
    title?: string;
    message: string;
    bannerUrl?: string;
    fileUrl?: string;
  }): Promise<any> {
    return api.post('/admin/broadcast/chat', data);
  },

  async broadcastPushNotification(data: {
    title: string;
    body: string;
    actionUrl?: string;
    data?: Record<string, any>;
  }): Promise<any> {
    return api.post('/admin/broadcast/push', data);
  },

  async getBroadcastHistory(): Promise<BroadcastItem[]> {
    return api.get<BroadcastItem[]>('/admin/broadcast/history');
  },

  // ── System Health ──
  async getSystemHealth(): Promise<SystemHealthData> {
    return api.get<SystemHealthData>('/admin/system/health');
  },
};
