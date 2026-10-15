'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shirt,
  Smartphone,
  Armchair,
  UtensilsCrossed,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const { workspace, login } = useMerchly();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState('Furniture');
  const [storeName, setStoreName] = useState(workspace.name || 'Nordic Furniture');
  const [currency, setCurrency] = useState(workspace.currency || 'USD');
  const [salesTarget, setSalesTarget] = useState(workspace.salesTargetMonthly || 10000);
  const [connectedChannels, setConnectedChannels] = useState<string[]>(['shopify', 'shopee']);

  const categories = [
    { id: 'Fashion & Apparel', label: 'Fashion & Apparel', icon: Shirt },
    { id: 'Electronics', label: 'Electronics', icon: Smartphone },
    { id: 'Furniture', label: 'Furniture', icon: Armchair },
    { id: 'Food & Beverage', label: 'Food & Beverage', icon: UtensilsCrossed },
    { id: 'Beauty & Health', label: 'Beauty & Health', icon: Sparkles },
    { id: 'Others', label: 'Others', icon: HelpCircle },
  ];

  const toggleChannel = (channel: string) => {
    if (connectedChannels.includes(channel)) {
      setConnectedChannels(connectedChannels.filter((c) => c !== channel));
    } else {
      setConnectedChannels([...connectedChannels, channel]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    login('raihan@merchly.com', 'Raihan Fahreza');
    toast.success(`Selamat datang, Raihan Fahreza! Dashboard ${storeName} siap digunakan.`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1400px] min-h-[750px] lg:h-[880px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Figma Hero Image Banner (EL-600b6676 & EL-7801e495) */}
        <div className="bg-[#4A1512] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden shadow-xl order-2 lg:order-1">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE3627]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#CE3627] flex items-center justify-center shadow-md">
                <Logo showText={false} className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-medium tracking-tight text-white">Merchly</span>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              Workspace Setup
            </span>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative z-10 my-8 bg-white rounded-[28px] p-6 sm:p-7 text-[#000000] shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E2E2]">
              <div>
                <p className="text-xs text-[#71717A] uppercase font-bold tracking-wider">Store Configured</p>
                <h3 className="text-lg font-bold text-[#000000] mt-0.5">{storeName}</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1]">
                {selectedCategory}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F6F6]">
                <span className="text-[#71717A]">Target Penjualan Bulanan:</span>
                <span className="font-bold text-[#000000]">${salesTarget.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F6F6]">
                <span className="text-[#71717A]">Owner &amp; Admin:</span>
                <span className="font-bold text-[#CE3627]">Raihan Fahreza</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E2E2]/60 flex items-center justify-between text-xs text-[#71717A]">
              <span>Kanal Terhubung: <b>{connectedChannels.length} Channels</b></span>
              <span className="text-[#0E8F21] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Siap Launching
              </span>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 text-xs text-white/80 leading-relaxed">
            <p>
              Merchly mengotomasi pembagian pesanan multi-channel, sinkronisasi stok real-time,
              serta analitik pendapatan untuk pemilik bisnis retail modern.
            </p>
          </div>
        </div>

        {/* Right Side: Onboarding Interactive Steps (Figma Node 9:3452) */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 lg:p-16 flex flex-col justify-between border border-[#E2E2E2] shadow-sm order-1 lg:order-2">
          <div>
            {/* Top 3 Segmented Progress Bars (Figma EL-17097c86) */}
            <div className="grid grid-cols-3 gap-2.5 mb-8">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= 1 ? 'bg-[#CE3627]' : 'bg-[#E8E8E8]'
                }`}
              />
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= 2 ? 'bg-[#CE3627]' : 'bg-[#E8E8E8]'
                }`}
              />
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= 3 ? 'bg-[#CE3627]' : 'bg-[#E8E8E8]'
                }`}
              />
            </div>

            {/* STEP 1: Personalize Your Dashboard (Figma Screen 9:3452) */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-[#A0A0A0] block">Step 1/3</span>
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
                    Personalize Your Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                    Tell us a bit about your business so Merchly can tailor insights, analytics, and tools that fit your needs best.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm sm:text-base font-normal text-[#000000] block">
                    What type of business do you run?
                  </label>

                  {/* 6 Category Items (Figma EL-c094fdcc) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const Icon = cat.icon;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                            isSelected
                              ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] shadow-xs'
                              : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-white text-[#CE3627]' : 'bg-[#F6F6F6] text-[#71717A]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">{cat.label}</span>
                          </div>

                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#CE3627]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Store Identity */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-[#A0A0A0] block">Step 2/3</span>
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
                    Configure Store Profile
                  </h1>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                    Set your brand details, primary currency, and monthly sales goal.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#000000] block">
                      Store / Brand Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Nordic Furniture"
                      className="w-full h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#000000] block">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-[47px] px-4 rounded-full border border-[#E8E8E8] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="IDR">IDR (Rp)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="SGD">SGD (S$)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#000000] block">
                        Target Penjualan ($)
                      </label>
                      <input
                        type="number"
                        value={salesTarget}
                        onChange={(e) => setSalesTarget(Number(e.target.value))}
                        className="w-full h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Connect Sales Channels */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-[#A0A0A0] block">Step 3/3</span>
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
                    Connect Your Channels
                  </h1>
                  <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                    Link your e-commerce channels to sync live inventory and orders seamlessly.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: 'shopify', label: 'Shopify Store', desc: 'Auto-sync catalog & web orders' },
                    { id: 'shopee', label: 'Shopee Marketplace', desc: 'Sync flash sales and stock counts' },
                    { id: 'tokopedia', label: 'Tokopedia Merchant', desc: 'Instant order notifications' },
                    { id: 'tiktok', label: 'TikTok Shop', desc: 'Live commerce inventory lock' },
                  ].map((ch) => {
                    const isConnected = connectedChannels.includes(ch.id);
                    return (
                      <div
                        key={ch.id}
                        onClick={() => toggleChannel(ch.id)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isConnected
                            ? 'border-[#CE3627] bg-[#FEF1ED] text-[#000000]'
                            : 'border-[#E8E8E8] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm text-[#000000]">{ch.label}</p>
                          <p className="text-xs text-[#71717A] mt-0.5">{ch.desc}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isConnected
                              ? 'bg-[#CE3627] text-white'
                              : 'bg-[#F6F6F6] text-[#71717A] border border-[#E2E2E2]'
                          }`}
                        >
                          {isConnected ? 'Terhubung' : '+ Hubungkan'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Navigation Buttons (Figma EL-daf4a7a2 & EL-d15f1483) */}
          <div className="pt-8 flex items-center justify-between border-t border-[#E8E8E8]/60 mt-6">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleSkip}
                className="w-[150px] h-[47px] rounded-full border border-[#E8E8E8] bg-white hover:bg-[#F6F6F6] text-sm sm:text-base font-medium text-[#000000] transition-colors cursor-pointer"
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="w-[150px] h-[47px] rounded-full border border-[#E8E8E8] bg-white hover:bg-[#F6F6F6] text-sm sm:text-base font-medium text-[#000000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-[150px] h-[47px] rounded-full bg-[#CE3627] hover:bg-[#B72E20] text-white text-sm sm:text-base font-medium transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{step === 3 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
