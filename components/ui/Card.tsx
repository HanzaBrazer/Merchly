import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'outline' | 'interactive';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-[#E2E2E2] shadow-[0px_2px_4px_0px_rgba(39,39,39,0.05)]',
    muted: 'bg-[#F6F6F6] border border-[#E2E2E2]',
    outline: 'bg-transparent border border-[#E2E2E2]',
    interactive:
      'bg-white border border-[#E2E2E2] shadow-[0px_2px_4px_0px_rgba(39,39,39,0.05)] hover:shadow-[0px_8px_16px_0px_rgba(39,39,39,0.08)] hover:border-[#D3D3D3] transition-all cursor-pointer',
  };

  return (
    <div
      className={cn('rounded-[28px] sm:rounded-[32px] overflow-hidden', variants[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6 flex flex-col space-y-1.5', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg sm:text-xl font-bold tracking-tight text-[#000000]', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs sm:text-sm text-[#71717A]', className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6 pt-0', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 sm:p-6 pt-0 flex items-center', className)} {...props} />
  );
}
