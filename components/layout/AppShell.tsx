'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { UpgradeModal } from '@/components/pricing/UpgradeModal';
import { motion, AnimatePresence } from 'framer-motion';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#000000] flex">
      {/* Desktop Fixed Left Sidebar (Floating 24px off edges as in Figma layout) */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 p-4 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Slide-in Sheet) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 w-72 max-w-[85vw] h-full p-3 bg-transparent"
            >
              <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (390px screens) */}
      <MobileNav onOpenDrawer={() => setIsMobileMenuOpen(true)} />

      {/* Global Interactive Modals */}
      <GlobalSearchModal />
      <UpgradeModal />
    </div>
  );
}
