import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface UserGrowthChartProps {
  data: Array<{
    date: string;
    newUsers: number;
  }>;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-400 dark:text-zinc-500 text-sm">
        No registration activity recorded
      </div>
    );
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="newUsers"
            name="New Users"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 3, fill: '#0ea5e9' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
