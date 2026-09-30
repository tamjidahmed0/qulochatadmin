export interface AdminProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface KPIValue {
  value: number;
  active?: number;
  inactive?: number;
  periodCount?: number;
  trend?: string;
  trendUp?: boolean;
}

export interface AnalyticsOverview {
  kpis: {
    totalUsers: KPIValue;
    totalMessages: KPIValue;
    totalConversations: {
      value: number;
      active: number;
      pending: number;
      closed: number;
    };
    satisfaction: {
      score: number;
      totalRatings: number;
      breakdown: {
        AWESOME: number;
        OKAY: number;
        BAD: number;
      };
    };
    assets: {
      totalWidgets: number;
      totalVisitors: number;
      blockedVisitors: number;
      totalBrains: number;
    };
  };
  breakdowns: {
    plans: Array<{ name: string; value: number; color: string }>;
    roles: Array<{ name: string; value: number; color: string }>;
    authMethods: Array<{ name: string; value: number; color: string }>;
    senders: Array<{ name: string; count: number; color: string }>;
    channels: Array<{ name: string; count: number; color: string }>;
  };
  timeline: Array<{
    date: string;
    messages: number;
    visitorMessages: number;
    agentMessages: number;
    botMessages: number;
    newUsers: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
    authMethod: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';
  isActive: boolean;
  authMethod: 'CREDENTIALS' | 'GOOGLE';
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  ownerId?: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  stats: {
    widgetsCount: number;
    conversationsCount: number;
    messagesCount: number;
    agentsCount: number;
  };
}

export interface BroadcastItem {
  id: string;
  type: 'OFFICIAL_CHAT' | 'PUSH_NOTIFICATION';
  title?: string;
  message: string;
  fileUrl?: string | null;
  fileName?: string | null;
  data?: Record<string, any>;
  createdAt: string;
}

export interface SystemHealthData {
  status: 'operational' | 'degraded' | 'critical';
  timestamp: string;
  services: {
    database: {
      name: string;
      status: string;
      latencyMs: number;
      error?: string | null;
    };
    redis: {
      name: string;
      status: string;
      latencyMs: number;
      error?: string | null;
    };
  };
  memory: {
    rssMB: number;
    heapTotalMB: number;
    heapUsedMB: number;
    externalMB: number;
    heapUsagePercent: number;
  };
  process: {
    nodeVersion: string;
    pid: number;
    uptimeSeconds: number;
    uptimeFormatted: string;
    env: string;
  };
  os: {
    platform: string;
    release: string;
    arch: string;
    cpus: number;
    freeMemoryMB: number;
    totalMemoryMB: number;
    systemUptimeHours: number;
  };
  integrations: Record<string, { name: string; configured: boolean }>;
}
