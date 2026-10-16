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
  Copy,
  ExternalLink,
  User,
  Send,
  Mail,
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
    invitations,
    createInvitation,
    currentUser,
    upgradePlan,
    setIsUpgradeModalOpen,
  } = useMerchly();

  const role = currentUser?.role || 'owner';

  // Available tabs per DESIGN.md §15
  // Owner: store, team, billing, webhooks
  // Admin: store, team, webhooks (NO billing)
  // Staff: profile only
  const availableTabs = [
    ...(role !== 'staff'
      ? [{ id: 'store', label: 'Store Profile', icon: Building2 }]
      : []),
    { id: 'profile', label: 'Personal Profile', icon: User },
    ...(role !== 'staff'
      ? [{ id: 'team', label: 'Team & RBAC', icon: Users }]
      : []),
    ...(role === 'owner'
      ? [{ id: 'billing', label: 'Stripe Billing', icon: CreditCard }]
      : []),
    ...(role !== 'staff'
      ? [{ id: 'webhooks', label: 'Sandbox Webhooks', icon: Code }]
      : []),
  ];

  const [activeTab, setActiveTab] = useState<string>(
    role === 'staff' ? 'profile' : 'store'
  );

  // Store form
  const [storeName, setStoreName] = useState(workspace.name);
  const [currency, setCurrency] = useState(workspace.currency);
  const [salesTarget, setSalesTarget] = useState(workspace.salesTargetMonthly);

  // Profile form
  const [profileName, setProfileName] = useState(currentUser?.name || 'Raihan Fahreza');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'raihanfahreza04@gmail.com');

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('staff');

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Store profile updated successfully!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil pribadi berhasil disimpan!');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Masukkan alamat email yang valid.');
      return;
    }

    const newInv = createInvitation(inviteEmail, inviteRole);
    setIsInviteOpen(false);
    setInviteEmail('');

    const inviteUrl = `${window.location.origin}/invite?token=${newInv.token}`;
    toast.success(`Undangan untuk ${newInv.email} (${newInv.role.toUpperCase()}) siap dibagikan!`);
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/invite?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Link undangan telah disalin ke clipboard!');
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
            Konfigurasi preferensi toko, kelola undangan tim RBAC, dan profil akun.
          </p>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-full border border-[#E2E2E2] w-fit shadow-xs">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CE3627] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#000000] hover:bg-black/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Personal Profile (Available to all roles including Staff) */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#000000]">Profil Pribadi</h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                Kelola informasi akun Anda di workspace {workspace.name}.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Alamat Email Akun
                </label>
                <input
                  type="email"
                  disabled
                  value={profileEmail}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-[#F6F6F6] text-sm text-[#71717A] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Role Akses Anda
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] font-bold">
                    {role}
                  </span>
                  <span className="text-xs text-[#71717A]">
                    {role === 'owner'
                      ? 'Pemilik Workspace (Full Control)'
                      : role === 'admin'
                      ? 'Administrator Operasional'
                      : 'Staff Pemenuhan Pesanan & Chat'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary">
                  Simpan Profil
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Store Profile (Owner & Admin only) */}
        {activeTab === 'store' && role !== 'staff' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#000000]">General Store Profile</h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                Manage basic business information for your customer invoices and tracking.
              </p>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                  Store / Brand Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
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
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                    Monthly Target ($)
                  </label>
                  <input
                    type="number"
                    value={salesTarget}
                    onChange={(e) => setSalesTarget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-white text-sm text-[#000000] focus:outline-none focus:border-[#CE3627]"
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

        {/* Tab: Team Members & RBAC (Owner & Admin only) */}
        {activeTab === 'team' && role !== 'staff' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#000000]">Anggota Tim &amp; RBAC</h3>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    {role === 'owner'
                      ? 'Sebagai Owner, Anda dapat mengundang Admin dan Staff ke workspace ini.'
                      : 'Sebagai Admin, Anda dapat mengundang Staff ke workspace ini.'}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="text-xs sm:text-sm font-semibold"
                  onClick={() => setIsInviteOpen(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Undang Anggota Tim</span>
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
                              src={member.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#E2E2E2]"
                            />
                            <div>
                              <p className="font-semibold text-[#000000]">{member.name}</p>
                              <p className="text-xs text-[#71717A]">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`font-mono text-xs uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                              member.role === 'owner'
                                ? 'bg-[#FEF1ED] text-[#CE3627] border-[#F7D7D1]'
                                : member.role === 'admin'
                                ? 'bg-[#EBF5FF] text-[#1E40AF] border-[#BFDBFE]'
                                : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#71717A]">{member.joinedAt}</td>
                        <td className="py-3.5 px-3 text-right text-xs font-semibold">
                          {member.role === 'owner' ? (
                            <span className="text-[#CE3627]">Full Access + Billing</span>
                          ) : member.role === 'admin' ? (
                            <span className="text-[#1E40AF]">Operasional Penuh</span>
                          ) : (
                            <span className="text-[#15803D]">Proses Order &amp; Chat</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Invitations Section */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-base text-[#000000]">Daftar Link Undangan Aktif</h4>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Calon anggota dapat menggunakan link ini untuk langsung bergabung ke workspace dengan role yang Anda tentukan.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F6F6F6] text-[#71717A] border border-[#E2E2E2]">
                  {invitations.length} Undangan
                </span>
              </div>

              <div className="divide-y divide-[#E2E2E2]/60 border border-[#E2E2E2] rounded-2xl overflow-hidden">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#71717A]" />
                        <span className="font-semibold text-sm text-[#000000]">{inv.email}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            inv.role === 'admin'
                              ? 'bg-[#EBF5FF] text-[#1E40AF] border-[#BFDBFE]'
                              : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                          }`}
                        >
                          {inv.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A]">
                        Diundang oleh <strong className="text-black">{inv.invitedBy}</strong> • Dibuat {inv.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyInviteLink(inv.token)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] text-xs font-semibold hover:bg-[#FCE6DF] transition-colors cursor-pointer"
                        title="Salin tautan undangan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link</span>
                      </button>

                      <a
                        href={`/invite?token=${inv.token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#E2E2E2] text-xs font-medium text-[#71717A] hover:text-black hover:bg-[#F6F6F6] transition-colors"
                      >
                        <span>Buka</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Permissions Matrix Card (DESIGN.md §15) */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 border border-[#E2E2E2] text-xs">
              <h4 className="font-bold text-sm text-[#000000] mb-2">Matriks Hak Akses Per Role (DESIGN.md §15)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#CE3627] text-sm">👑 Owner</p>
                  <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
                    Akses penuh finansial, Stripe billing &amp; subscription, undang Admin/Staff, dan konfigurasi toko.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#1E40AF] text-sm">🛡️ Admin</p>
                  <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
                    Operasional penuh: CRUD produk, kelola pesanan &amp; refund, undang Staff. Tanpa akses Billing.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E2E2]">
                  <p className="font-bold text-[#15803D] text-sm">💼 Staff</p>
                  <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
                    Operator harian: Proses status order, balas chat customer. Menu Integration, Tools, dan Billing disembunyikan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Stripe Billing (Owner Only) */}
        {activeTab === 'billing' && role === 'owner' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#000000]">Stripe Billing &amp; Subscriptions</h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                Kelola paket langganan Merchly dan invoice resmi workspace Anda.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#CE3627] font-semibold uppercase tracking-wider block">Current Plan</span>
                <h4 className="text-2xl font-bold text-[#000000] mt-0.5">{workspace.plan} Tier</h4>
                <p className="text-xs text-[#71717A] mt-1">Status: Active Subscription</p>
              </div>

              <Button
                variant="primary"
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                {workspace.plan === 'FREE' ? 'Upgrade Plan' : 'Manage Subscription'}
              </Button>
            </div>
          </div>
        )}

        {/* Tab: Sandbox Webhooks */}
        {activeTab === 'webhooks' && role !== 'staff' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#000000]">Sandbox Webhooks</h3>
              <p className="text-xs text-[#71717A] mt-0.5">
                Endpoint API untuk integrasi realtime marketplace (Shopify, Shopee, Tokopedia).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] font-mono text-xs text-[#000000] break-all">
              https://merchly.app/api/webhooks/v1/orders
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Undang Anggota Baru ke Workspace"
        description="Penerima akan menerima link undangan untuk bergabung dengan role yang Anda tentukan."
      >
        <form onSubmit={handleInvite} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-[#000000] block mb-1">
              Alamat Email Anggota
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="contoh: staff.toko@gmail.com"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] bg-white text-sm text-[#000000] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#CE3627]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] block mb-1">
              Tentukan Role Anggota
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Owner can invite Admin and Staff; Admin can only invite Staff */}
              {role === 'owner' && (
                <button
                  type="button"
                  onClick={() => setInviteRole('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    inviteRole === 'admin'
                      ? 'border-[#1E40AF] bg-[#EBF5FF] text-[#1E40AF] font-bold shadow-xs'
                      : 'border-[#E2E2E2] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                  }`}
                >
                  <p className="text-xs font-bold">🛡️ Administrator</p>
                  <p className="text-[11px] font-normal opacity-80 mt-0.5">Operasional Penuh</p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setInviteRole('staff')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  inviteRole === 'staff'
                    ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] font-bold shadow-xs'
                    : 'border-[#E2E2E2] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                } ${role === 'admin' ? 'col-span-2' : ''}`}
              >
                <p className="text-xs font-bold">💼 Staff Anggota</p>
                <p className="text-[11px] font-normal opacity-80 mt-0.5">Proses Order &amp; Live Chat</p>
              </button>
            </div>
            {role === 'admin' && (
              <p className="text-[11px] text-[#71717A] mt-1.5">
                Sebagai Admin, Anda berwenang mengundang Staff. Hanya Owner yang dapat mengundang Admin.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E2E2]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsInviteOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md">
              Buat Link Undangan
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
