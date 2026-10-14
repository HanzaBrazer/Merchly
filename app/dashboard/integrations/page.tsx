'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, XCircle, ExternalLink, Settings2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function IntegrationsPage() {
  const { integrations, toggleIntegration } = useMerchly();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Marketplace', 'Payment', 'Logistics', 'CRM', 'Developers'];

  const filtered = integrations.filter((i) =>
    selectedCategory === 'All' ? true : i.category === selectedCategory
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Integration
            </h1>
            <p className="text-sm text-[#71717A] mt-1">
              Connect your store to marketplaces, payments, etc — all from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4840] bg-[#E8EDEC] px-3.5 py-2 rounded-full">
            <Layers className="w-4 h-4" />
            <span>
              {integrations.filter((i) => i.enabled).length} of {integrations.length} Active
            </span>
          </div>
        </div>

        {/* Category Filter Pills (Figma Replica) */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-full border border-[#E2E2E2] w-fit shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                selectedCategory === cat
                  ? 'bg-[#1D4840] text-white shadow-xs'
                  : 'text-[#71717A] hover:text-[#000000] hover:bg-black/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Integration Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between hover:border-[#1D4840]/30 transition-all"
            >
              <div>
                {/* Top Row: Icon + Toggle Switch */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-center text-lg font-bold text-[#1D4840] shadow-xs">
                    {item.name.charAt(0)}
                  </div>

                  {/* Toggle Switch (Figma Switch=On / Off replica) */}
                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className={cn(
                      'w-12 h-7 rounded-full p-1 transition-colors relative focus:outline-none',
                      item.enabled ? 'bg-[#1D4840]' : 'bg-[#E2E2E2]'
                    )}
                    role="switch"
                    aria-checked={item.enabled}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        item.enabled ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-[#000000]">{item.name}</h3>
                  <span className="text-[10px] font-semibold bg-[#F6F6F6] text-[#71717A] px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-[#71717A] leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-[#E2E2E2]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  {item.enabled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E8F21]" />
                      <span className="text-[#0E8F21]">{item.statusText || 'Connected'}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-[#A0A0A0]" />
                      <span className="text-[#71717A]">Disabled</span>
                    </>
                  )}
                </div>

                <button className="text-[#71717A] hover:text-[#000000] p-1 rounded-lg hover:bg-black/5">
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
