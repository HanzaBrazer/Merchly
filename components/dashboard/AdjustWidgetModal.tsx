'use client';

import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, Eye, EyeOff, Check, Plus } from 'lucide-react';

interface AdjustWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetVisibility: {
    metrics: boolean;
    salesGauge: boolean;
    revenueChart: boolean;
    recentSales: boolean;
  };
  onToggleWidget: (key: keyof AdjustWidgetModalProps['widgetVisibility']) => void;
  onOpenNewOrder: () => void;
}

export function AdjustWidgetModal({
  isOpen,
  onClose,
  widgetVisibility,
  onToggleWidget,
  onOpenNewOrder,
}: AdjustWidgetModalProps) {
  const widgets = [
    {
      key: 'metrics' as const,
      label: 'Summary Metrics (KPI Cards)',
      description: 'Total Sales, Total Customers, Total Revenue, and Total Products',
    },
    {
      key: 'salesGauge' as const,
      label: 'Sales Overview Gauge',
      description: 'Radial segmented meter showing 85% Sales Growth & breakdown',
    },
    {
      key: 'revenueChart' as const,
      label: 'Revenue Insights Bar Chart',
      description: 'Composite pill bar chart with Weekly and Monthly revenue comparisons',
    },
    {
      key: 'recentSales' as const,
      label: 'Recent Sales Table',
      description: 'Real-time order transactions table with category and status filters',
    },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Dashboard Widgets"
      description="Customize the visibility and layout of widgets on your Merchly dashboard."
      size="sm"
    >
      <div className="space-y-3 my-4">
        {widgets.map((w) => {
          const isVisible = widgetVisibility[w.key];
          return (
            <div
              key={w.key}
              onClick={() => onToggleWidget(w.key)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isVisible
                  ? 'border-[#CE3627]/30 bg-[#FEF1ED]/30'
                  : 'border-[#E8E8E8] bg-[#F6F6F6] opacity-60'
              }`}
            >
              <div className="pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#000000]">{w.label}</span>
                  {isVisible && <Check className="w-4 h-4 text-[#CE3627]" />}
                </div>
                <p className="text-xs text-[#71717A] mt-0.5">{w.description}</p>
              </div>
              <button
                type="button"
                className={`p-2 rounded-full border transition-colors ${
                  isVisible
                    ? 'border-[#CE3627]/40 bg-white text-[#CE3627]'
                    : 'border-[#E8E8E8] bg-white text-[#A0A0A0]'
                }`}
                aria-label={`Toggle ${w.label}`}
              >
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onClose();
            onOpenNewOrder();
          }}
          className="rounded-full text-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#CE3627]" />
          <span>+ New Order</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onClose}
          className="rounded-full px-6 text-xs"
        >
          Apply Changes
        </Button>
      </div>
    </Dialog>
  );
}
