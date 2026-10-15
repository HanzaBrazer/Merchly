import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'ghost'
    | 'text'
    | 'link'
    | 'accent'
    | 'mint';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex flex-row items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#CE3627]/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer whitespace-nowrap';

    const variants = {
      primary: 'bg-[#CE3627] text-white hover:bg-[#B72E20] shadow-sm font-semibold',
      secondary: 'bg-[#F6F6F6] text-[#000000] hover:bg-[#EAEAEA] border border-[#E2E2E2]',
      accent: 'bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] hover:bg-[#FDE2D9] font-semibold shadow-xs',
      mint: 'bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] hover:bg-[#FDE2D9] font-semibold shadow-xs',
      outline: 'border border-[#E2E2E2] bg-white text-[#000000] hover:bg-[#F6F6F6] hover:border-[#D3D3D3]',
      danger: 'bg-[#FF0013] text-white hover:bg-[#D90011] shadow-sm',
      ghost: 'bg-transparent text-[#71717A] hover:text-[#000000] hover:bg-black/5',
      text: 'bg-transparent text-[#000000] hover:text-[#CE3627] p-0 h-auto rounded-none',
      link: 'bg-transparent text-[#CE3627] hover:underline p-0 h-auto rounded-none',
    };

    const sizes = {
      sm: 'text-xs h-9 px-4 gap-1.5',
      md: 'text-sm min-h-[44px] h-[44px] px-5 gap-2',
      lg: 'text-base min-h-[48px] h-[48px] px-6 gap-2.5',
      icon: 'min-h-[40px] min-w-[40px] h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!isLoading && leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
