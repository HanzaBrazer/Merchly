'use client';

import React, { useState } from 'react';
import { Check, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { Plan } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function UpgradeModal() {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, workspace, upgradePlan } = useMerchly();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('PRO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'FREE' as Plan,
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for testing and small boutique shops.',
      features: [
        'Up to 50 Products',
        'Up to 100 Orders / month',
        'Basic Dashboard Analytics',
        '1 Admin Account',
      ],
      disabledFeatures: [
        'AI Insights & Predictive Replenishment',
        'AI Customer Chat Quick Replies',
        'Advanced Revenue Forecasting',
        'Team Member Invites (RBAC)',
      ],
    },
    {
      id: 'PRO' as Plan,
      name: 'Pro Merchant',
      price: billingInterval === 'monthly' ? '$19' : '$15',
      period: 'per month',
      popular: true,
      description: 'Everything you need to automate multi-channel retail operations.',
      features: [
        'Unlimited Products & Catalogs',
        'Unlimited Orders & Fulfillment',
        'Productive with AI Tools (AI Chat + AI Insights)',
        'Low-Stock Automated Alerts',
        'Advanced Analytics & Revenue Insights',
        'CSV Import & Export',
        '2 Team Seats',
      ],
      disabledFeatures: ['Multi-User RBAC Roles'],
    },
    {
      id: 'BUSINESS' as Plan,
      name: 'Business Enterprise',
      price: billingInterval === 'monthly' ? '$49' : '$39',
      period: 'per month',
      description: 'For growing retail brands with warehouses and multiple team members.',
      features: [
        'Everything in Pro Plan',
        'Full Team RBAC (Owner, Admin, Staff, Viewer)',
        'Up to 10 Team Seats',
        'Dedicated Webhooks & Priority API Sync',
        '24/7 Priority Support Desk',
        'Audit Log & Stock Movement History',
      ],
      disabledFeatures: [],
    },
  ];

  const handleCheckout = () => {
    if (selectedPlan === workspace.plan) {
      toast.info(`You are currently on the ${workspace.plan} plan.`);
      return;
    }

    setIsProcessing(true);
    // Simulate Stripe sandbox checkout & webhook handling (500ms latency)
    setTimeout(() => {
      upgradePlan(selectedPlan);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <Modal
      isOpen={isUpgradeModalOpen}
      onClose={() => setIsUpgradeModalOpen(false)}
      maxWidth="2xl"
      title="Upgrade Your Merchly Workspace"
      description="Select the plan that fits your retail operational scale. Stripe Sandbox test mode enabled."
    >
      <div className="space-y-6">
        {/* Monthly / Yearly Toggle */}
        <div className="flex justify-center">
          <div className="bg-[#F6F6F6] p-1 rounded-full flex items-center border border-[#E2E2E2]">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                billingInterval === 'monthly'
                  ? 'bg-white text-[#000000] shadow-xs'
                  : 'text-[#71717A] hover:text-[#000000]'
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5',
                billingInterval === 'yearly'
                  ? 'bg-white text-[#000000] shadow-xs'
                  : 'text-[#71717A] hover:text-[#000000]'
              )}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-[#DFF5D0] text-[#0E8F21] px-1.5 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            const isCurrent = workspace.plan === p.id;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={cn(
                  'rounded-3xl p-5 border-2 text-left cursor-pointer transition-all relative flex flex-col justify-between',
                  isSelected
                    ? 'border-[#97DF68] bg-[#F5FCF0]/50 shadow-md ring-2 ring-[#97DF68]/20'
                    : 'border-[#E2E2E2] bg-white hover:border-[#1D4840]/30',
                  isCurrent && 'ring-1 ring-[#1D4840]'
                )}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D4840] text-[#97DF68] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-[#000000]">{p.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold bg-[#E8EDEC] text-[#1D4840] px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold text-[#000000]">{p.price}</span>
                    <span className="text-xs text-[#71717A]">/{p.period}</span>
                  </div>
                  <p className="text-xs text-[#71717A] mb-4 leading-relaxed">{p.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 text-xs text-[#000000] mb-4">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0E8F21] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {p.disabledFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#A0A0A0] line-through">
                        <span className="w-3.5 h-3.5 shrink-0 text-center font-bold">×</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={isSelected ? 'mint' : 'outline'}
                  size="sm"
                  className="w-full text-xs font-bold mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(p.id);
                  }}
                >
                  {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Choose Plan'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Stripe Sandbox Checkout Simulation Box */}
        <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E2E2E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1D4840] text-[#97DF68] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#000000] flex items-center gap-2">
                <span>Stripe Sandbox Test Card</span>
                <span className="bg-[#E7F4E9] text-[#0E8F21] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Instant Webhook
                </span>
              </p>
              <p className="text-[#71717A] font-mono text-[11px] mt-0.5">
                4242 •••• •••• 4242 &nbsp;|&nbsp; Exp: 12/28 &nbsp;|&nbsp; CVC: 123
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="mint"
              size="md"
              disabled={isProcessing || selectedPlan === workspace.plan}
              onClick={handleCheckout}
              className="w-full sm:w-auto text-xs px-6 font-bold"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Verifying Webhook...
                </span>
              ) : selectedPlan === workspace.plan ? (
                'Current Active Plan'
              ) : (
                `Activate ${selectedPlan} with Stripe`
              )}
            </Button>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#71717A]">
          <ShieldCheck className="w-4 h-4 text-[#0E8F21]" />
          <span>PCI-DSS Compliant • Stripe 256-bit Encrypted Webhook Sandbox</span>
        </div>
      </div>
    </Modal>
  );
}
