'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';

export function AiInsightCard() {
  const { workspace, setIsUpgradeModalOpen, products } = useMerchly();

  const lowStockCount = products.filter((p) => p.stockStatus === 'low_stock').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'out_of_stock').length;

  const handleAction = () => {
    if (workspace.plan === 'FREE') {
      toast.info('AI Predictive Stock Recommendations require Pro tier.');
      setIsUpgradeModalOpen(true);
    } else {
      toast.success(
        `AI Analysis: Recommend reordering ${lowStockCount + outOfStockCount} items today to avoid stockouts next week!`
      );
    }
  };

  return (
    <div className="bg-[#FEF1ED] rounded-3xl p-5 sm:p-6 border border-[#F7D7D1] shadow-sm flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#CE3627]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#CE3627] tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#CE3627]" />
            <span>AI Insight</span>
          </div>
          <h4 className="text-sm font-semibold text-[#4A1512]">
            Your AI-powered insights are ready!
          </h4>
        </div>
        <button
          onClick={handleAction}
          className="w-10 h-10 rounded-full bg-[#CE3627] hover:bg-[#B72E20] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 shrink-0"
          title="View AI details"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 text-xs sm:text-sm font-medium text-[#4A1512]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0E8F21] shrink-0" />
          <span>Stock up 6% in 7 days</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0E8F21] shrink-0" />
          <span>Sales up 9% vs last week</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0E8F21] shrink-0" />
          <span>
            {lowStockCount > 0
              ? `${lowStockCount} items need replenishment`
              : '12 new items added'}
          </span>
        </div>
      </div>
    </div>
  );
}
