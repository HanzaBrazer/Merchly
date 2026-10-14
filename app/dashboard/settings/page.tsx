'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Code,
  Sparkles,
  ShieldAlert,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useMerchly } from '@/lib/store';
import { MemberRole, Plan } from '@/lib/types';
import { toast } from 'sonner';

export default function SettingsPage() {
  const {
    workspace,
    teamMembers,
    inviteTeamMember,
    upgradePlan,
    setIsUpgradeModalOpen,
  } = useMerchly();

  const [activeTab, setActiveTab] = useState<'store' | 'team' | 'billing' | 'webhooks'>('store');

  // Store form
  const [storeName, setStoreName] = useState(workspace.name);
  const [currency, setCurrency] = useState(workspace.currency);
  const [salesTarget, setSalesTarget] = useState(workspace.salesTargetMonthly);

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('staff');

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Store profile updated successfully!');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const success = inviteTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });
    if (success) {
      setIsInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
            Settings &amp; Workspace
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Configure store preferences, manage team RBAC, and inspect Stripe billing.
          </p>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-full border border-[#E2E2E2] w-fit shadow-xs">
          {[
            { id: 'store', label: 'Store Profile', icon: Building2 },
            { id: 'team', label: 'Team & RBAC', icon: Users },
            { id: 'billing', label: 'Stripe Billing', icon: CreditCard },
            { id: 'webhooks', label: 'Sandbox Webhooks', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1D4840] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#000000] hover:bg-black/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Store Profile */}
        {activeTab === 'store' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm max-w-2xl">
            <h3 className="text-lg font-bold text-[#000000] mb-4">Store Identity</h3>
            <form onSubmit={handleSaveStore} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Store / Brand Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                    Store Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="SGD">SGD (S$)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                    Monthly Target Goal ($)
                  </label>
                  <input
                    type="number"
                    value={salesTarget}
                    onChange={(e) => setSalesTarget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Industry / Business Type
                </label>
                <input
                  type="text"
                  disabled
                  value={workspace.category || 'Furniture & Home Decor'}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-[#F6F6F6] text-[#71717A] cursor-not-allowed"
                />
              </div>

              <div className="pt-3">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Team Members & RBAC */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#000000]">Team Members &amp; RBAC</h3>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Role-based access control (Owner, Admin, Staff, Viewer).
                  </p>
                </div>

                <Button
                  variant="mint"
                  size="md"
                  className="text-xs sm:text-sm font-semibold"
                  onClick={() => setIsInviteOpen(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Invite Member</span>
                </Button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E2E2] text-xs font-semibold text-[#71717A]">
                      <th className="py-3 px-3">Member</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Joined Date</th>
                      <th className="py-3 px-3 text-right">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E2E2]/60">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#F6F6F6] transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-[#000000]">{member.name}</p>
                              <p className="text-xs text-[#71717A]">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-[#E8EDEC] text-[#1D4840] font-bold">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#71717A]">{member.joinedAt}</td>
                        <td className="py-3.5 px-3 text-right text-xs text-[#0E8F21] font-semibold">
                          {member.role === 'owner' ? 'Full Access + Billing' : 'Operational Only'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RBAC Matrix Explanatory Card (From PRD) */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 border border-[#E2E2E2] text-xs">
              <h4 className="font-bold text-sm text-[#000000] mb-2">Role Permissions Matrix</h4>
              <p className="text-[#71717A] mb-4">
                Enforced by Supabase Row-Level Security (RLS) and server actions.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#1D4840]">Owner</p>
                  <p className="text-[11px] text-[#71717A] mt-1">Full control, billing, team admin, delete workspace.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#1D4840]">Admin</p>
                  <p className="text-[11px] text-[#71717A] mt-1">Manage catalog, orders, and invite team members.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#1D4840]">Staff</p>
                  <p className="text-[11px] text-[#71717A] mt-1">Order processing, fulfillment, and customer chat.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#1D4840]">Viewer</p>
                  <p className="text-[11px] text-[#71717A] mt-1">Read-only view of dashboard and products.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Stripe Billing */}
        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E2]">
                <div>
                  <h3 className="text-lg font-bold text-[#000000]">Active Subscription</h3>
                  <p className="text-xs text-[#71717A]">Managed by Stripe Hosted Billing</p>
                </div>
                <Badge variant={workspace.plan === 'FREE' ? 'free' : 'pro'} size="md">
                  {workspace.plan} Plan
                </Badge>
              </div>

              <div className="py-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Billing Status:</span>
                  <span className="font-semibold text-[#0E8F21] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    {workspace.subscriptionStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Current Period Ends:</span>
                  <span className="font-semibold text-[#000000]">
                    {workspace.currentPeriodEnd || 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Payment Gateway:</span>
                  <span className="font-mono text-xs text-[#71717A]">Stripe Test Mode (Sandbox)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E2E2] flex flex-wrap items-center gap-3">
                <Button
                  variant="mint"
                  size="md"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="font-bold"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  {workspace.plan === 'FREE' ? 'Upgrade to Pro / Business' : 'Change Subscription Tier'}
                </Button>

                {workspace.plan !== 'FREE' && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      upgradePlan('FREE');
                      toast.info('Cancelled subscription. Account downgraded to Free.');
                    }}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Webhook Sandbox Simulator */}
        {activeTab === 'webhooks' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm max-w-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#000000]">Stripe Webhook Event Simulator</h3>
            <p className="text-xs text-[#71717A] leading-relaxed">
              Test how Merchly backend handles incoming webhook events asynchronously with signature
              verification and idempotency.
            </p>

            <div className="space-y-2 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-[#000000]">checkout.session.completed</p>
                  <p className="text-[11px] text-[#71717A]">Activates PRO plan and saves stripe_subscription_id</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    upgradePlan('PRO');
                    toast.success('Webhook event "checkout.session.completed" processed!');
                  }}
                >
                  Fire Event
                </Button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-[#000000]">customer.subscription.deleted</p>
                  <p className="text-[11px] text-[#71717A]">Downgrades workspace back to FREE tier</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    upgradePlan('FREE');
                    toast.info('Webhook event "customer.subscription.deleted" processed!');
                  }}
                >
                  Fire Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Team Member"
        description="Add a coworker to your workspace with specific RBAC permissions."
      >
        <form onSubmit={handleInvite} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Member Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Work Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Assigned Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] bg-white"
            >
              <option value="admin">Admin — Catalog, orders, team</option>
              <option value="staff">Staff — Order fulfillment &amp; chat</option>
              <option value="viewer">Viewer — Read-only access</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-[#FFF4E5] border border-[#FF9900]/30 text-xs text-[#D97706]">
            Note: Inviting team members requires <b>Business Enterprise</b> tier.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2E2]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
