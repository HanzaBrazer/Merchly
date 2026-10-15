'use client';

import React from 'react';
import { ArrowRight, Info } from 'lucide-react';

export function SalesGauge() {
  // 28 segmented radial ticks spanning from 184deg to -4deg (180deg semicircle arch)
  // First 7: Net Profit (#4A1512)
  // Next 17: Gross Revenue (#CE3627)
  // Remaining 4: Target (#E8E8E8)
  const totalTicks = 28;
  const netProfitTicks = 7;
  const grossRevenueTicks = 17;

  // Geometry calculations
  const cx = 175;
  const cy = 170;
  const rInner = 92;
  const rOuter = 142;

  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    // Distribute from 182 degrees (bottom left) to -2 degrees (bottom right)
    const angleDeg = 182 - (i * 184) / (totalTicks - 1);
    const angleRad = (angleDeg * Math.PI) / 180;

    const x1 = cx + rInner * Math.cos(angleRad);
    const y1 = cy - rInner * Math.sin(angleRad);
    const x2 = cx + rOuter * Math.cos(angleRad);
    const y2 = cy - rOuter * Math.sin(angleRad);

    let color = '#E8E8E8'; // Target
    if (i < netProfitTicks) {
      color = '#4A1512'; // Net Profit (dark brown)
    } else if (i < netProfitTicks + grossRevenueTicks) {
      color = '#CE3627'; // Gross Revenue (primary red)
    }

    return { id: i, x1, y1, x2, y2, color };
  });

  return (
    <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-normal text-[#000000]">Sales Overview</h3>
        <button
          type="button"
          aria-label="View sales overview details"
          className="w-11 h-11 rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center text-[#000000] hover:bg-[#F6F6F6] transition-colors shadow-xs cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 text-[#000000]" />
        </button>
      </div>

      {/* Radial Segmented Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg
          viewBox="0 0 350 195"
          className="w-full max-w-[340px] h-auto overflow-visible select-none"
        >
          {ticks.map((tick) => (
            <line
              key={tick.id}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.color}
              strokeWidth={11}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute bottom-2 flex flex-col items-center pointer-events-none">
          <span className="text-[46px] font-medium tracking-tight text-[#000000] leading-none">
            85%
          </span>
          <span className="text-base font-normal text-[#A0A0A0] mt-1.5">
            Sales Growth
          </span>
        </div>
      </div>

      {/* Bottom Information & Legend */}
      <div className="space-y-3 pt-2">
        {/* Info message */}
        <div className="flex items-center justify-center gap-2 text-sm text-[#A0A0A0]">
          <Info className="w-4 h-4 shrink-0 text-[#A0A0A0]" />
          <span>You’re 15% away from your monthly sales goal!</span>
        </div>

        {/* Segmented bar: Net Profit + Gross Revenue + Target (Hatched) */}
        <div className="w-full h-3 rounded-full flex items-center gap-1 overflow-hidden select-none">
          {/* Net Profit segment */}
          <div
            className="h-full rounded-l-full bg-[#4A1512]"
            style={{ width: '25%' }}
            title="Net Profit (25%)"
          />
          {/* Gross Revenue segment */}
          <div
            className="h-full bg-[#CE3627]"
            style={{ width: '60%' }}
            title="Gross Revenue (60%)"
          />
          {/* Target segment with diagonal hatched pattern */}
          <div
            className="h-full rounded-r-full relative overflow-hidden"
            style={{
              width: '15%',
              backgroundColor: '#F6F6F6',
              backgroundImage:
                'repeating-linear-gradient(45deg, #D3D3D3, #D3D3D3 2px, transparent 2px, transparent 6px)',
            }}
            title="Target (15%)"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm text-[#000000] pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A1512]" />
            <span className="font-normal">Net Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CE3627]" />
            <span className="font-normal">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E2]" />
            <span className="font-normal">Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
