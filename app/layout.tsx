import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MerchlyProvider } from '@/lib/store';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Merchly — All-in-One E-Commerce Operations & Analytics Platform',
  description:
    'Manage products, inventory, orders, customers, and business analytics in real-time from a single modern workspace.',
  keywords: ['e-commerce management', 'retail dashboard', 'inventory management', 'saas', 'orders fulfillment'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-[#F6F6F6] text-[#000000] selection:bg-[#FEF1ED] selection:text-[#CE3627]">
        <MerchlyProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                borderRadius: '16px',
                border: '1px solid #E2E2E2',
                fontFamily: 'var(--font-geist-sans)',
              },
            }}
          />
        </MerchlyProvider>
      </body>
    </html>
  );
}
