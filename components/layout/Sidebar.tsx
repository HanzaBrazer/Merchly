'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageCircle,
  Settings,
  Layers,
  HelpCircle,
  Plus,
  Sparkles,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { conversations, setIsUpgradeModalOpen, setIsLogoutModalOpen, workspace, currentUser } = useMerchly();

  const totalUnreadChats = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    {
      label: 'Chats',
      href: '/dashboard/chats',
      icon: MessageCircle,
      badge: totalUnreadChats > 0 ? totalUnreadChats : undefined,
    },
  ];

  const generalItems = [
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Integration', href: '/dashboard/integrations', icon: Layers },
    { label: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white rounded-3xl p-5 border border-[#E2E2E2] shadow-sm select-none">
      {/* Top Part: Brand + Navs */}
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Brand Logo */}
        <div className="px-2 pt-1 pb-2">
          <Link href="/dashboard" onClick={onItemClick}>
            <Logo />
          </Link>
        </div>

        {/* Group: Menu */}
        <div>
          <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider px-3 mb-2 block">
            Menu
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#F6F6F6] text-[#000000] font-semibold shadow-xs'
                      : 'text-[#71717A] hover:text-[#000000] hover:bg-black/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-5 h-5', isActive ? 'text-[#CE3627]' : 'text-[#71717A]')} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-[#FF0013] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Group: General */}
        <div>
          <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider px-3 mb-2 block">
            General
          </span>
          <nav className="space-y-1">
            {generalItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#F6F6F6] text-[#000000] font-semibold'
                      : 'text-[#71717A] hover:text-[#000000] hover:bg-black/5'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-[#CE3627]' : 'text-[#71717A]')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Group: Tools */}
        <div>
          <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider px-3 mb-2 block">
            Tools
          </span>
          <div className="space-y-1.5">
            <Link
              href="/dashboard/integrations"
              onClick={onItemClick}
              className="flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-medium text-[#000000] hover:bg-[#F6F6F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-[#FF7A59] text-white flex items-center justify-center text-[10px] font-bold">
                  H
                </span>
                <span>HubSpot</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#A0A0A0]" />
            </Link>

            <Link
              href="/dashboard/integrations"
              onClick={onItemClick}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add new tools</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Floating Banner: "Productive with AI" */}
      <div className="mt-4 pt-4 border-t border-[#E2E2E2]/60">
        <div className="bg-[#F6F6F6] rounded-2xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FEF1ED] border border-[#F7D7D1] flex items-center justify-center text-[#CE3627]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#000000]">Productive with AI</span>
          </div>

          <p className="text-[11px] text-[#71717A] leading-relaxed">
            AI-powered replies, tag insight, and tools that save your time.
          </p>

          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs font-bold py-2 shadow-xs"
            onClick={() => {
              setIsUpgradeModalOpen(true);
              if (onItemClick) onItemClick();
            }}
          >
            {workspace.plan === 'FREE' ? 'Upgrade Plan' : 'Manage Pro Plan'}
          </Button>
        </div>

        <button
          onClick={() => {
            if (onItemClick) onItemClick();
            setIsLogoutModalOpen(true);
          }}
          className="w-full mt-2.5 flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium text-[#71717A] hover:text-[#CE3627] hover:bg-[#FEF1ED] transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-[#71717A]" />
            <span>Keluar / Logout</span>
          </div>
          <span className="text-[10px] bg-[#F6F6F6] border border-[#E2E2E2] px-1.5 py-0.5 rounded-full text-[#71717A]">
            {currentUser?.name ? currentUser.name.split(' ')[0] : 'Raihan'}
          </span>
        </button>
      </div>
    </aside>
  );
}
