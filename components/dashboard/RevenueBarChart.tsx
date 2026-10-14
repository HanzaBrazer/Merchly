'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

const weeklyData = [
  { day: 'Sun', thisWeek: 28000, lastWeek: 34000 },
  { day: 'Mon', thisWeek: 32000, lastWeek: 38000 },
  { day: 'Tue', thisWeek: 35000, lastWeek: 26000 },
  { day: 'Wed', thisWeek: 22000, lastWeek: 18000 },
  { day: 'Thu', thisWeek: 23000, lastWeek: 20000 },
  { day: 'Fri', thisWeek: 31000, lastWeek: 35000 },
  { day: 'Sat', thisWeek: 36000, lastWeek: 39000 },
];

export function RevenueBarChart() {
  const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1D4840] text-white p-3 rounded-2xl shadow-xl border border-[#97DF68]/30 text-xs">
          <p className="font-semibold mb-1 text-[#97DF68]">{label}</p>
          <p className="flex items-center justify-between gap-4">
            <span className="text-gray-300">This period:</span>
            <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="flex items-center justify-between gap-4 mt-0.5">
            <span className="text-gray-400">Last period:</span>
            <span className="font-medium">${payload[1].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-[#000000]">Revenue Insights</h3>
        <button
          onClick={() => setTimeRange(timeRange === 'Weekly' ? 'Monthly' : 'Weekly')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2E2E2] text-xs font-medium text-[#000000] hover:bg-[#F6F6F6] transition-colors"
        >
          <span>{timeRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
        </button>
      </div>

      {/* Big Number & Legend */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#000000]">
            $7,790.00
          </span>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E7F4E9] text-[#0E8F21]">
            <ArrowUpRight className="w-3 h-3" />
            7%
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#97DF68]" />
            <span>This week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E2]" />
            <span>Last week</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717A', fontSize: 11 }}
              tickFormatter={(v) => `${v / 1000}k`}
              domain={[0, 40000]}
              ticks={[0, 10000, 20000, 30000, 40000]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="thisWeek" fill="#97DF68" radius={[12, 12, 0, 0]} maxBarSize={32} />
            <Bar dataKey="lastWeek" fill="#E8EDEC" radius={[12, 12, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
