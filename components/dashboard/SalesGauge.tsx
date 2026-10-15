'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Info } from 'lucide-react';
import { useMerchly } from '@/lib/store';

export function SalesGauge() {
  const { orders, workspace } = useMerchly();

  // Calculate actual revenue
  const totalRevenue = orders.reduce((acc, o) => (o.status !== 'cancelled' ? acc + o.total : acc), 0);
  const target = workspace.salesTargetMonthly || 10000;
  const percentage = Math.min(100, Math.round((totalRevenue / target) * 100)) || 85;
  const remaining = Math.max(0, 100 - percentage);

  // SVG Gauge calculations (Semi-circle from 180deg to 0deg)
  const radius = 100;
  const strokeWidth = 18;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#000000]">Sales Overview</h3>
        <button className="w-9 h-9 rounded-full border border-[#E2E2E2] flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-black/5 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Semi-circular Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg width="240" height="135" viewBox="0 0 240 135" className="overflow-visible">
          {/* Background Track (Muted Grey / Soft Red Tint) */}
          <path
            d="M 20 120 A 100 100 0 0 1 220 120"
            fill="none"
            stroke="#FEF1ED"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc (Primary Red #CE3627) */}
          <motion.path
            d="M 20 120 A 100 100 0 0 1 220 120"
            fill="none"
            stroke="#CE3627"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-[#000000]"
          >
            {percentage}%
          </motion.span>
          <span className="text-sm font-medium text-[#71717A] mt-0.5">Sales Growth</span>
        </div>
      </div>

      {/* Target Hint & Progress Breakdown */}
      <div className="mt-4 pt-4 border-t border-[#E2E2E2]/60">
        <div className="flex items-center gap-1.5 text-xs text-[#71717A] mb-3">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#CE3627]" />
          <span>You&apos;re {remaining}% away from your monthly sales goal!</span>
        </div>

        {/* Segmented bar: Net Profit vs Gross Revenue vs Target */}
        <div className="w-full h-2.5 rounded-full bg-[#E2E2E2] flex overflow-hidden mb-3">
          <div className="h-full bg-[#CE3627] w-[45%]" title="Net Profit (45%)" />
          <div className="h-full bg-[#FF7A6B] w-[40%]" title="Gross Revenue (40%)" />
          <div className="h-full bg-[#E2E2E2] w-[15%]" title="Remaining Target (15%)" />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs font-medium text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CE3627]" />
            <span>Net Profit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A6B]" />
            <span>Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E2]" />
            <span>Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
