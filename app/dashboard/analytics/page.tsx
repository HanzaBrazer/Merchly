'use client';

import React from 'react';
import {
  Lock,
  Sparkles,
  Download,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { canAccess } from '@/lib/permissions';
import { toast } from 'sonner';

const monthlyTrend = [
  { month: 'May', revenue: 12400, profit: 5400 },
  { month: 'Jun', revenue: 15800, profit: 7100 },
  { month: 'Jul', revenue: 18900, profit: 8900 },
  { month: 'Aug', revenue: 22100, profit: 10200 },
  { month: 'Sep', revenue: 26400, profit: 12800 },
  { month: 'Oct', revenue: 31200, profit: 15400 },
];

const categoryShare = [
  { name: 'Chairs', value: 35, color: '#1D4840' },
  { name: 'Sofas', value: 28, color: '#97DF68' },
  { name: 'Tables', value: 22, color: '#E8EDEC' },
  { name: 'Beds', value: 15, color: '#D3D3D3' },
];

export default function AnalyticsPage() {
  const { workspace, setIsUpgradeModalOpen } = useMerchly();

  const isUnlocked = canAccess(workspace.plan, 'advanced_analytics');

  const handleExport = () => {
    toast.success('Sales report exported to Merchly_Analytics_Q4.csv');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Advanced Analytics
            </h1>
            <p className="text-sm text-[#71717A] mt-1">
              Deep dive into profit margins, sales velocity, and category performance.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            disabled={!isUnlocked}
            onClick={handleExport}
            className="text-xs sm:text-sm font-semibold"
          >
            <Download className="w-4 h-4 text-[#71717A]" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Content Container (With Paywall Overlay for Free users as required by PRD & DESIGN.md) */}
        <div className="relative">
          {/* Paywall Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/70 rounded-3xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#97DF68]">
              <div className="w-16 h-16 rounded-3xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center mb-4 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-[#000000] mb-2">
                Available on Merchly Pro
              </h2>
              <p className="text-sm text-[#71717A] max-w-md mb-6 leading-relaxed">
                Unlock multi-month revenue forecasting, category margin breakdowns, customer cohort
                retention, and automated CSV export.
              </p>

              <Button
                variant="mint"
                size="lg"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="text-sm font-bold shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Upgrade to Pro ($19/mo)
              </Button>
            </div>
          )}

          {/* Actual Analytics Content */}
          <div className="space-y-6 select-none">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
                <span className="text-xs text-[#71717A] font-medium block mb-1">
                  Average Order Value (AOV)
                </span>
                <span className="text-3xl font-bold text-[#000000]">$218.40</span>
                <span className="text-xs text-[#0E8F21] font-semibold block mt-1">
                  ↑ 12% vs last month
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
                <span className="text-xs text-[#71717A] font-medium block mb-1">
                  Gross Profit Margin
                </span>
                <span className="text-3xl font-bold text-[#000000]">54.2%</span>
                <span className="text-xs text-[#0E8F21] font-semibold block mt-1">
                  Healthy retail margin
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
                <span className="text-xs text-[#71717A] font-medium block mb-1">
                  Customer Repeat Purchase
                </span>
                <span className="text-3xl font-bold text-[#000000]">38.6%</span>
                <span className="text-xs text-[#0E8F21] font-semibold block mt-1">
                  Top 10% benchmark
                </span>
              </div>
            </div>

            {/* Main Area Chart: 6-Month Revenue & Profit Trajectory */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#000000]">
                    6-Month Revenue &amp; Net Profit Trajectory
                  </h3>
                  <p className="text-xs text-[#71717A]">
                    Track your business scale and bottom line
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-[#71717A]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4840]" />
                    <span>Gross Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#97DF68]" />
                    <span>Net Profit</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full -ml-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D4840" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1D4840" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#97DF68" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#97DF68" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1D4840"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#97DF68"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorProf)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Share */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
                <h3 className="text-lg font-semibold text-[#000000] mb-4">
                  Sales Share by Category
                </h3>
                <div className="h-60 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-[#71717A] mt-2">
                  {categoryShare.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>
                        {cat.name} ({cat.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#000000] mb-2">
                    Fulfillment Efficiency Score
                  </h3>
                  <p className="text-xs text-[#71717A] mb-6">
                    Measures average dispatch time and carrier on-time rate
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F5FCF0] border border-[#97DF68]/40 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1D4840]">Dispatch Speed</span>
                      <span className="text-xs font-bold text-[#0E8F21]">98.2% (Excellent)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E2E2E2]">
                      <div className="h-full rounded-full bg-[#0E8F21] w-[98%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#000000]">On-Time Delivery</span>
                      <span className="text-xs font-bold text-[#1D4840]">94.5%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E2E2E2]">
                      <div className="h-full rounded-full bg-[#1D4840] w-[94%]" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#A0A0A0] mt-4">
                  Aggregated from DHL Express &amp; Local logistics webhooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
