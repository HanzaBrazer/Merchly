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
  CheckCircle,
  Building2,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const { workspace } = useMerchly();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState('Furniture');
  const [storeName, setStoreName] = useState('Nordic Furniture');
  const [targetSales, setTargetSales] = useState(10000);
  const [connectedChannels, setConnectedChannels] = useState<string[]>(['tiktok', 'shopee']);

  const categories = [
    { id: 'Fashion & Apparel', label: 'Fashion & Apparel', icon: Shirt },
    { id: 'Electronics', label: 'Electronics', icon: Smartphone },
    { id: 'Furniture', label: 'Furniture', icon: Armchair },
    { id: 'Food & Beverage', label: 'Food & Beverage', icon: UtensilsCrossed },
    { id: 'Beauty & Health', label: 'Beauty & Health', icon: Sparkles },
    { id: 'Others', label: 'Others', icon: HelpCircle },
  ];

  const handleFinish = () => {
    toast.success(`Welcome to Merchly! Dashboard configured for ${storeName}.`);
    router.push('/dashboard');
  };

  const toggleChannel = (channel: string) => {
    if (connectedChannels.includes(channel)) {
      setConnectedChannels(connectedChannels.filter((c) => c !== channel));
    } else {
      setConnectedChannels([...connectedChannels, channel]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header */}
      <header className="w-full max-w-2xl mx-auto pt-6 flex items-center justify-between">
        <Logo className="w-9 h-9" />
        <span className="text-xs font-semibold text-[#1D4840] bg-[#E8EDEC] px-3 py-1 rounded-full">
          Step {step} of 3
        </span>
      </header>

      {/* Main Wizard Card */}
      <main className="w-full max-w-2xl mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E2E2] shadow-sm">
          {/* STEP 1: CATEGORY SELECTION (Figma Replica) */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-[#1D4840] tracking-wider uppercase block mb-1">
                  Step 1/3
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
                  Personalize Your Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-2 leading-relaxed">
                  Tell us a bit about your business so Merchly can tailor insights, analytics, and tools
                  that fit your needs best.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#000000] block mb-3">
                  What type of business do you run?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const Icon = cat.icon;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          'p-4 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all select-none',
                          isSelected
                            ? 'border-[#97DF68] bg-[#F5FCF0] text-[#1D4840] font-semibold ring-2 ring-[#97DF68]/20'
                            : 'border-[#E2E2E2] bg-white text-[#000000] hover:border-[#1D4840]/30'
                        )}
                      >
                        <div
                          className={cn(
                            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                            isSelected ? 'bg-[#97DF68] text-[#1D4840]' : 'bg-[#F6F6F6] text-[#71717A]'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{cat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E2E2]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs sm:text-sm text-[#71717A] hover:text-[#000000] font-medium"
                >
                  Skip for now
                </button>
                <Button
                  variant="mint"
                  size="md"
                  className="font-bold px-6"
                  onClick={() => setStep(2)}
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: STORE GOALS & TARGETS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-[#1D4840] tracking-wider uppercase block mb-1">
                  Step 2/3
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
                  Store Details &amp; Sales Goal
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-2 leading-relaxed">
                  Calibrate your gauge progress bar and monthly targets.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                    Store / Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                    Monthly Sales Target ($)
                  </label>
                  <input
                    type="number"
                    value={targetSales}
                    onChange={(e) => setTargetSales(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                    required
                  />
                  <p className="text-[11px] text-[#71717A] mt-1">
                    Used to power your <b>Sales Overview 85%</b> semi-circular progress gauge.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E2E2]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs sm:text-sm text-[#71717A] hover:text-[#000000] font-medium"
                >
                  Back
                </button>
                <Button
                  variant="mint"
                  size="md"
                  className="font-bold px-6"
                  onClick={() => setStep(3)}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: CONNECT CHANNELS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-[#1D4840] tracking-wider uppercase block mb-1">
                  Step 3/3
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
                  Connect Sales Channels
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] mt-2 leading-relaxed">
                  Sync products, orders, and customer messages into your unified Merchly command
                  center.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'tiktok', name: 'TikTok Shop', desc: 'Sync live products, stock & orders' },
                  { id: 'shopee', name: 'Shopee Store', desc: 'Multi-store catalog automation' },
                  { id: 'amazon', name: 'Amazon Merchant / FBA', desc: 'Global retail order feeds' },
                  { id: 'hubspot', name: 'HubSpot CRM', desc: 'Customer relations & marketing sync' },
                ].map((channel) => {
                  const isChecked = connectedChannels.includes(channel.id);
                  return (
                    <div
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={cn(
                        'p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all select-none',
                        isChecked
                          ? 'border-[#97DF68] bg-[#F5FCF0]'
                          : 'border-[#E2E2E2] bg-white hover:border-[#1D4840]/30'
                      )}
                    >
                      <div>
                        <h4 className="font-bold text-sm text-[#000000]">{channel.name}</h4>
                        <p className="text-xs text-[#71717A] mt-0.5">{channel.desc}</p>
                      </div>

                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center border-2',
                          isChecked
                            ? 'bg-[#1D4840] border-[#1D4840] text-white'
                            : 'border-[#D3D3D3]'
                        )}
                      >
                        {isChecked && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E2E2]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs sm:text-sm text-[#71717A] hover:text-[#000000] font-medium"
                >
                  Back
                </button>
                <Button
                  variant="mint"
                  size="lg"
                  className="font-bold px-8"
                  onClick={handleFinish}
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-[#71717A]">
        Merchly Inc. • Step 1 to 3 Onboarding Wizard
      </footer>
    </div>
  );
}
