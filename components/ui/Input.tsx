import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'pill' | 'rounded';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'pill',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#000000] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 flex items-center pointer-events-none text-[#A0A0A0]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-sm text-[#000000] placeholder:text-[#A0A0A0] border border-[#E8E8E8] transition-all duration-150',
              'focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20',
              'disabled:bg-[#F6F6F6] disabled:text-[#A0A0A0] disabled:cursor-not-allowed',
              variant === 'pill' ? 'rounded-full h-[44px]' : 'rounded-2xl h-[44px]',
              leftIcon ? 'pl-11' : 'px-4',
              rightIcon ? 'pr-11' : 'px-4',
              error && 'border-[#FF0013] focus:border-[#FF0013] focus:ring-[#FF0013]/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 flex items-center text-[#A0A0A0]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-[#FF0013] font-medium mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#71717A] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
