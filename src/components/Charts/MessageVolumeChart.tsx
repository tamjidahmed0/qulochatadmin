import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface MessageVolumeChartProps {
  data: Array<{
    date: string;
    messages: number;
    visitorMessages: number;
    agentMessages: number;
    botMessages: number;
  }>;
}

export const MessageVolumeChart: React.FC<MessageVolumeChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 dark:text-zinc-500 text-sm">
        No message activity recorded for this period
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="agentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="botGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
          <XAxis dataKey="date" stroke={isDark ? '#71717a' : '#94a3b8'} tick={{ fontSize: 11 }} />
          <YAxis stroke={isDark ? '#71717a' : '#94a3b8'} tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#09090b' : '#ffffff',
              borderColor: isDark ? '#27272a' : '#e2e8f0',
              borderRadius: '10px',
              fontSize: '12px',
              color: isDark ? '#f4f4f5' : '#0f172a',
              boxShadow: isDark
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            }}
            labelStyle={{ color: isDark ? '#a1a1aa' : '#64748b', fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(val) => (
              <span className="text-slate-700 dark:text-zinc-300 font-medium">{val}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="visitorMessages"
            name="Visitors"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#visitorGrad)"
          />
          <Area
            type="monotone"
            dataKey="agentMessages"
            name="Agents"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#agentGrad)"
          />
          <Area
            type="monotone"
            dataKey="botMessages"
            name="AI Bot"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#botGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
