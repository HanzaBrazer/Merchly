'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  onOpenDrawer: () => void;
}

export function MobileNav({ onOpenDrawer }: MobileNavProps) {
  const pathname = usePathname();
  const { conversations } = useMerchly();

  const totalUnreadChats = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const items = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    {
      label: 'Chats',
      href: '/dashboard/chats',
      icon: MessageCircle,
      badge: totalUnreadChats > 0 ? totalUnreadChats : undefined,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E2E2] px-2 py-2 flex items-center justify-around shadow-lg pb-safe">
      {items.map((item) => {
        const isActive =
          item.href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl transition-all relative',
              isActive ? 'text-[#1D4840] font-semibold' : 'text-[#71717A] hover:text-[#000000]'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-5 h-5', isActive && 'text-[#1D4840] stroke-[2.5]')} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#FF0013] text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}

      {/* More Button to trigger full drawer */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl text-[#71717A] hover:text-[#000000]"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] mt-1">More</span>
      </button>
    </div>
  );
}
