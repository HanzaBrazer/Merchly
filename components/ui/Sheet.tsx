'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: 'left' | 'right' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  side = 'bottom',
  children,
  className,
}: SheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  const sideStyles = {
    left: 'fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] rounded-r-[32px] h-full',
    right: 'fixed top-0 bottom-0 right-0 w-96 max-w-[90vw] rounded-l-[32px] h-full',
    bottom:
      'fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[32px] overflow-y-auto w-full max-w-2xl mx-auto',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer / Sheet Surface */}
          <motion.div
            initial={slideVariants[side].initial}
            animate={slideVariants[side].animate}
            exit={slideVariants[side].exit}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'relative z-10 bg-white border border-[#E2E2E2] shadow-2xl p-6 text-left flex flex-col',
              sideStyles[side],
              className
            )}
          >
            {/* Grab Handle for bottom sheet */}
            {side === 'bottom' && (
              <div className="w-12 h-1.5 bg-[#D3D3D3] rounded-full mx-auto mb-4 shrink-0" />
            )}

            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between mb-5 gap-4 shrink-0">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold tracking-tight text-[#000000]">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F6F6F6] hover:bg-[#EAEAEA] text-[#71717A] hover:text-[#000000] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  aria-label="Close sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sheet Body Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
