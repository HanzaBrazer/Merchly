'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Printer,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  Truck,
  Building2,
  Barcode,
  Tag,
  Calendar,
  Check,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';

interface OrderItemProduct {
  id: string;
  name: string;
  variant: string;
  sku: string;
  image: string;
  price: string;
  qty: number;
  total: string;
}

const defaultOrderProducts: OrderItemProduct[] = [
  {
    id: 'p-1',
    name: 'Oslo Chair',
    variant: 'White',
    sku: '#302012',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&h=120&fit=crop',
    price: '1x$50',
    qty: 1,
    total: '$50',
  },
  {
    id: 'p-2',
    name: 'Oslo Chair',
    variant: 'Grey',
    sku: '#302013',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop',
    price: '1x$320',
    qty: 1,
    total: '$320',
  },
  {
    id: 'p-3',
    name: 'Oslo Chair',
    variant: 'Oak',
    sku: '#302014',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&h=120&fit=crop',
    price: '1x$180',
    qty: 1,
    total: '$180',
  },
];

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();

  const rawId = (params?.id as string) || 'C087598025';
  const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;
  const invoiceId = 'INV-23987';

  const [status, setStatus] = useState<'Pending' | 'Shipped' | 'Canceled'>('Pending');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header Row: Title, Breadcrumbs & Action Buttons (Figma Replica) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
              Order Details
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mt-1 font-normal">
              <Link href="/dashboard/orders" className="hover:text-[#000000] transition-colors">
                Order
              </Link>
              <span>/</span>
              <span className="text-[#000000]">Details</span>
              <span>/</span>
              <span className="text-[#71717A] font-mono">{orderId}</span>
            </div>
          </div>

          {/* Right Action Buttons: Status Dropdown + Print Invoice */}
          <div className="flex items-center gap-2.5">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-base text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 shadow-xs cursor-pointer select-none"
              >
                <span>{status}</span>
                <ChevronDown className="w-4 h-4 text-[#000000]" />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-2 z-30 space-y-1">
                  {(['Pending', 'Shipped', 'Canceled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setStatus(st);
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        status === st
                          ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                          : 'text-[#000000] hover:bg-[#F6F6F6]'
                      }`}
                    >
                      <span>{st}</span>
                      {status === st && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Print Invoice Red Button */}
            <Link href={`/dashboard/orders/${rawId}/invoice`}>
              <button
                type="button"
                className="h-[47px] px-5 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-base font-normal flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none"
              >
                <Printer className="w-5 h-5 text-white" />
                <span>Print Invoice</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (span 8): Metadata Strip + Order Items + Order Summary */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Metadata Strip Card (Figma Replica) */}
            <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-2">Status</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'Shipped'
                        ? 'bg-[#E7F4E9] text-[#0E8F21]'
                        : status === 'Canceled'
                        ? 'bg-[#FFE6E7] text-[#FF0013]'
                        : 'bg-[#FFF4E6] text-[#FF9500]'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-2">Date</span>
                  <span className="text-sm sm:text-base font-normal text-[#000000]">
                    Nov 4, 2025 10:41:12
                  </span>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-2">Invoice ID</span>
                  <Link
                    href={`/dashboard/orders/${rawId}/invoice`}
                    className="text-sm sm:text-base font-normal text-[#000000] hover:text-[#CE3627] underline transition-colors"
                  >
                    {invoiceId}
                  </Link>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-2">Items</span>
                  <span className="text-sm sm:text-base font-normal text-[#000000]">3 item</span>
                </div>
              </div>
            </div>

            {/* Order Items Card (Figma Replica) */}
            <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E2E2E2] shadow-sm">
              <h2 className="text-xl font-normal text-[#000000] mb-6">Order Items</h2>

              <div className="space-y-4 divide-y divide-[#E2E2E2]/60">
                {defaultOrderProducts.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-4' : ''}`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        aria-label={`Select item ${item.name}`}
                        defaultChecked
                        className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-[#F6F6F6] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-base font-normal text-[#000000] truncate">{item.name}</p>
                        <p className="text-sm text-[#A0A0A0] font-normal">{item.variant}</p>
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

                    <div className="text-left w-16">
                      <span className="text-xs text-[#A0A0A0] block">Total</span>
                      <span className="text-base font-normal text-[#000000]">{item.total}</span>
                    </div>

                    <button
                      type="button"
                      className="w-9 h-9 rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Card (Figma Replica) */}
            <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E2E2E2] shadow-sm">
              <h2 className="text-xl font-normal text-[#000000] mb-6">Order Summary</h2>

              <div className="space-y-3.5 text-base font-normal text-[#000000]">
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

                <div className="pt-4 border-t border-[#E2E2E2] flex items-center justify-between text-lg font-normal">
                  <span className="text-[#000000]">Total</span>
                  <span className="text-xl font-bold text-[#000000]">$581</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (span 4): Customer Details + Address + Shipping Information */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Customer Details Card */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E2E2E2] shadow-sm">
              <h2 className="text-xl font-normal text-[#000000] mb-5">Customer Details</h2>

              <div className="space-y-4 text-base">
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0] font-normal">Name</span>
                  <span className="text-[#000000] font-normal">Alexander</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0] font-normal">Email</span>
                  <span className="text-[#000000] font-normal">alex@email.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0A0] font-normal">Phone</span>
                  <span className="text-[#000000] font-normal">+1 (234) 5678 324</span>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E2E2E2] shadow-sm">
              <h2 className="text-xl font-normal text-[#000000] mb-5">Address</h2>

              <div className="space-y-5 text-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-[#A0A0A0] font-normal mb-1.5">
                    <MapPin className="w-4 h-4 text-[#A0A0A0]" />
                    <span>Billing Address</span>
                  </div>
                  <p className="text-[#000000] leading-relaxed font-normal">
                    123 Market Street, Central Business District Jakarta, 10210 – Indonesia
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E2E2]/60">
                  <div className="flex items-center gap-1.5 text-[#A0A0A0] font-normal mb-1.5">
                    <MapPin className="w-4 h-4 text-[#A0A0A0]" />
                    <span>Shipping Address</span>
                  </div>
                  <p className="text-[#000000] leading-relaxed font-normal">
                    45 Orchard Avenue, Downtown Singapore 238879
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information Card */}
            <div className="bg-white rounded-[32px] p-6 border border-[#E2E2E2] shadow-sm">
              <h2 className="text-xl font-normal text-[#000000] mb-5">Shipping Information</h2>

              <div className="space-y-4 text-base">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-normal">
                    <Truck className="w-4 h-4" />
                    <span>Shipping Type</span>
                  </div>
                  <span className="text-[#000000] font-normal">Reguler</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-normal">
                    <Building2 className="w-4 h-4" />
                    <span>Company</span>
                  </div>
                  <span className="text-[#000000] font-normal">DHL Express</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-normal">
                    <Barcode className="w-4 h-4" />
                    <span>Tracking Number</span>
                  </div>
                  <span className="text-[#000000] font-mono text-sm font-normal">DHL-9837124567</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-normal">
                    <Tag className="w-4 h-4" />
                    <span>Delivery Status</span>
                  </div>
                  <span className="text-[#000000] font-normal">In Transit</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-normal">
                    <Calendar className="w-4 h-4" />
                    <span>Estimated Arrival</span>
                  </div>
                  <span className="text-[#000000] font-normal">Nov 8, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-8 text-sm text-[#71717A]">
          Loading order details...
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
