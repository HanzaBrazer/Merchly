import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'shipped'
  | 'pending'
  | 'processing'
  | 'delivered'
  | 'cancelled'
  | 'active'
  | 'vip'
  | 'inactive'
  | 'published'
  | 'draft'
  | 'hidden'
  | 'pro'
  | 'free'
  | 'business';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'in_stock', children, className, size = 'md' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    in_stock: 'bg-[#E7F4E9] text-[#0E8F21] border border-[#0E8F21]/20',
    low_stock: 'bg-[#FFF4E5] text-[#D97706] border border-[#D97706]/20',
    out_of_stock: 'bg-[#FFE6E7] text-[#FF0013] border border-[#FF0013]/20',
    shipped: 'bg-[#E7F4E9] text-[#0E8F21] border border-[#0E8F21]/20',
    pending: 'bg-[#FFF4E5] text-[#D97706] border border-[#D97706]/20',
    processing: 'bg-[#EBF2FF] text-[#0051FF] border border-[#0051FF]/20',
    delivered: 'bg-[#E7F4E9] text-[#0E8F21] border border-[#0E8F21]/20',
    cancelled: 'bg-[#FFE6E7] text-[#FF0013] border border-[#FF0013]/20',
    active: 'bg-[#E7F4E9] text-[#0E8F21] border border-[#0E8F21]/20',
    vip: 'bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1]',
    inactive: 'bg-[#F0F0F0] text-[#71717A] border border-[#D3D3D3]',
    published: 'bg-[#E7F4E9] text-[#0E8F21] border border-[#0E8F21]/20',
    draft: 'bg-[#F5F5F5] text-[#71717A] border border-[#E2E2E2]',
    hidden: 'bg-[#F0F0F0] text-[#71717A] border border-[#D3D3D3]',
    pro: 'bg-[#CE3627] text-white font-semibold',
    free: 'bg-[#F0F0F0] text-[#71717A]',
    business: 'bg-[#4A1512] text-white',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full capitalize whitespace-nowrap select-none transition-colors',
        variantStyles[variant] || 'bg-gray-100 text-gray-800',
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
