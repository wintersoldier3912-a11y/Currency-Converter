import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendPoint, CurrencyCode } from '../types';

interface TrendChartProps {
  data: TrendPoint[];
  from: CurrencyCode;
  to: CurrencyCode;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, from, to }) => {
  return (
    <div className="w-full h-64 bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm mt-6">
      <h3 className="text-slate-400 text-sm font-medium mb-4">
        7 Day Trend ({from} to {to})
      </h3>
      <div className="w-full h-48 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8" 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              hide={true} 
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#475569',
                color: '#f1f5f9',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#60a5fa' }}
              formatter={(value: number) => [value.toFixed(4), 'Rate']}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
