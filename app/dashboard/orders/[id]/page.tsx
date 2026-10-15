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
  Copy,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { toast } from 'sonner';

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
  const [selectedItems, setSelectedItems] = useState<string[]>(['p-1', 'p-2', 'p-3']);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    toast.success(`Copied SKU ${sku} to clipboard`);
    setActiveMenuId(null);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] w-full">
        {/* Header Row: Title, Breadcrumbs & Action Buttons (Figma Replica 9:4234) */}
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
            {/* Status Dropdown Button */}
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
                        toast.success(`Order status updated to: ${st}`);
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
            <button
              type="button"
              onClick={() => router.push(`/dashboard/orders/${rawId}/invoice`)}
              className="h-[47px] px-5 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-base font-normal flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none"
            >
              <Printer className="w-5 h-5 text-white" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* 2-Column Auto-Layout: Left Main Content + Right Sidebar (Figma Replica 9:4234) */}
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          {/* Left Column: Metadata Strip + Order Items + Order Summary */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
            {/* Metadata Strip Card (Figma Replica 9:4234) */}
            <div className="bg-white rounded-full p-4 px-8 border border-[#E2E2E2]/70 shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-1">Status</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'Shipped'
                        ? 'bg-[#E7F4E9] text-[#0E8F21] border border-[#B4DCBA]'
                        : status === 'Canceled'
                        ? 'bg-[#FFE6E7] text-[#FF0013] border border-[#FFCCD0]'
                        : 'bg-[#FFF4E6] text-[#FF9500] border border-[#FFDEB0]'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-1">Date</span>
                  <span className="text-sm sm:text-base font-normal text-[#000000]">
                    Nov 4, 2025 10:41:12
                  </span>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-1">Invoice ID</span>
                  <Link
                    href={`/dashboard/orders/${rawId}/invoice`}
                    className="text-sm sm:text-base font-normal text-[#000000] hover:text-[#CE3627] underline transition-colors"
                  >
                    {invoiceId}
                  </Link>
                </div>

                <div>
                  <span className="text-sm font-normal text-[#A0A0A0] block mb-1">Items</span>
                  <span className="text-sm sm:text-base font-normal text-[#000000]">3 item</span>
                </div>
              </div>
            </div>

            {/* Order Items Card (Figma Replica) */}
            <div className="bg-white rounded-[40px] p-6 sm:p-7 border border-[#E2E2E2]/70 shadow-xs">
              <h2 className="text-xl font-medium text-[#000000] mb-6">Order Items</h2>

              <div className="space-y-4 divide-y divide-[#F5F5F5]">
                {defaultOrderProducts.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-4' : ''}`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        aria-label={`Select item ${item.name}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-[#F6F6F6] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-base font-medium text-[#000000] truncate">{item.name}</p>
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
                      <span className="text-base font-medium text-[#000000]">{item.total}</span>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="w-9 h-9 rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-2 z-30 space-y-1">
                          <button
                            type="button"
                            onClick={() => handleCopySku(item.sku)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#000000] hover:bg-[#F6F6F6] transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#71717A]" />
                            <span>Copy SKU</span>
                          </button>
                          <Link
                            href="/dashboard/products"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#000000] hover:bg-[#F6F6F6] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                            <span>View Product</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              toast.info(`Issue reported for ${item.name}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#FF0013] hover:bg-[#FFE6E7] transition-colors cursor-pointer"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-[#FF0013]" />
                            <span>Report Issue</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Card (Figma Replica) */}
            <div className="bg-white rounded-[40px] p-6 sm:p-7 border border-[#E2E2E2]/70 shadow-xs">
              <h2 className="text-xl font-medium text-[#000000] mb-6">Order Summary</h2>

              <div className="space-y-3.5 text-base font-normal text-[#000000]">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Subtotal</span>
                  <span className="font-medium">$600</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Discount</span>
                  <span className="text-[#FF0013] font-medium">-$60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Shipping</span>
                  <span className="font-medium">$12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Insurance</span>
                  <span className="font-medium">$2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Tax</span>
                  <span className="font-medium">$27</span>
                </div>
                <div className="pt-4 border-t border-[#F5F5F5] flex items-center justify-between text-lg font-medium text-[#000000]">
                  <span>Total</span>
                  <span className="text-xl font-medium text-[#000000]">$581</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details + Address + Shipping Information */}
          <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
            {/* Customer Details Card (Figma Replica) */}
            <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs space-y-4">
              <h3 className="text-xl font-medium text-[#000000]">Customer Details</h3>
              <div className="space-y-3 text-base">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Name</span>
                  <span className="font-normal text-[#000000]">Alexander</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Email</span>
                  <span className="font-normal text-[#000000]">alex@email.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Phone</span>
                  <span className="font-normal text-[#000000]">+1 (234) 5678 324</span>
                </div>
              </div>
            </div>

            {/* Address Card (Figma Replica) */}
            <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs space-y-5">
              <h3 className="text-xl font-medium text-[#000000]">Address</h3>

              {/* Billing Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#71717A] font-normal">
                  <MapPin className="w-4 h-4 text-[#71717A]" />
                  <span>Billing Address</span>
                </div>
                <p className="text-sm font-normal text-[#000000] leading-relaxed pl-6">
                  123 Market Street, Central Business District Jakarta, 10210 – Indonesia
                </p>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2 pt-3 border-t border-[#F5F5F5]">
                <div className="flex items-center gap-2 text-sm text-[#71717A] font-normal">
                  <MapPin className="w-4 h-4 text-[#71717A]" />
                  <span>Shipping Address</span>
                </div>
                <p className="text-sm font-normal text-[#000000] leading-relaxed pl-6">
                  45 Orchard Avenue, Downtown Singapore 238879
                </p>
              </div>
            </div>

            {/* Shipping Information Card (Figma Replica) */}
            <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs space-y-4">
              <h3 className="text-xl font-medium text-[#000000]">Shipping Information</h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#71717A]">
                    <Truck className="w-4 h-4" />
                    <span>Shipping Type</span>
                  </div>
                  <span className="font-normal text-[#000000]">Reguler</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#71717A]">
                    <Building2 className="w-4 h-4" />
                    <span>Company</span>
                  </div>
                  <span className="font-normal text-[#000000]">DHL Express</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#71717A]">
                    <Barcode className="w-4 h-4" />
                    <span>Tracking Number</span>
                  </div>
                  <span className="font-mono text-xs text-[#000000]">DHL-9837124567</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#71717A]">
                    <Tag className="w-4 h-4" />
                    <span>Delivery Status</span>
                  </div>
                  <span className="font-normal text-[#000000]">In Transit</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#71717A]">
                    <Calendar className="w-4 h-4" />
                    <span>Estimated Arrival</span>
                  </div>
                  <span className="font-normal text-[#000000]">Nov 8, 2025</span>
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#A0A0A0]">Loading order details...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
