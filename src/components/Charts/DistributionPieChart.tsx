import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface DistributionPieChartProps {
  data: DistributionItem[];
  title?: string;
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-slate-500 text-sm">
        <span>No distribution data available</span>
      </div>
    );
  }

  return (
    <div className="h-60 w-full relative">
      {title && (
        <div className="absolute top-0 left-0 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [
              `${value} (${Math.round(((value as number) / total) * 100)}%)`,
              'Count',
            ]}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(val) => <span className="text-slate-300 text-xs font-medium">{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
