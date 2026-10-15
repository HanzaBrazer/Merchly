'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMerchly } from '@/lib/store';

export default function PublicTrackingPage() {
  const { orders } = useMerchly();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const normalized = searchCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === normalized ||
        o.orderNumber.toLowerCase() === `#${normalized}` ||
        o.trackingNumber?.toLowerCase() === normalized
    );

    setSearchedOrder(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#000000] flex flex-col justify-between">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E2E2E2] px-6 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs">
            Merchant Dashboard
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#CE3627] bg-[#FEF1ED] border border-[#F7D7D1] px-3 py-1 rounded-full uppercase tracking-wider">
            Public Tracking Portal
          </span>
          <h1 className="text-3xl font-extrabold text-[#000000] mt-3">Track Your Order</h1>
          <p className="text-sm text-[#71717A] mt-1">
            Enter your Order ID (e.g. #C0875) or Tracking Code to view live shipping status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center gap-2 p-2 bg-white rounded-full border border-[#E2E2E2] shadow-sm">
            <Search className="w-5 h-5 text-[#A0A0A0] ml-3 shrink-0" />
            <input
              type="text"
              placeholder="e.g. #C0875 or TRK-98234710"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full px-2 py-2 text-sm bg-transparent focus:outline-none text-[#000000]"
              autoFocus
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0 font-bold px-6">
              Track
            </Button>
          </div>
        </form>

        {/* Results Card */}
        {searched && (
          <div>
            {searchedOrder ? (
              <div className="bg-white rounded-3xl p-6 border border-[#E2E2E2] shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E2]">
                  <div>
                    <span className="text-xs text-[#71717A]">Order Number</span>
                    <h3 className="text-xl font-bold text-[#000000]">{searchedOrder.orderNumber}</h3>
                  </div>
                  <Badge variant={searchedOrder.status} size="md">
                    {searchedOrder.status}
                  </Badge>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#CE3627] text-white flex items-center justify-center mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-black">Order Placed</span>
                    <span className="text-[10px] text-gray-500">{searchedOrder.date}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered'
                          ? 'bg-[#CE3627] text-white'
                          : 'bg-[#E2E2E2] text-gray-400'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-black">In Transit</span>
                    <span className="text-[10px] text-gray-500">
                      {searchedOrder.trackingNumber || 'Processing'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        searchedOrder.status === 'delivered'
                          ? 'bg-[#0E8F21] text-white'
                          : 'bg-[#E2E2E2] text-gray-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-black">Delivered</span>
                    <span className="text-[10px] text-gray-500">
                      {searchedOrder.status === 'delivered' ? 'Signed & Received' : 'Estimated 2-3 days'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 rounded-2xl bg-[#F6F6F6] space-y-2">
                  <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block">
                    Package Contents
                  </span>
                  {searchedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#000000]">
                        {item.qty}x {item.productName}
                      </span>
                      <span className="font-bold text-[#000000]">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Destination */}
                <div className="flex items-start gap-2.5 text-xs text-[#71717A]">
                  <MapPin className="w-4 h-4 text-[#CE3627] shrink-0 mt-0.5" />
                  <span>
                    Delivering to: <b className="text-black">{searchedOrder.shippingAddress}</b>
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-[#E2E2E2] text-center">
                <Package className="w-10 h-10 text-[#A0A0A0] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#000000]">No order found</h4>
                <p className="text-xs text-[#71717A] mt-1">
                  We couldn&apos;t locate an order matching &ldquo;{searchCode}&rdquo;. Please verify your tracking
                  code or contact merchant support.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-[#71717A] border-t border-[#E2E2E2] bg-white">
        Powered by Merchly Retail Management System • Track live logistics
      </footer>
    </div>
  );
}
