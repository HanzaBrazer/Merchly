import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'mint' | 'outline' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#1D4840]/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-[#1D4840] text-white hover:bg-[#163731] shadow-sm',
      mint: 'bg-[#97DF68] text-[#1D4840] hover:bg-[#85cc57] font-semibold shadow-sm',
      outline: 'border border-[#E2E2E2] bg-white text-[#000000] hover:bg-[#F6F6F6] hover:border-[#D3D3D3]',
      secondary: 'bg-[#F0F0F0] text-[#000000] hover:bg-[#E5E5E5]',
      danger: 'bg-[#FFE6E7] text-[#FF0013] hover:bg-[#FFD4D6] border border-[#FF0013]/20',
      ghost: 'bg-transparent text-[#71717A] hover:text-[#000000] hover:bg-black/5',
    };

    const sizes = {
      sm: 'text-xs h-9 px-3.5 gap-1.5',
      md: 'text-sm min-h-[44px] px-5 gap-2',
      lg: 'text-base min-h-[48px] px-6 gap-2.5',
      icon: 'min-h-[40px] min-w-[40px] h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
