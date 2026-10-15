import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  lastWeekValue: string | number;
  trendPercentage: number;
  icon: React.ReactNode;
  infoTooltip?: string;
  isPositive?: boolean;
}

export function MetricCard({
  title,
  value,
  lastWeekValue,
  trendPercentage,
  icon,
  infoTooltip,
  isPositive = trendPercentage >= 0,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between hover:border-[#CE3627]/30 transition-all select-none">
      {/* Top Row: Icon + Title + Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#000000]">
            {icon}
          </div>
          <span className="text-base font-normal text-[#000000]">{title}</span>
        </div>
        <button
          type="button"
          title={infoTooltip || title}
          className="text-[#A0A0A0] hover:text-[#000000] transition-colors p-1"
        >
          <Info className="w-5 h-5 text-[#A0A0A0]" />
        </button>
      </div>

      {/* Main Metric Value */}
      <div className="mb-4">
        <span className="text-[40px] font-medium tracking-tight text-[#000000] leading-none">
          {value}
        </span>
      </div>

      {/* Bottom Insight Row */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#A0A0A0] font-normal">Last week:</span>
        <span className="font-medium text-[#000000]">{lastWeekValue}</span>
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
            isPositive
              ? 'bg-[#E7F4E9] text-[#0E8F21]'
              : 'bg-[#FFE6E7] text-[#FF0013]'
          }`}
        >
          {isPositive ? (
            <ArrowUp className="w-3.5 h-3.5 text-[#0E8F21]" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-[#FF0013]" />
          )}
          <span>{Math.abs(trendPercentage)}%</span>
        </span>
      </div>
    </div>
  );
}
