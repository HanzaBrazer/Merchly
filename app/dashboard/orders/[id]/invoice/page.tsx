'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Send, Download, Printer, CheckCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Logo } from '@/components/ui/Logo';
import { toast } from 'sonner';

function OrderInvoiceContent() {
  const params = useParams();
  const rawId = (params?.id as string) || 'C087598025';
  const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;
  const invoiceId = 'INV-23987';

  const [isSent, setIsSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    toast.success('Invoice successfully sent to alex@email.com');
    setTimeout(() => setIsSent(false), 3000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Generate text invoice summary for download
    const invoiceContent = `
========================================
MERCHLY OFFICIAL INVOICE
========================================
Invoice ID: ${invoiceId}
Order ID: ${orderId}
Date: Nov 4, 2025
Company: Merchly Inc.
Address: 4350 Whiteblack Lane, Dallas Texas USA
Contact: +1 (340) 5678 324

BILL TO & SHIP TO:
Alexander
123 Market Street, Central Business District Jakarta, 10210 - Indonesia
45 Orchard Avenue, Downtown Singapore 238879

ITEMS:
- Oslo Chair (White) | SKU: #302012 | 1 x $50  = $50
- Oslo Chair (Grey)  | SKU: #302013 | 1 x $320 = $320
- Oslo Chair (Oak)   | SKU: #302014 | 1 x $180 = $180

SUMMARY:
Subtotal:   $600
Discount:   -$60
Shipping:   $12
Insurance:  $2
Tax:        $27
----------------------------------------
TOTAL:      $581
========================================
If you have questions, contact support@commerly.io
`.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Invoice ${invoiceId} downloaded successfully`);
    setTimeout(() => setIsDownloading(false), 1500);
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
      total: '$50',
    },
    {
      id: 'inv-2',
      name: 'Oslo Chair',
      variant: 'Grey',
      sku: '#302013',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop',
      price: '1x$320',
      total: '$320',
    },
    {
      id: 'inv-3',
      name: 'Oslo Chair',
      variant: 'Oak',
      sku: '#302014',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&h=120&fit=crop',
      price: '1x$180',
      total: '$180',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] w-full">
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

        {/* 2-Column Auto-Layout: Official Invoice Sheet + Action Buttons (Figma Replica 9:4437) */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Left Column: The Official Invoice Paper Document */}
          <div className="flex-1 min-w-0 bg-white rounded-[40px] p-8 sm:p-12 border border-[#E2E2E2]/70 shadow-xs print:p-0 print:border-none print:shadow-none w-full">
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

            <div className="h-px bg-[#F0F0F0] my-6" />

            {/* Bill To, Ship To, and Invoice Metadata Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 py-2">
              {/* Bill to */}
              <div className="space-y-1.5">
                <span className="text-sm font-normal text-[#A0A0A0] block">Bill to</span>
                <p className="text-base font-medium text-[#000000]">Alexander</p>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  123 Market Street, Central Business District Jakarta, 10210 – Indonesia
                </p>
              </div>

              {/* Ship to */}
              <div className="space-y-1.5">
                <span className="text-sm font-normal text-[#A0A0A0] block">Ship to</span>
                <p className="text-base font-medium text-[#000000]">Alexander</p>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  45 Orchard Avenue, Downtown Singapore 238879
                </p>
              </div>

              {/* Invoice Metadata (ID, Order ID, Date) */}
              <div className="space-y-2.5 sm:text-right">
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-[#A0A0A0]">Invoice ID</span>
                  <span className="text-base font-medium text-[#000000]">{invoiceId}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-[#A0A0A0]">Order ID</span>
                  <span className="text-base font-medium text-[#000000]">{orderId}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-[#A0A0A0]">Date</span>
                  <span className="text-base font-medium text-[#000000]">Nov 4, 2025</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#F0F0F0] my-6" />

            {/* Order Items Table in Invoice */}
            <div className="py-2">
              <h3 className="text-lg font-medium text-[#000000] mb-4">Order Items</h3>

              <div className="divide-y divide-[#F5F5F5]">
                {invoiceItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#F6F6F6] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-base font-medium text-[#000000] truncate">{item.name}</p>
                        <p className="text-sm text-[#A0A0A0] font-normal">{item.variant}</p>
                      </div>
                    </div>

                    <div className="text-left w-24">
                      <span className="text-xs text-[#A0A0A0] block">SKU</span>
                      <span className="text-sm text-[#000000] font-mono">{item.sku}</span>
                    </div>

                    <div className="text-left w-20">
                      <span className="text-xs text-[#A0A0A0] block">Price</span>
                      <span className="text-sm text-[#000000]">{item.price}</span>
                    </div>

                    <div className="text-right w-20">
                      <span className="text-xs text-[#A0A0A0] block">Total</span>
                      <span className="text-base font-medium text-[#000000]">{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#F0F0F0] my-6" />

            {/* Financial Summary (Right Aligned matching Figma) */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-3 text-base">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Subtotal</span>
                  <span className="font-medium text-[#000000]">$600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Discount</span>
                  <span className="text-[#FF0013] font-medium">-$60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Shipping</span>
                  <span className="font-medium text-[#000000]">$12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Insurance</span>
                  <span className="font-medium text-[#000000]">$2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Tax</span>
                  <span className="font-medium text-[#000000]">$27</span>
                </div>
                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-lg font-medium text-[#000000]">
                  <span>Total</span>
                  <span className="text-xl font-medium text-[#000000]">$581</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#F0F0F0] my-8" />

            {/* Footer Support Text */}
            <div className="text-center text-sm text-[#A0A0A0] font-normal pt-2">
              If you have any questions, please contact us at{' '}
              <a href="mailto:support@commerly.io" className="text-[#CE3627] hover:underline">
                support@commerly.io
              </a>
            </div>
          </div>

          {/* Right Column: 3 Action Pill Buttons (Figma Replica 9:4437) */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3.5 print:hidden">
            {/* Send Invoice Primary Pill Button */}
            <button
              type="button"
              onClick={handleSend}
              className="w-full h-12 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors flex items-center justify-center gap-2 text-base font-normal shadow-xs cursor-pointer select-none"
            >
              <Send className="w-4 h-4 text-white" />
              <span>{isSent ? 'Invoice Sent!' : 'Send Invoice'}</span>
            </button>

            {/* Download Invoice Outline Pill Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full h-12 rounded-full border border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center justify-center gap-2 text-base font-normal shadow-xs cursor-pointer select-none"
            >
              <Download className="w-4 h-4 text-[#000000]" />
              <span>{isDownloading ? 'Downloading...' : 'Download Invoice'}</span>
            </button>

            {/* Print Invoice Outline Pill Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full h-12 rounded-full border border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center justify-center gap-2 text-base font-normal shadow-xs cursor-pointer select-none"
            >
              <Printer className="w-4 h-4 text-[#000000]" />
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#A0A0A0]">Loading invoice...</div>}>
      <OrderInvoiceContent />
    </Suspense>
  );
}
