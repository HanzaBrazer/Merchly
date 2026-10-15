import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between hover:border-[#CE3627]/30 transition-colors">
      {/* Top Row: Icon + Title + Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#CE3627]">
            {icon}
          </div>
          <span className="text-sm font-medium text-[#71717A]">{title}</span>
        </div>
        {infoTooltip && (
          <button
            title={infoTooltip}
            className="text-[#A0A0A0] hover:text-[#000000] p-1 rounded-full transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-1">
        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#000000]">
          {value}
        </span>
      </div>

      {/* Footer Comparison */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#71717A]">
        <span>Last week:</span>
        <span className="font-medium text-[#000000]">{lastWeekValue}</span>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ml-auto',
            isPositive
              ? 'bg-[#E7F4E9] text-[#0E8F21]'
              : 'bg-[#FFE6E7] text-[#FF0013]'
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(trendPercentage)}%
        </span>
      </div>
    </div>
  );
}
