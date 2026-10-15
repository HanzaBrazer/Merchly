'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Filter, Calendar, CheckCircle2, RotateCcw } from 'lucide-react';

export interface DashboardFilterState {
  timePeriod: 'all' | 'today' | 'week' | 'month' | 'year';
  status: 'all' | 'shipped' | 'pending' | 'cancelled';
  channel: 'all' | 'online' | 'marketplace' | 'pos';
}

interface DashboardFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DashboardFilterState;
  onApplyFilters: (filters: DashboardFilterState) => void;
  onResetFilters: () => void;
}

export function DashboardFilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: DashboardFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<DashboardFilterState>(filters);

  // Sync when opening
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const periods: { id: DashboardFilterState['timePeriod']; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ];

  const statuses: { id: DashboardFilterState['status']; label: string }[] = [
    { id: 'all', label: 'All Statuses' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Canceled' },
  ];

  const channels: { id: DashboardFilterState['channel']; label: string }[] = [
    { id: 'all', label: 'All Channels' },
    { id: 'online', label: 'Online Store' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'pos', label: 'POS Terminal' },
  ];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: DashboardFilterState = {
      timePeriod: 'all',
      status: 'all',
      channel: 'all',
    };
    setLocalFilters(defaultFilters);
    onResetFilters();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Dashboard Overview"
      description="Select date range, transaction status, or sales channel to filter dashboard metrics."
      size="md"
    >
      <div className="space-y-5 my-4">
        {/* Time Period Filter */}
        <div>
          <label className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#CE3627]" />
            <span>Time Period</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {periods.map((p) => {
              const isSelected = localFilters.timePeriod === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, timePeriod: p.id }))
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#CE3627] text-white shadow-xs font-semibold'
                      : 'bg-[#F6F6F6] text-[#000000] hover:bg-[#EAEAEA] border border-[#E2E2E2]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Status Filter */}
        <div>
          <label className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#CE3627]" />
            <span>Transaction Status</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const isSelected = localFilters.status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, status: s.id }))
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#CE3627] text-white shadow-xs font-semibold'
                      : 'bg-[#F6F6F6] text-[#000000] hover:bg-[#EAEAEA] border border-[#E2E2E2]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#CE3627]" />
            <span>Sales Channel</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {channels.map((c) => {
              const isSelected = localFilters.channel === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, channel: c.id }))
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#CE3627] text-white shadow-xs font-semibold'
                      : 'bg-[#F6F6F6] text-[#000000] hover:bg-[#EAEAEA] border border-[#E2E2E2]'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-between gap-3 mt-4">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-[#71717A] hover:text-[#000000] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs px-4"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            className="rounded-full text-xs px-6 font-semibold"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
