'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SalesGauge } from '@/components/dashboard/SalesGauge';
import { RevenueBarChart } from '@/components/dashboard/RevenueBarChart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { ProductModal } from '@/components/products/ProductModal';
import Link from 'next/link';

export default function DashboardPage() {
  const { orders, customers, products, currentUser, setSelectedOrder, setIsNewOrderModalOpen } = useMerchly();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute live metrics
  const totalSalesCount = orders.filter((o) => o.status !== 'cancelled').length;
  const totalRevenue = orders.reduce(
    (acc, o) => (o.status !== 'cancelled' ? acc + o.total : acc),
    0
  );
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Filter recent sales
  const recentOrders = orders.slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Row: Welcome + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Raihan'}!
            </h1>
            <p className="text-sm text-[#71717A] mt-1">Here is your dashboard overview</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="text-xs sm:text-sm font-medium"
              onClick={() => {}}
            >
              <Filter className="w-4 h-4 text-[#71717A]" />
              <span>Filter</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              className="text-xs sm:text-sm font-semibold"
              onClick={() => setIsNewOrderModalOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>+ New Order</span>
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards Grid (Desktop 4 cols -> Tablet 2 cols -> Mobile 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sales"
            value="3,700"
            lastWeekValue="2,340"
            trendPercentage={7}
            isPositive={true}
            icon={<ShoppingBag className="w-5 h-5 text-[#CE3627]" />}
            infoTooltip="Total volume of sales transactions"
          />

          <MetricCard
            title="Total Customers"
            value="2,250"
            lastWeekValue="1,200"
            trendPercentage={3}
            isPositive={true}
            icon={<Users className="w-5 h-5 text-[#CE3627]" />}
            infoTooltip="Active customer base count"
          />

          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue > 0 ? totalRevenue.toLocaleString() : '7,865'}`}
            lastWeekValue="6,118"
            trendPercentage={-5}
            isPositive={false}
            icon={<DollarSign className="w-5 h-5 text-[#CE3627]" />}
            infoTooltip="Net revenue across all sales channels"
          />

          <MetricCard
            title="Total Products"
            value={totalProducts > 0 ? totalProducts : 248}
            lastWeekValue="903"
            trendPercentage={-8}
            isPositive={false}
            icon={<Package className="w-5 h-5 text-[#CE3627]" />}
            infoTooltip="Active inventory items count"
          />
        </div>

        {/* Mid Row: Sales Overview Gauge + Revenue Insights Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col">
            <SalesGauge />
          </div>
          <div className="lg:col-span-7 flex flex-col">
            <RevenueBarChart />
          </div>
        </div>

        {/* Bottom Section: Recent Sales (Responsive Table on Desktop, Cards on Mobile) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-[#000000]">Recent Sales</h3>
              <p className="text-xs text-[#71717A] mt-0.5">Real-time orders placed across channels</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-[#F6F6F6] text-xs font-semibold px-4 py-2 pr-8 rounded-full border border-[#E2E2E2] text-[#000000] focus:outline-none cursor-pointer"
                >
                  <option value="All">Categories: All</option>
                  <option value="Chair">Chair</option>
                  <option value="Table">Table</option>
                  <option value="Sofa">Sofa</option>
                  <option value="Bed">Bed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-[#CE3627]">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Table View (Hidden on mobile <768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] text-xs font-semibold text-[#71717A]">
                  <th className="py-3 px-3">Product ID</th>
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">QTY</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]/60">
                {recentOrders.map((ord) => {
                  const firstItem = ord.items[0];
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="hover:bg-[#F6F6F6] cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-mono text-xs font-medium text-[#71717A]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#000000]">
                        {firstItem?.productName || 'Custom Order'}
                        {ord.items.length > 1 && (
                          <span className="text-xs text-[#71717A] font-normal ml-1.5">
                            +{ord.items.length - 1} more
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#71717A]">
                        {ord.items.reduce((acc, i) => acc + i.qty, 0)}
                      </td>
                      <td className="py-3.5 px-3 text-[#71717A] text-xs">{ord.date}</td>
                      <td className="py-3.5 px-3 font-medium text-[#000000]">
                        {ord.customerName}
                      </td>
                      <td className="py-3.5 px-3 text-[#71717A]">${firstItem?.price || 55}</td>
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

          {/* Mobile Card View (Visible only on mobile <768px, as required by DESIGN.md) */}
          <div className="md:hidden space-y-3">
            {recentOrders.map((ord) => {
              const firstItem = ord.items[0];
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-2.5 active:bg-[#EAEAEA] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#71717A] font-semibold">
                      {ord.orderNumber}
                    </span>
                    <Badge variant={ord.status as any} size="sm">
                      {ord.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#000000]">
                      {firstItem?.productName || 'Order Items'}
                    </span>
                    <span className="font-bold text-base text-[#CE3627]">${ord.total}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#71717A] pt-2 border-t border-[#E2E2E2]/60">
                    <span>{ord.customerName}</span>
                    <span>{ord.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Modals for this Page */}
      <OrderDetailsModal />
      <NewOrderModal />
      <ProductModal />
    </AppShell>
  );
}
