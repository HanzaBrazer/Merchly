import React from 'react';

export function Logo({ className = 'w-8 h-8', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="20" cy="20" r="18" fill="#1D4840" />
          <path
            d="M20 7C20 14.1797 14.1797 20 7 20C14.1797 20 20 25.8203 20 33C20 25.8203 25.8203 20 33 20C25.8203 20 20 14.1797 20 7Z"
            fill="#97DF68"
          />
          <circle cx="20" cy="20" r="3" fill="#1D4840" />
        </svg>
      </div>
      {showText && (
        <span className="font-semibold text-xl tracking-tight text-[#000000] font-sans">
          Merchly
        </span>
      )}
    </div>
  );
}
