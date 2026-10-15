'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Package, Truck, CheckCircle2, MapPin, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMerchly } from '@/lib/store';

function TrackingContent() {
  const params = useParams();
  const id = params?.id as string;
  const { orders } = useMerchly();

  const normalized = id ? id.toLowerCase().replace('#', '') : '';
  const order = orders.find(
    (o) =>
      o.id.toLowerCase() === normalized ||
      o.orderNumber.toLowerCase().replace('#', '') === normalized ||
      o.trackingNumber?.toLowerCase() === normalized
  );

  return (
    <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 my-8">
      {order ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E2]">
            <div>
              <span className="text-xs text-[#71717A]">Order ID</span>
              <h2 className="text-2xl font-bold text-[#000000]">{order.orderNumber}</h2>
            </div>
            <Badge variant={order.status as any} size="md">
              {order.status}
            </Badge>
          </div>

          {/* Tracking Steps */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#CE3627] text-white flex items-center justify-center mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-black">Order Placed</span>
              <span className="text-[10px] text-gray-500">{order.date}</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  order.status === 'shipped' || order.status === 'delivered'
                    ? 'bg-[#CE3627] text-white'
                    : 'bg-[#E2E2E2] text-gray-400'
                }`}
              >
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-black">In Transit</span>
              <span className="text-[10px] text-gray-500">
                {order.trackingNumber || 'Awaiting dispatch'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  order.status === 'delivered'
                    ? 'bg-[#0E8F21] text-white'
                    : 'bg-[#E2E2E2] text-gray-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-black">Delivered</span>
              <span className="text-[10px] text-gray-500">
                {order.status === 'delivered' ? 'Completed' : 'Estimated 2-3 days'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F6F6] space-y-2">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block">
              Products in this shipment
            </span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#000000]">
                  {item.qty}x {item.productName}
                </span>
                <span className="font-bold text-[#000000]">${item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#71717A]">
            <MapPin className="w-4 h-4 text-[#CE3627] shrink-0 mt-0.5" />
            <span>
              Shipping Address: <b className="text-black">{order.shippingAddress}</b>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#E2E2E2] text-center">
          <Package className="w-12 h-12 text-[#A0A0A0] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#000000]">Order Not Found</h3>
          <p className="text-xs text-[#71717A] mt-1 mb-6">
            Could not find order ID &ldquo;{id}&rdquo;. Please verify your tracking number.
          </p>
          <Link href="/track">
            <Button variant="primary" size="md">
              Search Again
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}

export default function DirectTrackingPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#000000] flex flex-col justify-between">
      <header className="h-16 bg-white border-b border-[#E2E2E2] px-6 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/track">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Track Another Order
          </Button>
        </Link>
      </header>

      <Suspense fallback={<div className="p-8 text-center text-sm text-[#71717A]">Loading order status...</div>}>
        <TrackingContent />
      </Suspense>

      <footer className="text-center py-6 text-xs text-[#71717A] border-t border-[#E2E2E2] bg-white">
        Powered by Merchly Retail Management System • Track live logistics
      </footer>
    </div>
  );
}
