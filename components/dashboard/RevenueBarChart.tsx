'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';

interface BarDataPoint {
  label: string;
  thisPeriod: number; // in thousands (e.g. 28 = 28k)
  lastPeriod: number; // in thousands (e.g. 32 = 32k)
  isHighlight?: boolean;
}

const weeklyData: BarDataPoint[] = [
  { label: 'Sun', thisPeriod: 28, lastPeriod: 32 },
  { label: 'Mon', thisPeriod: 30, lastPeriod: 40 },
  { label: 'Tue', thisPeriod: 26, lastPeriod: 34, isHighlight: true }, // Highlighted in dark brown #4A1512
  { label: 'Wed', thisPeriod: 22, lastPeriod: 22 },
  { label: 'Thu', thisPeriod: 22, lastPeriod: 22 },
  { label: 'Fri', thisPeriod: 24, lastPeriod: 31 },
  { label: 'Sat', thisPeriod: 29, lastPeriod: 34 },
];

const monthlyData: BarDataPoint[] = [
  { label: 'May', thisPeriod: 25, lastPeriod: 30 },
  { label: 'Jun', thisPeriod: 32, lastPeriod: 38 },
  { label: 'Jul', thisPeriod: 36, lastPeriod: 28, isHighlight: true },
  { label: 'Aug', thisPeriod: 20, lastPeriod: 24 },
  { label: 'Sep', thisPeriod: 24, lastPeriod: 22 },
  { label: 'Oct', thisPeriod: 33, lastPeriod: 39 },
  { label: 'Nov', thisPeriod: 28, lastPeriod: 35 },
];

export function RevenueBarChart() {
  const [timeframe, setTimeframe] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = timeframe === 'Weekly' ? weeklyData : monthlyData;
  const currentTotal = timeframe === 'Weekly' ? '$7,790.00' : '$32,450.00';
  const currentTrend = timeframe === 'Weekly' ? '7%' : '14%';

  // SVG Chart Dimensions
  const yTicks = [40, 30, 20, 10, 0];
  const chartHeight = 180;
  const maxVal = 40;

  // Converts value (0 to 40) to Y coordinate (0 = bottom, 40 = top)
  const getY = (val: number) => {
    return chartHeight - (val / maxVal) * chartHeight;
  };

  return (
    <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between h-full relative">
      {/* Top Header Row: Title & Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-normal text-[#000000]">Revenue Insights</h3>

        {/* Dropdown Pill Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-11 px-5 rounded-full border border-[#E8E8E8] bg-white text-base text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 shadow-xs cursor-pointer select-none"
          >
            <span>{timeframe}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#000000] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl border border-[#E8E8E8] shadow-lg py-1.5 z-20">
              <button
                type="button"
                onClick={() => {
                  setTimeframe('Weekly');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  timeframe === 'Weekly'
                    ? 'font-semibold text-[#CE3627] bg-[#FEF1ED]'
                    : 'text-[#000000] hover:bg-[#F6F6F6]'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimeframe('Monthly');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  timeframe === 'Monthly'
                    ? 'font-semibold text-[#CE3627] bg-[#FEF1ED]'
                    : 'text-[#000000] hover:bg-[#F6F6F6]'
                }`}
              >
                Monthly
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Value & Legend Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 my-2">
        {/* Big Amount + Green Badge */}
        <div className="flex items-center gap-2.5">
          <span className="text-[38px] sm:text-[40px] font-medium tracking-tight text-[#000000] leading-none">
            {currentTotal}
          </span>
          <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-sm font-medium bg-[#E7F4E9] text-[#0E8F21]">
            <ArrowUp className="w-3.5 h-3.5 text-[#0E8F21]" />
            {currentTrend}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-sm font-normal text-[#000000]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CE3627]" />
            <span>{timeframe === 'Weekly' ? 'This week' : 'This month'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D3D3D3]" />
            <span>{timeframe === 'Weekly' ? 'Last week' : 'Last month'}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Bar Chart */}
      <div className="w-full relative mt-4 select-none">
        <svg
          viewBox="0 0 650 240"
          className="w-full h-auto overflow-visible"
        >
          {/* Diagonal Hatch Pattern Definition */}
          <defs>
            <pattern
              id="diagonalHatch"
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="#F4F4F4" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="#D3D3D3"
                strokeWidth="2"
              />
            </pattern>
          </defs>

          {/* Y-Axis Grid Lines & Labels */}
          {yTicks.map((tick) => {
            const y = getY(tick) + 15; // 15px top margin
            return (
              <g key={tick}>
                <text
                  x="0"
                  y={y + 4}
                  fill="#A0A0A0"
                  fontSize="14"
                  fontWeight="400"
                  fontFamily="Geist, sans-serif"
                >
                  {tick}k
                </text>
                <line
                  x1="45"
                  y1={y}
                  x2="650"
                  y2={y}
                  stroke="#E8E8E8"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              </g>
            );
          })}

          {/* 7 Columns: Composite Pill Bars */}
          {activeData.map((d, index) => {
            // Distribute 7 columns across width from x=75 to x=580
            const colWidth = 44;
            const startX = 75;
            const gap = (610 - startX - colWidth) / (activeData.length - 1);
            const x = startX + index * gap;

            const topY = 15;
            const baseY = topY + chartHeight;

            // Heights
            const hLast = (d.lastPeriod / maxVal) * chartHeight;
            const yLast = baseY - hLast;

            const hThis = (d.thisPeriod / maxVal) * chartHeight;
            const yThis = baseY - hThis;

            const isDark = d.isHighlight;
            const fillColor = isDark ? '#4A1512' : '#CE3627';

            return (
              <g
                key={d.label}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background "Last period" bar with diagonal hatch pattern (only if higher or equal) */}
                {d.lastPeriod > d.thisPeriod && (
                  <rect
                    x={x}
                    y={yLast}
                    width={colWidth}
                    height={hLast}
                    rx={colWidth / 2}
                    fill="url(#diagonalHatch)"
                  />
                )}

                {/* Foreground "This period" bar with solid color */}
                <rect
                  x={x}
                  y={yThis}
                  width={colWidth}
                  height={hThis}
                  rx={colWidth / 2}
                  fill={fillColor}
                  className="transition-all duration-300"
                />

                {/* X-Axis Day / Month Label */}
                <text
                  x={x + colWidth / 2}
                  y={baseY + 24}
                  fill="#A0A0A0"
                  fontSize="14"
                  fontWeight="400"
                  textAnchor="middle"
                  fontFamily="Geist, sans-serif"
                >
                  {d.label}
                </text>

                {/* Hover Tooltip */}
                {hoveredIndex === index && (
                  <g pointerEvents="none">
                    <rect
                      x={x + colWidth / 2 - 50}
                      y={Math.min(yThis, yLast) - 44}
                      width="100"
                      height="36"
                      rx="8"
                      fill="#000000"
                      opacity="0.9"
                    />
                    <text
                      x={x + colWidth / 2}
                      y={Math.min(yThis, yLast) - 26}
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {timeframe === 'Weekly' ? 'This week' : 'This mo'}: ${d.thisPeriod}k
                    </text>
                    <text
                      x={x + colWidth / 2}
                      y={Math.min(yThis, yLast) - 13}
                      fill="#D3D3D3"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {timeframe === 'Weekly' ? 'Last week' : 'Last mo'}: ${d.lastPeriod}k
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
