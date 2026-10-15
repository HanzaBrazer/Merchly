'use client';

import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HelpCenterPage() {
  const faqs = [
    {
      q: 'How does real-time stock deduction work when an order is created?',
      a: 'Whenever an order is placed through the "+ New Order" modal or synced from external marketplaces, Merchly executes an atomic PostgreSQL transaction that verifies inventory availability and deducts quantities in real-time, preventing overselling.',
    },
    {
      q: 'What happens when an order status is marked as Cancelled?',
      a: 'If a pending or processing order is marked as Cancelled, Merchly automatically restores the reserved inventory back to the active stock count and updates the stock status badge.',
    },
    {
      q: 'How do I test the Stripe Sandbox subscription checkout?',
      a: 'Click "Upgrade Plan" in the bottom of the sidebar or top banner. Select Pro or Business, and use the Stripe test credit card (4242 4242 4242 4242). Merchly will instantly process the simulated webhook and unlock Pro features.',
    },
    {
      q: 'How do AI Customer Service replies work in Chats?',
      a: 'In the Chats tab, click on any customer message and hit "Generate AI Reply". Merchly will analyze the customer inquiry (e.g. damaged table photo) and draft an empathetic, professional response ready to send with 1 click.',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Help Center &amp; Documentation
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Everything you need to know about Merchly architecture, features, and workflows.
          </p>
        </div>

        {/* 3 Quick Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E2E2E2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] text-[#CE3627] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">Product Guide</h3>
            <p className="text-xs text-[#71717A] mt-1 mb-4 leading-relaxed">
              Step-by-step documentation on inventory management and order fulfillment.
            </p>
            <Link href="/dashboard" className="text-xs font-bold text-[#CE3627] flex items-center gap-1 hover:underline">
              <span>View Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E2E2E2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] text-[#CE3627] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#CE3627]" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">API &amp; Webhooks</h3>
            <p className="text-xs text-[#71717A] mt-1 mb-4 leading-relaxed">
              Explore webhook endpoints, signature verification, and Stripe idempotency.
            </p>
            <Link href="/dashboard/settings" className="text-xs font-bold text-[#CE3627] flex items-center gap-1 hover:underline">
              <span>Inspect Webhooks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E2E2E2] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] text-[#CE3627] flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#000000]">Support Desk</h3>
            <p className="text-xs text-[#71717A] mt-1 mb-4 leading-relaxed">
              Have a question or encounter a blocker? Talk with our support engineering team.
            </p>
            <Link href="/dashboard/chats" className="text-xs font-bold text-[#CE3627] flex items-center gap-1 hover:underline">
              <span>Open Support Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#000000]">Frequently Asked Questions</h3>
          <div className="space-y-4 divide-y divide-[#E2E2E2]/60 text-sm">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                <h4 className="font-semibold text-[#000000] text-sm mb-1.5">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
