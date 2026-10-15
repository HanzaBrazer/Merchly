'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useMerchly } from '@/lib/store';
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/Badge';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const { workspace, setIsSearchModalOpen, resetToInitialDemo, setIsUpgradeModalOpen } = useMerchly();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 sm:px-6 bg-white sm:bg-transparent border-b sm:border-b-0 border-[#E2E2E2] select-none sticky top-0 z-30">
      {/* Left side: Mobile Hamburger + Logo / Desktop Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-2xl border border-[#E2E2E2] text-[#000000] hover:bg-[#F6F6F6] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Brand */}
        <div className="lg:hidden">
          <Link href="/dashboard">
            <Logo showText={false} className="w-7 h-7" />
          </Link>
        </div>

        {/* Desktop Global Search Bar (Figma replica) */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="hidden sm:flex items-center justify-between w-72 lg:w-96 px-4 py-2 bg-white rounded-full border border-[#E2E2E2] text-sm text-[#71717A] hover:border-[#CE3627]/40 shadow-xs transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#A0A0A0]" />
            <span>Search anything...</span>
          </div>
          <kbd className="px-2 py-0.5 text-[11px] font-semibold bg-[#F6F6F6] text-[#71717A] rounded-lg border border-[#E2E2E2]">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right side: Workspace Tag + Notification + Profile Pill */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Workspace Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#E2E2E2] text-xs font-medium text-[#000000]">
          <Building2 className="w-3.5 h-3.5 text-[#CE3627]" />
          <span>{workspace.name}</span>
          <Badge variant={workspace.plan === 'FREE' ? 'free' : 'pro'} size="sm">
            {workspace.plan}
          </Badge>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="sm:hidden p-2 rounded-full border border-[#E2E2E2] bg-white text-[#71717A] hover:text-[#000000]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-full border border-[#E2E2E2] bg-white flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FF0013]" />
          </button>

          {/* Notification Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E2E2] p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E2E2]">
                <span className="font-semibold text-sm text-[#000000]">Notifications</span>
                <span className="text-[11px] text-[#0E8F21] font-medium">3 unread</span>
              </div>
              <div className="py-2 space-y-2.5">
                <div className="p-2 rounded-xl bg-[#FEF1ED] border border-[#F7D7D1]">
                  <p className="font-semibold text-[#CE3627]">AI Stock Alert</p>
                  <p className="text-[#71717A] text-[11px] mt-0.5">
                    Bergen Sofa stock is at 3 pcs (Reorder point: 8).
                  </p>
                </div>
                <div className="p-2 rounded-xl hover:bg-[#F6F6F6]">
                  <p className="font-semibold text-[#000000]">New Order #C0875</p>
                  <p className="text-[#71717A] text-[11px]">Alex Johnson placed an order for $279.</p>
                </div>
                <div className="p-2 rounded-xl hover:bg-[#F6F6F6]">
                  <p className="font-semibold text-[#000000]">Customer Message</p>
                  <p className="text-[#71717A] text-[11px]">Alex sent 2 photos regarding table inquiry.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill (Figma Replica) */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-white rounded-full border border-[#E2E2E2] hover:border-[#CE3627]/30 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Brian"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-[#000000]">Brian</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E2E2] p-2 z-50 text-sm">
              <div className="px-3 py-2 border-b border-[#E2E2E2]/60">
                <p className="font-semibold text-[#000000]">Brian Vance</p>
                <p className="text-xs text-[#71717A]">brian@merchly.com • Owner</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUpgradeModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FEF1ED] text-[#CE3627] font-medium"
                >
                  <Sparkles className="w-4 h-4 text-[#CE3627]" />
                  <span>Subscription ({workspace.plan})</span>
                </button>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F6F6F6] text-[#000000]"
                >
                  <User className="w-4 h-4 text-[#71717A]" />
                  <span>Profile & Store Settings</span>
                </Link>

                <button
                  onClick={() => {
                    resetToInitialDemo();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#FFF4E5] text-[#D97706]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo State</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#E2E2E2]/60">
                <Link
                  href="/login"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FFE6E7] text-[#FF0013]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
