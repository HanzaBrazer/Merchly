'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Filter,
  LayoutGrid,
  ChevronDown,
  Search,
  Plus,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SalesGauge } from '@/components/dashboard/SalesGauge';
import { RevenueBarChart } from '@/components/dashboard/RevenueBarChart';
import { AdjustWidgetModal } from '@/components/dashboard/AdjustWidgetModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { ProductModal } from '@/components/products/ProductModal';

// Initial Figma Mockup Rows (from Node 49:13264)
const figmaMockOrders = [
  {
    id: 'f-1',
    orderNumber: '#P08652',
    productName: 'Bergen Table',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'Michelle',
    price: '$10',
    total: '$20',
    status: 'shipped' as const,
  },
  {
    id: 'f-2',
    orderNumber: '#P08653',
    productName: 'Chair',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'John',
    price: '$10',
    total: '$20',
    status: 'cancelled' as const,
  },
  {
    id: 'f-3',
    orderNumber: '#P08654',
    productName: 'Oslo Chair',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'Alex',
    price: '$10',
    total: '$20',
    status: 'pending' as const,
  },
];

export default function DashboardPage() {
  const { orders, currentUser, setSelectedOrder, setIsNewOrderModalOpen } = useMerchly();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdjustWidgetOpen, setIsAdjustWidgetOpen] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useState({
    metrics: true,
    salesGauge: true,
    revenueChart: true,
    recentSales: true,
  });

  const handleToggleWidget = (key: keyof typeof widgetVisibility) => {
    setWidgetVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ownerName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Raihan';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Row: Welcome + Action Buttons (Figma Node 49:13312) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
              Welcome back, {ownerName}!
            </h1>
            <p className="text-base text-[#A0A0A0] mt-1 font-normal">
              Here are your dashboard overview
            </p>
          </div>

          {/* CTA Buttons: Exact replication of Figma Node 49:13316 */}
          <div className="flex items-center gap-2.5">
            {/* Filter Pill Button */}
            <button
              type="button"
              className="h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-base text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none"
            >
              <Filter className="w-5 h-5 text-[#000000]" />
              <span>Filter</span>
            </button>

            {/* Adjust Widget Pill Button */}
            <button
              type="button"
              onClick={() => setIsAdjustWidgetOpen(true)}
              className="h-[47px] px-5 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-base font-normal flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none"
            >
              <LayoutGrid className="w-5 h-5 text-white" />
              <span>Adjust Widget</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards (Figma Node 49:13250) */}
        {widgetVisibility.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Sales"
              value="3,700"
              lastWeekValue="2,340"
              trendPercentage={7}
              isPositive={true}
              icon={<ShoppingCart className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Total volume of sales transactions"
            />

            <MetricCard
              title="Total Customers"
              value="2,250"
              lastWeekValue="1,200"
              trendPercentage={3}
              isPositive={true}
              icon={<Users className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Active customer base count"
            />

            <MetricCard
              title="Total Revenue"
              value="$7,865"
              lastWeekValue="6,118"
              trendPercentage={-5}
              isPositive={false}
              icon={<DollarSign className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Net revenue across all sales channels"
            />

            <MetricCard
              title="Total Products"
              value="248"
              lastWeekValue="903"
              trendPercentage={-8}
              isPositive={false}
              icon={<Package className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Active inventory items count"
            />
          </div>
        )}

        {/* Mid Row: Sales Overview Gauge + Revenue Insights Bar Chart */}
        {(widgetVisibility.salesGauge || widgetVisibility.revenueChart) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {widgetVisibility.salesGauge && (
              <div
                className={`${
                  widgetVisibility.revenueChart ? 'lg:col-span-5' : 'lg:col-span-12'
                } flex flex-col`}
              >
                <SalesGauge />
              </div>
            )}
            {widgetVisibility.revenueChart && (
              <div
                className={`${
                  widgetVisibility.salesGauge ? 'lg:col-span-7' : 'lg:col-span-12'
                } flex flex-col`}
              >
                <RevenueBarChart />
              </div>
            )}
          </div>
        )}

        {/* Bottom Section: Recent Sales (Figma Node 49:13258) */}
        {widgetVisibility.recentSales && (
          <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm">
            {/* Header with Title and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-normal text-[#000000]">Recent Sales</h3>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Icon */}
                <button
                  type="button"
                  aria-label="Search recent sales"
                  className="w-11 h-11 rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center text-[#000000] hover:bg-[#F6F6F6] transition-colors shadow-xs"
                >
                  <Search className="w-5 h-5 text-[#000000]" />
                </button>

                {/* Categories Dropdown Pill */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none h-11 px-5 pr-9 bg-white text-base font-normal rounded-full border border-[#E8E8E8] text-[#000000] focus:outline-none cursor-pointer shadow-xs"
                  >
                    <option value="All">Categories</option>
                    <option value="Table">Table</option>
                    <option value="Chair">Chair</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#000000] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Filter Pill */}
                <button
                  type="button"
                  className="h-11 px-5 rounded-full border border-[#E8E8E8] bg-white text-base font-normal text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Filter className="w-4 h-4 text-[#000000]" />
                  <span>Filter</span>
                </button>

                {/* + New Order Action */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="h-11 px-5 rounded-full text-sm font-semibold shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Order</span>
                </Button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F6F6] rounded-full text-sm font-normal text-[#A0A0A0]">
                    <th className="py-4 px-4 rounded-l-full w-12 text-center">
                      <input
                        type="checkbox"
                        aria-label="Select all orders"
                        className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4">Product ID</th>
                    <th className="py-4 px-4">Product Name</th>
                    <th className="py-4 px-4">QTY</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Total</th>
                    <th className="py-4 px-4 rounded-r-full text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2E2]/50 text-sm">
                  {/* Primary Mockup Orders from Figma Frame */}
                  {figmaMockOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-[#F6F6F6]/60 transition-colors cursor-pointer"
                      onClick={() => {
                        const dynamicMatch = orders.find((o) => o.id === ord.id);
                        if (dynamicMatch) setSelectedOrder(dynamicMatch);
                      }}
                    >
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select order ${ord.orderNumber}`}
                          className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4 font-normal text-[#000000]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-4 font-normal text-[#000000]">
                        {ord.productName}
                      </td>
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.qty}</td>
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.date}</td>
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.customer}</td>
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.price}</td>
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.total}</td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal capitalize ${
                            ord.status === 'shipped'
                              ? 'bg-[#E7F4E9] text-[#0E8F21]'
                              : ord.status === 'cancelled'
                              ? 'bg-[#FFE6E7] text-[#FF0013]'
                              : 'bg-[#FFF4E6] text-[#FF9500]'
                          }`}
                        >
                          {ord.status === 'shipped'
                            ? 'Shipped'
                            : ord.status === 'cancelled'
                            ? 'Canceled'
                            : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Real-time Dynamic Orders from Store (if created by user) */}
                  {orders
                    .filter((o) => !figmaMockOrders.some((f) => f.id === o.id))
                    .slice(0, 4)
                    .map((ord) => {
                      const firstItem = ord.items[0];
                      return (
                        <tr
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:bg-[#F6F6F6]/60 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              aria-label={`Select order ${ord.orderNumber}`}
                              className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">
                            {firstItem?.productName || 'Custom Product'}
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">
                            {ord.items.reduce((acc, i) => acc + i.qty, 0)}
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">{ord.date}</td>
                          <td className="py-4 px-4 font-normal text-[#000000]">
                            {ord.customerName}
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">
                            ${firstItem?.price || 10}
                          </td>
                          <td className="py-4 px-4 font-normal text-[#000000]">${ord.total}</td>
                          <td className="py-4 px-4 text-right">
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

            {/* Mobile Card View (< 768px screens) */}
            <div className="md:hidden space-y-3">
              {figmaMockOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#71717A]">{ord.orderNumber}</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs capitalize ${
                        ord.status === 'shipped'
                          ? 'bg-[#E7F4E9] text-[#0E8F21]'
                          : ord.status === 'cancelled'
                          ? 'bg-[#FFE6E7] text-[#FF0013]'
                          : 'bg-[#FFF4E6] text-[#FF9500]'
                      }`}
                    >
                      {ord.status === 'shipped'
                        ? 'Shipped'
                        : ord.status === 'cancelled'
                        ? 'Canceled'
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-[#000000]">{ord.productName}</span>
                    <span className="font-semibold text-sm text-[#000000]">{ord.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#71717A] pt-1 border-t border-[#E2E2E2]/50">
                    <span>{ord.customer}</span>
                    <span>{ord.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <AdjustWidgetModal
        isOpen={isAdjustWidgetOpen}
        onClose={() => setIsAdjustWidgetOpen(false)}
        widgetVisibility={widgetVisibility}
        onToggleWidget={handleToggleWidget}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
      />
      <OrderDetailsModal />
      <NewOrderModal />
      <ProductModal />
    </AppShell>
  );
}
