'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Send, Download, Printer, CheckCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Logo } from '@/components/ui/Logo';

function OrderInvoiceContent() {
  const params = useParams();
  const rawId = (params?.id as string) || 'C087598025';
  const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;
  const invoiceId = 'INV-23987';

  const [isSent, setIsSent] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const invoiceItems = [
    {
      id: 'inv-1',
      name: 'Oslo Chair',
      variant: 'White',
      sku: '#302012',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&h=120&fit=crop',
      price: '1x$50',
      total: '$100',
    },
    {
      id: 'inv-2',
      name: 'Oslo Chair',
      variant: 'White',
      sku: '#302013',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop',
      price: '1x$320',
      total: '$320',
    },
    {
      id: 'inv-3',
      name: 'Oslo Chair',
      variant: 'White',
      sku: '#302014',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&h=120&fit=crop',
      price: '1x$180',
      total: '$180',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header Row: Title & Breadcrumbs */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
            {invoiceId}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mt-1 font-normal">
            <Link href="/dashboard/orders" className="hover:text-[#000000] transition-colors">
              Order
            </Link>
            <span>/</span>
            <Link href={`/dashboard/orders/${rawId}`} className="hover:text-[#000000] transition-colors">
              Invoice
            </Link>
            <span>/</span>
            <span className="text-[#71717A] font-mono">{invoiceId}</span>
          </div>
        </div>

        {/* 2-Column Grid Layout: Official Invoice Sheet + Action Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (span 8): The Official Invoice Paper Document (Figma Replica 9:4437) */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-8 sm:p-10 border border-[#E2E2E2] shadow-sm print:p-0 print:border-none print:shadow-none">
            {/* Invoice Top Header: Brand + Company Address */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6">
              <div className="flex items-center gap-3">
                <Logo showText={true} />
              </div>

              <div className="text-sm text-[#71717A] sm:text-right font-normal space-y-0.5">
                <p>4350 Whiteblack Lane</p>
                <p>Dallas Texas USA</p>
                <p>+1 (340) 5678 324</p>
              </div>
            </div>

            <div className="border-t border-[#E2E2E2] my-6" />

            {/* Bill to / Ship to / Invoice Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              {/* Bill to */}
              <div>
                <span className="text-xs text-[#A0A0A0] font-normal block mb-1.5">Bill to</span>
                <p className="font-semibold text-base text-[#000000] mb-1">Alexander</p>
                <p className="text-sm text-[#71717A] font-normal leading-relaxed">
                  123 Market Street, Central Business District Jakarta, 10210 – Indonesia
                </p>
              </div>

              {/* Ship to */}
              <div>
                <span className="text-xs text-[#A0A0A0] font-normal block mb-1.5">Ship to</span>
                <p className="font-semibold text-base text-[#000000] mb-1">Alexander</p>
                <p className="text-sm text-[#71717A] font-normal leading-relaxed">
                  45 Orchard Avenue, Downtown Singapore 238879
                </p>
              </div>

              {/* Invoice Meta Table */}
              <div className="sm:text-right space-y-2">
                <div className="flex sm:justify-end gap-3 text-sm">
                  <span className="text-[#A0A0A0]">Invoice ID</span>
                  <span className="text-[#000000] font-semibold">{invoiceId}</span>
                </div>
                <div className="flex sm:justify-end gap-3 text-sm">
                  <span className="text-[#A0A0A0]">Order ID</span>
                  <span className="text-[#000000] font-semibold font-mono">{orderId}</span>
                </div>
                <div className="flex sm:justify-end gap-3 text-sm">
                  <span className="text-[#A0A0A0]">Date</span>
                  <span className="text-[#000000] font-normal">Nov 4, 2025</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E2E2] my-6" />

            {/* Order Items Table */}
            <div>
              <h2 className="text-lg font-normal text-[#000000] mb-4">Order Items</h2>

              <div className="space-y-4 divide-y divide-[#E2E2E2]/60">
                {invoiceItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-4' : ''}`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#F6F6F6] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-base font-normal text-[#000000] truncate">{item.name}</p>
                        <p className="text-xs text-[#A0A0A0] font-normal">{item.variant}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-left w-24">
                      <span className="text-xs text-[#A0A0A0] block">SKU</span>
                      <span className="text-sm text-[#000000] font-mono">{item.sku}</span>
                    </div>

                    <div className="text-left w-20">
                      <span className="text-xs text-[#A0A0A0] block">Price</span>
                      <span className="text-sm text-[#000000]">{item.price}</span>
                    </div>

                    <div className="text-right w-16">
                      <span className="text-xs text-[#A0A0A0] block">Total</span>
                      <span className="text-base font-normal text-[#000000]">{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E2E2E2] my-6" />

            {/* Summary Table: Right-Aligned (Figma Replica) */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-3 text-sm font-normal text-[#000000]">
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0]">Subtotal</span>
                  <span>$600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0]">Discount</span>
                  <span>-$60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0]">Shipping</span>
                  <span>$12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0]">Insurance</span>
                  <span>$2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0]">Tax</span>
                  <span>$27</span>
                </div>

                <div className="pt-3 border-t border-[#E2E2E2] flex items-center justify-between text-base font-normal">
                  <span className="font-semibold text-[#000000]">Total</span>
                  <span className="text-xl font-bold text-[#000000]">$581</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E2E2] my-8" />

            {/* Document Footer Note */}
            <p className="text-center text-xs text-[#A0A0A0] font-normal">
              If you have any questions, please contact us at support@commerly.io
            </p>
          </div>

          {/* Right Column (span 4): 3 Action Buttons (Figma Replica) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 sticky top-24 print:hidden">
            {/* 1. Send Invoice */}
            <button
              type="button"
              onClick={handleSend}
              className="h-[47px] w-full rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-base font-normal flex items-center justify-center gap-2.5 shadow-xs cursor-pointer select-none"
            >
              {isSent ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Invoice Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-white" />
                  <span>Send Invoice</span>
                </>
              )}
            </button>

            {/* 2. Download Invoice */}
            <button
              type="button"
              onClick={handleDownload}
              className="h-[47px] w-full rounded-full border border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6] transition-colors text-base font-normal flex items-center justify-center gap-2.5 shadow-xs cursor-pointer select-none"
            >
              {isDownloaded ? (
                <>
                  <CheckCircle className="w-5 h-5 text-[#0E8F21]" />
                  <span>Downloaded PDF</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-[#000000]" />
                  <span>Download Invoice</span>
                </>
              )}
            </button>

            {/* 3. Print Invoice */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-[47px] w-full rounded-full border border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6] transition-colors text-base font-normal flex items-center justify-center gap-2.5 shadow-xs cursor-pointer select-none"
            >
              <Printer className="w-5 h-5 text-[#000000]" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function OrderInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-8 text-sm text-[#71717A]">
          Loading invoice...
        </div>
      }
    >
      <OrderInvoiceContent />
    </Suspense>
  );
}
