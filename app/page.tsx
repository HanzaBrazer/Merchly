'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Package,
  Layers,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Check,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#000000] flex flex-col justify-between selection:bg-[#97DF68] selection:text-[#1D4840]">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E2E2E2] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Logo className="w-8 h-8" />

        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#71717A]">
          <a href="#features" className="hover:text-[#000000] transition-colors">
            Pillars
          </a>
          <a href="#pricing" className="hover:text-[#000000] transition-colors">
            Pricing
          </a>
          <Link href="/track" className="hover:text-[#000000] transition-colors">
            Order Tracking
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="mint" size="sm" className="text-xs font-bold shadow-xs">
              Live Demo
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EDEC] border border-[#1D4840]/20 text-[#1D4840] text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#97DF68]" />
          <span>Internal Solo SaaS Challenge • Bronze, Silver &amp; Gold Ready</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#000000] max-w-4xl mx-auto leading-[1.15]">
          The Smarter Way to Run Your <span className="text-[#1D4840]">Multi-Channel Retail</span>{' '}
          Operations
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#71717A] max-w-2xl mx-auto mt-6 leading-relaxed">
          All your stores, orders, products, and customer conversations unified in one modern
          dashboard. Real-time inventory sync with AI-powered fulfillment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold px-8 shadow-md">
              <span>Launch Demo Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <Link href="/track">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-6">
              <Truck className="w-4 h-4 mr-1 text-[#1D4840]" />
              <span>Public Tracking Portal</span>
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-12 sm:mt-16 rounded-3xl overflow-hidden border-2 border-[#E2E2E2] shadow-2xl bg-white p-3 sm:p-5">
          <div className="bg-[#F6F6F6] rounded-2xl p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between mb-4 border-b border-[#E2E2E2] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF0013]/60" />
                <span className="w-3 h-3 rounded-full bg-[#FF9900]/60" />
                <span className="w-3 h-3 rounded-full bg-[#0E8F21]/60" />
                <span className="ml-2 text-xs font-semibold text-[#71717A]">
                  Merchly Command Center — Nordic Furniture
                </span>
              </div>
              <span className="text-xs font-bold text-[#0E8F21] bg-[#E7F4E9] px-2.5 py-0.5 rounded-full">
                ● Live Real-Time Sync
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white p-3 rounded-xl border border-[#E2E2E2]">
                <span className="text-[11px] text-[#71717A]">Total Sales</span>
                <p className="text-lg font-bold text-[#000000]">3,700</p>
                <span className="text-[10px] text-[#0E8F21] font-semibold">↑ 7% WoW</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E2E2]">
                <span className="text-[11px] text-[#71717A]">Total Revenue</span>
                <p className="text-lg font-bold text-[#000000]">$7,865</p>
                <span className="text-[10px] text-[#FF0013] font-semibold">↓ 5% WoW</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E2E2]">
                <span className="text-[11px] text-[#71717A]">Sales Goal</span>
                <p className="text-lg font-bold text-[#1D4840]">85%</p>
                <span className="text-[10px] text-[#0E8F21] font-semibold">15% to target</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E2E2E2]">
                <span className="text-[11px] text-[#71717A]">Active Orders</span>
                <p className="text-lg font-bold text-[#000000]">985</p>
                <span className="text-[10px] text-[#0E8F21] font-semibold">Avg 4.1 days</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#1D4840] hover:underline inline-flex items-center gap-1"
              >
                <span>Click here to explore the full interactive dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section id="features" className="px-4 sm:px-6 py-16 bg-white border-y border-[#E2E2E2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#1D4840] tracking-wider uppercase">
              The 4 Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] mt-2">
              Built Specifically for Retail &amp; E-Commerce Operators
            </h2>
            <p className="text-sm text-[#71717A] mt-2">
              Eliminate app-fatigue and switch seamlessly between finance, logistics, stock, and CS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#000000] mb-2">Executive Analytics</h3>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Real-time gauge showing sales growth towards monthly revenue targets, day-by-day
                  insights, and gross vs net profit breakdown.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#1D4840] mt-6 inline-flex items-center gap-1"
              >
                <span>Explore Metrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#000000] mb-2">Order Fulfillment Hub</h3>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Track pending, shipped, and canceled volume. Atomic transactions that instantly
                  deduct stock and prevent overselling.
                </p>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-xs font-bold text-[#1D4840] mt-6 inline-flex items-center gap-1"
              >
                <span>Manage Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#000000] mb-2">Smart Inventory &amp; AI</h3>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Automated Out of Stock / Low Stock thresholds with AI predictive insight cards
                  recommending exact reorder quantities.
                </p>
              </div>
              <Link
                href="/dashboard/products"
                className="text-xs font-bold text-[#1D4840] mt-6 inline-flex items-center gap-1"
              >
                <span>View Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#000000] mb-2">Omnichannel AI Chats</h3>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Unified customer service desk with support for defective item photo attachments and
                  1-click AI-drafted reply suggestions.
                </p>
              </div>
              <Link
                href="/dashboard/chats"
                className="text-xs font-bold text-[#1D4840] mt-6 inline-flex items-center gap-1"
              >
                <span>Open Chat Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote Section (Directly from Figma data) */}
      <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto text-center">
        <div className="bg-[#1D4840] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#97DF68]/10 rounded-full blur-3xl pointer-events-none" />
          <p className="text-xl sm:text-2xl font-medium leading-relaxed mb-6 italic">
            &ldquo;Our entire team finally works in sync thanks to Merchly&apos;s clear dashboard and
            real-time inventory analytics.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Brian"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#97DF68]"
            />
            <div className="text-left">
              <p className="font-bold text-sm text-white">Brian Vance</p>
              <p className="text-xs text-[#97DF68]">Store Owner, Nordic Furniture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section id="pricing" className="px-4 sm:px-6 py-16 bg-white border-t border-[#E2E2E2]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold text-[#1D4840] tracking-wider uppercase">
            Simple &amp; Predictable Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] mt-2">
            Built for Solo Founders &amp; Scaling Retailers
          </h2>
          <p className="text-sm text-[#71717A] mt-2 mb-8">
            Stripe Sandbox test mode enabled. Upgrade in 1 click using test card.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Free Tier */}
            <div className="rounded-3xl p-6 border border-[#E2E2E2] bg-[#F6F6F6] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#000000]">Free Starter</h3>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-[#000000]">$0</span>
                  <span className="text-xs text-[#71717A]"> / forever</span>
                </div>
                <p className="text-xs text-[#71717A] mb-6">
                  For testing workflows and boutique stores.
                </p>

                <ul className="space-y-2.5 text-xs text-[#000000]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Up to 50 Products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Up to 100 Orders / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Basic Executive Dashboard</span>
                  </li>
                </ul>
              </div>

              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="rounded-3xl p-6 border-2 border-[#97DF68] bg-[#F5FCF0] flex flex-col justify-between relative shadow-md">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D4840] text-[#97DF68] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <div>
                <h3 className="font-bold text-lg text-[#1D4840]">Pro Merchant</h3>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-[#1D4840]">$19</span>
                  <span className="text-xs text-[#71717A]"> / month</span>
                </div>
                <p className="text-xs text-[#71717A] mb-6">
                  All AI tools and unlimited inventory scale.
                </p>

                <ul className="space-y-2.5 text-xs text-[#1D4840]">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Unlimited Products &amp; Catalogs</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Unlimited Orders &amp; Fulfillment</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Productive with AI Quick Replies</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>AI Inventory Restock Insights</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>CSV Import &amp; Export</span>
                  </li>
                </ul>
              </div>

              <Link href="/dashboard" className="mt-8">
                <Button variant="mint" size="md" className="w-full text-xs font-bold shadow-xs">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>

            {/* Business Tier */}
            <div className="rounded-3xl p-6 border border-[#E2E2E2] bg-[#F6F6F6] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#000000]">Business Enterprise</h3>
                <div className="my-3">
                  <span className="text-4xl font-extrabold text-[#000000]">$49</span>
                  <span className="text-xs text-[#71717A]"> / month</span>
                </div>
                <p className="text-xs text-[#71717A] mb-6">
                  For teams needing RBAC and multi-store control.
                </p>

                <ul className="space-y-2.5 text-xs text-[#000000]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Full Team RBAC (Owner, Admin, Staff)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Up to 10 Team Seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0E8F21]" />
                    <span>Dedicated Webhooks &amp; Priority Sync</span>
                  </li>
                </ul>
              </div>

              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                  Contact Sales / Enterprise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E2E2] py-8 px-4 sm:px-8 text-xs text-[#71717A]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo showText={true} />
          <p>© 2026 Merchly Inc. Built for Solo SaaS Challenge &amp; Vercel Deployment.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/track" className="hover:underline">
              Tracking Portal
            </Link>
            <Link href="/dashboard" className="hover:underline font-semibold text-[#1D4840]">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
