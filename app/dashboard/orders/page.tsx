'use client';

import React, { useState } from 'react';
import {
  Package,
  TrendingDown,
  Clock,
  MapPin,
  Search,
  Plus,
  ChevronDown,
  Truck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMerchly } from '@/lib/store';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { OrderStatus } from '@/lib/types';
import Link from 'next/link';

export default function OrdersPage() {
  const { orders, setSelectedOrder, setIsNewOrderModalOpen } = useMerchly();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status counts
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const canceledCount = orders.filter((o) => o.status === 'cancelled').length;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Orders
            </h1>
            <p className="text-sm text-[#71717A] mt-1">View, process, and fulfill customer orders.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/track" target="_blank">
              <Button variant="outline" size="md" className="text-xs sm:text-sm">
                <Truck className="w-4 h-4 text-[#71717A]" />
                <span>Public Tracking</span>
              </Button>
            </Link>

            <Button
              variant="mint"
              size="md"
              className="text-xs sm:text-sm font-semibold"
              onClick={() => setIsNewOrderModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>+ New Order</span>
            </Button>
          </div>
        </div>

        {/* Top 4 Logistics KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Orders */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <Package className="w-5 h-5" />
              </div>
              <span>Total Orders</span>
            </div>
            <div className="my-1">
              <span className="text-3xl sm:text-4xl font-bold text-[#000000]">432,500</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#0E8F21] font-semibold">
              <span>↑ 7%</span>
              <span className="text-[#71717A] font-normal">From last month</span>
            </div>
          </div>

          {/* Card 2: Order Volume Growth */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span>Order Volume Growth</span>
            </div>
            <div className="my-1">
              <span className="text-3xl sm:text-4xl font-bold text-[#000000]">-2%</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#71717A]">
              <span>Last week:</span>
              <span className="font-semibold text-[#000000]">754</span>
              <span className="text-[#FF0013] font-semibold ml-auto">↓ 7%</span>
            </div>
          </div>

          {/* Card 3: Average Delivery Time */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <Clock className="w-5 h-5" />
              </div>
              <span>Average Delivery Time</span>
            </div>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-[#000000]">4.1</span>
              <span className="text-sm font-medium text-[#71717A]">days</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#71717A]">
              <span>Last week:</span>
              <span className="font-semibold text-[#000000]">4.8</span>
              <span className="text-[#0E8F21] font-semibold ml-auto">↑ 3%</span>
            </div>
          </div>

          {/* Card 4: Average Shipping Distance */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <MapPin className="w-5 h-5" />
              </div>
              <span>Average Shipping Distance</span>
            </div>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-[#000000]">481</span>
              <span className="text-sm font-medium text-[#71717A]">miles</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#0E8F21] font-semibold">
              <span>↑ 2%</span>
              <span className="text-[#71717A] font-normal">From yesterday</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution Pipeline (Figma Replica) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            <div>
              <span className="text-xs text-[#71717A] font-medium block">Pending Orders</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#000000]">
                  {pendingCount > 0 ? pendingCount * 120 + 20 : 720}
                </span>
                <span className="text-xs font-semibold text-[#0E8F21]">↑ 3% from yesterday</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#71717A] font-medium block">Shipped Orders</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#000000]">
                  {shippedCount > 0 ? shippedCount * 180 + 35 : 985}
                </span>
                <span className="text-xs font-semibold text-[#FF0013]">↓ 8% from yesterday</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#71717A] font-medium block">Canceled Orders</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-[#000000]">
                  {canceledCount > 0 ? canceledCount * 4 : 24}
                </span>
                <span className="text-xs font-semibold text-[#0E8F21]">↑ 3% from yesterday</span>
              </div>
            </div>
          </div>

          {/* Striped segmented progress bar (Figma Replica) */}
          <div className="w-full h-4 rounded-full bg-[#F6F6F6] p-0.5 flex gap-1 overflow-hidden">
            <div
              className="h-full bg-[#FF9900] rounded-l-full transition-all"
              style={{ width: '42%' }}
              title="Pending (42%)"
            />
            <div
              className="h-full bg-[#97DF68] transition-all"
              style={{ width: '54%' }}
              title="Shipped (54%)"
            />
            <div
              className="h-full bg-[#FF0013] rounded-r-full transition-all"
              style={{ width: '4%' }}
              title="Canceled (4%)"
            />
          </div>

          {/* Bar Legend */}
          <div className="flex items-center gap-6 mt-3 text-xs font-medium text-[#71717A]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#97DF68]" />
              <span>Shipped</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF0013]" />
              <span>Canceled</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Master List */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
          {/* Controls: Search + Status Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order ID, customer or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E2E2E2] text-xs sm:text-sm focus:outline-none focus:border-[#1D4840] bg-[#F6F6F6]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-[#1D4840] text-white shadow-xs'
                      : 'bg-[#F6F6F6] text-[#71717A] hover:text-[#000000]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Orders Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] text-xs font-semibold text-[#71717A]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Order Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]/60">
                {filteredOrders.map((ord) => {
                  const firstItem = ord.items[0];
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="hover:bg-[#F6F6F6] cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-mono text-xs font-semibold text-[#000000]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-[#71717A]">{ord.date}</td>
                      <td className="py-3.5 px-3 font-medium text-[#000000]">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              ord.customerAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                            }
                            alt={ord.customerName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{ord.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-[#E2E2E2]">
                            {firstItem?.imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={firstItem.imageUrl}
                                alt={firstItem.productName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium text-[#000000]">
                            {firstItem?.productName || 'Custom'}
                          </span>
                          {ord.items.length > 1 && (
                            <span className="text-[11px] font-semibold bg-[#E8EDEC] text-[#1D4840] px-1.5 py-0.5 rounded-md">
                              +{ord.items.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#000000]">${ord.total}</td>
                      <td className="py-3.5 px-3 text-right">
                        <Badge variant={ord.status as any} size="sm">
                          {ord.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Card View (<768px, as required by DESIGN.md) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((ord) => {
              const firstItem = ord.items[0];
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-2.5 active:bg-[#EAEAEA] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          ord.customerAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                        }
                        alt={ord.customerName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-xs text-[#000000]">{ord.customerName}</span>
                    </div>
                    <Badge variant={ord.status as any} size="sm">
                      {ord.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#71717A]">{ord.orderNumber}</span>
                    <span className="font-bold text-base text-[#1D4840]">${ord.total}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#71717A] pt-2 border-t border-[#E2E2E2]/60">
                    <span>{firstItem?.productName || 'Order'}</span>
                    <span>{ord.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <OrderDetailsModal />
      <NewOrderModal />
    </AppShell>
  );
}
