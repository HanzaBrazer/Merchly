'use client';

import React, { useState, useMemo } from 'react';
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
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SalesGauge } from '@/components/dashboard/SalesGauge';
import { RevenueBarChart } from '@/components/dashboard/RevenueBarChart';
import { AdjustWidgetModal } from '@/components/dashboard/AdjustWidgetModal';
import {
  DashboardFilterModal,
  DashboardFilterState,
} from '@/components/dashboard/DashboardFilterModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { NewOrderModal } from '@/components/orders/NewOrderModal';
import { ProductModal } from '@/components/products/ProductModal';

// Unified Order Item Interface
interface DashboardSaleItem {
  id: string;
  orderNumber: string;
  productName: string;
  category: string;
  qty: number;
  date: string;
  customer: string;
  price: string;
  priceNum: number;
  total: string;
  totalNum: number;
  status: 'shipped' | 'cancelled' | 'pending';
}

// Initial Figma Mockup Rows (from Node 49:13264)
const figmaMockOrders: DashboardSaleItem[] = [
  {
    id: 'f-1',
    orderNumber: '#P08652',
    productName: 'Bergen Table',
    category: 'Table',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'Michelle',
    price: '$10',
    priceNum: 10,
    total: '$20',
    totalNum: 20,
    status: 'shipped',
  },
  {
    id: 'f-2',
    orderNumber: '#P08653',
    productName: 'Chair',
    category: 'Chair',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'John',
    price: '$10',
    priceNum: 10,
    total: '$20',
    totalNum: 20,
    status: 'cancelled',
  },
  {
    id: 'f-3',
    orderNumber: '#P08654',
    productName: 'Oslo Chair',
    category: 'Chair',
    qty: 2,
    date: 'Oct 19, 2025',
    customer: 'Alex',
    price: '$10',
    priceNum: 10,
    total: '$20',
    totalNum: 20,
    status: 'pending',
  },
];

export default function DashboardPage() {
  const { orders, currentUser, setSelectedOrder, setIsNewOrderModalOpen } = useMerchly();

  // Search & Filter States
  const [recentSalesSearch, setRecentSalesSearch] = useState<string>('');
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('All');
  const [isTableFilterOpen, setIsTableFilterOpen] = useState<boolean>(false);
  const [tableSortBy, setTableSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Top Dashboard Global Filter
  const [isDashboardFilterOpen, setIsDashboardFilterOpen] = useState(false);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilterState>({
    timePeriod: 'all',
    status: 'all',
    channel: 'all',
  });

  // Widget Adjuster Modal
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

  // Check how many global filters are active
  const activeGlobalFilterCount =
    (dashboardFilters.timePeriod !== 'all' ? 1 : 0) +
    (dashboardFilters.status !== 'all' ? 1 : 0) +
    (dashboardFilters.channel !== 'all' ? 1 : 0);

  // Check how many table filters are active
  const isTableFilterActive =
    tableStatusFilter !== 'All' || tableSortBy !== 'default';

  // Combine Mock and Store Orders
  const allSalesItems: DashboardSaleItem[] = useMemo(() => {
    const storeConverted: DashboardSaleItem[] = orders
      .filter((o) => !figmaMockOrders.some((f) => f.id === o.id))
      .map((o) => {
        const firstItem = o.items[0];
        const statusNormalized =
          o.status === 'delivered' || o.status === 'shipped'
            ? 'shipped'
            : o.status === 'cancelled'
            ? 'cancelled'
            : 'pending';

        return {
          id: o.id,
          orderNumber: o.orderNumber,
          productName: firstItem?.productName || 'Retail Item',
          category: firstItem?.productName.toLowerCase().includes('chair')
            ? 'Chair'
            : firstItem?.productName.toLowerCase().includes('table')
            ? 'Table'
            : firstItem?.productName.toLowerCase().includes('sofa')
            ? 'Sofa'
            : 'General',
          qty: o.items.reduce((acc, i) => acc + i.qty, 0),
          date: o.date,
          customer: o.customerName,
          price: `$${firstItem?.price || 10}`,
          priceNum: firstItem?.price || 10,
          total: `$${o.total}`,
          totalNum: o.total,
          status: statusNormalized,
        };
      });

    return [...figmaMockOrders, ...storeConverted];
  }, [orders]);

  // Reactive Filter & Search Pipeline for Recent Sales
  const filteredSales = useMemo(() => {
    return allSalesItems
      .filter((item) => {
        // Search Filter: Matches Order ID, Product Name, or Customer Name
        if (recentSalesSearch.trim()) {
          const q = recentSalesSearch.toLowerCase();
          const matchNumber = item.orderNumber.toLowerCase().includes(q);
          const matchProduct = item.productName.toLowerCase().includes(q);
          const matchCustomer = item.customer.toLowerCase().includes(q);
          if (!matchNumber && !matchProduct && !matchCustomer) return false;
        }

        // Category Filter
        if (selectedCategory !== 'All') {
          const matchCat =
            item.category.toLowerCase() === selectedCategory.toLowerCase() ||
            item.productName.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchCat) return false;
        }

        // Table Status Filter
        if (tableStatusFilter !== 'All') {
          if (item.status.toLowerCase() !== tableStatusFilter.toLowerCase()) {
            return false;
          }
        }

        // Global Dashboard Status Filter
        if (dashboardFilters.status !== 'all') {
          if (item.status.toLowerCase() !== dashboardFilters.status.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (tableSortBy === 'price-asc') return a.totalNum - b.totalNum;
        if (tableSortBy === 'price-desc') return b.totalNum - a.totalNum;
        return 0;
      });
  }, [
    allSalesItems,
    recentSalesSearch,
    selectedCategory,
    tableStatusFilter,
    dashboardFilters.status,
    tableSortBy,
  ]);

  // Dynamic KPI Metric Adjustments based on Dashboard Global Filter
  const kpiData = useMemo(() => {
    let sales = 3700;
    let customers = 2250;
    let revenue = 7865;
    let products = 248;

    if (dashboardFilters.timePeriod === 'today') {
      sales = 142;
      customers = 89;
      revenue = 1240;
    } else if (dashboardFilters.timePeriod === 'week') {
      sales = 980;
      customers = 610;
      revenue = 3450;
    } else if (dashboardFilters.timePeriod === 'year') {
      sales = 18400;
      customers = 9320;
      revenue = 49200;
    }

    if (dashboardFilters.status === 'shipped') {
      sales = Math.round(sales * 0.7);
      revenue = Math.round(revenue * 0.75);
    } else if (dashboardFilters.status === 'pending') {
      sales = Math.round(sales * 0.25);
      revenue = Math.round(revenue * 0.2);
    } else if (dashboardFilters.status === 'cancelled') {
      sales = Math.round(sales * 0.05);
      revenue = Math.round(revenue * 0.05);
    }

    return {
      sales: sales.toLocaleString(),
      customers: customers.toLocaleString(),
      revenue: `$${revenue.toLocaleString()}`,
      products,
    };
  }, [dashboardFilters]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Row: Welcome + Action Buttons (Figma Node 49:13312) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
                Welcome back, {ownerName}!
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border shrink-0 ${
                  currentUser?.role === 'admin'
                    ? 'bg-[#EBF5FF] text-[#1E40AF] border-[#BFDBFE]'
                    : currentUser?.role === 'staff'
                    ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                    : 'bg-[#FEF1ED] text-[#CE3627] border-[#F7D7D1]'
                }`}
              >
                {currentUser?.role === 'admin' ? '🛡️ Admin' : currentUser?.role === 'staff' ? '💼 Staff' : '👑 Owner'}
              </span>
            </div>
            <p className="text-base text-[#A0A0A0] mt-1 font-normal">
              Here are your dashboard overview
            </p>
          </div>

          {/* CTA Buttons: Exact replication of Figma Node 49:13316 with functional actions */}
          <div className="flex items-center gap-2.5">
            {/* Filter Pill Button */}
            <button
              type="button"
              onClick={() => setIsDashboardFilterOpen(true)}
              className={`h-[47px] px-5 rounded-full border transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none relative ${
                activeGlobalFilterCount > 0
                  ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] font-medium'
                  : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
              }`}
            >
              <Filter className={`w-5 h-5 ${activeGlobalFilterCount > 0 ? 'text-[#CE3627]' : 'text-[#000000]'}`} />
              <span>Filter</span>
              {activeGlobalFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#CE3627] text-white text-[11px] font-bold flex items-center justify-center ml-1">
                  {activeGlobalFilterCount}
                </span>
              )}
            </button>

            {/* Adjust Widget Pill Button (DESIGN.md §15: Hidden for Staff) */}
            {currentUser?.role !== 'staff' && (
              <button
                type="button"
                onClick={() => setIsAdjustWidgetOpen(true)}
                className="h-[47px] px-5 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-base font-normal flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer select-none"
              >
                <LayoutGrid className="w-5 h-5 text-white" />
                <span>Adjust Widget</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Global Filter Notification Banner (if any filter is applied) */}
        {activeGlobalFilterCount > 0 && (
          <div className="bg-[#FEF1ED] border border-[#F7D7D1] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-[#CE3627]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">Active Filter:</span>
              {dashboardFilters.timePeriod !== 'all' && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-[#F7D7D1] font-medium capitalize">
                  Period: {dashboardFilters.timePeriod}
                </span>
              )}
              {dashboardFilters.status !== 'all' && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-[#F7D7D1] font-medium capitalize">
                  Status: {dashboardFilters.status}
                </span>
              )}
              {dashboardFilters.channel !== 'all' && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-[#F7D7D1] font-medium capitalize">
                  Channel: {dashboardFilters.channel}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                setDashboardFilters({ timePeriod: 'all', status: 'all', channel: 'all' })
              }
              className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer ml-3 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* 4 Summary Metric Cards (Figma Node 49:13250) */}
        {widgetVisibility.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Sales"
              value={kpiData.sales}
              lastWeekValue="2,340"
              trendPercentage={7}
              isPositive={true}
              icon={<ShoppingCart className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Total volume of sales transactions"
            />

            <MetricCard
              title="Total Customers"
              value={kpiData.customers}
              lastWeekValue="1,200"
              trendPercentage={3}
              isPositive={true}
              icon={<Users className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Active customer base count"
            />

            <MetricCard
              title="Total Revenue"
              value={kpiData.revenue}
              lastWeekValue="6,118"
              trendPercentage={-5}
              isPositive={false}
              icon={<DollarSign className="w-5 h-5 text-[#000000]" />}
              infoTooltip="Net revenue across all sales channels"
            />

            <MetricCard
              title="Total Products"
              value={kpiData.products}
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
            {/* Header with Title and Action Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-normal text-[#000000]">Recent Sales</h3>
                <span className="text-xs text-[#71717A] bg-[#F6F6F6] px-2.5 py-1 rounded-full font-medium">
                  {filteredSales.length} items
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Action: Expandable / Interactive Search Bar */}
                {isSearchExpanded ? (
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search product, customer, ID..."
                      value={recentSalesSearch}
                      onChange={(e) => setRecentSalesSearch(e.target.value)}
                      className="h-11 pl-10 pr-9 bg-white text-sm rounded-full border border-[#CE3627] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#CE3627]/20 w-60 sm:w-72 shadow-xs transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSalesSearch('');
                        setIsSearchExpanded(false);
                      }}
                      className="absolute right-3 text-[#A0A0A0] hover:text-[#000000] p-1 cursor-pointer"
                      title="Close search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(true)}
                    aria-label="Open search for recent sales"
                    className={`w-11 h-11 rounded-full border transition-colors flex items-center justify-center shadow-xs cursor-pointer ${
                      recentSalesSearch
                        ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627]'
                        : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
                    }`}
                    title="Search recent sales"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}

                {/* Categories Dropdown Pill */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`appearance-none h-11 px-5 pr-9 text-base font-normal rounded-full border focus:outline-none cursor-pointer shadow-xs transition-colors ${
                      selectedCategory !== 'All'
                        ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] font-medium'
                        : 'border-[#E8E8E8] bg-white text-[#000000]'
                    }`}
                  >
                    <option value="All">Categories: All</option>
                    <option value="Table">Table</option>
                    <option value="Chair">Chair</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#000000] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Filter Pill Button & Dropdown Popover */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTableFilterOpen(!isTableFilterOpen)}
                    className={`h-11 px-5 rounded-full border transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
                      isTableFilterActive
                        ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] font-medium'
                        : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    {isTableFilterActive && (
                      <span className="w-2 h-2 rounded-full bg-[#CE3627]" />
                    )}
                  </button>

                  {/* Table Filter Popover */}
                  {isTableFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-3 z-30 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-1.5">
                          Status
                        </span>
                        <div className="space-y-1">
                          {['All', 'Shipped', 'Pending', 'Canceled'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setTableStatusFilter(st);
                                setIsTableFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                                tableStatusFilter === st
                                  ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                                  : 'text-[#000000] hover:bg-[#F6F6F6]'
                              }`}
                            >
                              <span>{st}</span>
                              {tableStatusFilter === st && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E8E8E8]">
                        <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-1.5">
                          Sort By Price
                        </span>
                        <div className="space-y-1">
                          {[
                            { id: 'default', label: 'Default' },
                            { id: 'price-desc', label: 'High to Low' },
                            { id: 'price-asc', label: 'Low to High' },
                          ].map((sort) => (
                            <button
                              key={sort.id}
                              type="button"
                              onClick={() => {
                                setTableSortBy(sort.id as any);
                                setIsTableFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                                tableSortBy === sort.id
                                  ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                                  : 'text-[#000000] hover:bg-[#F6F6F6]'
                              }`}
                            >
                              <span>{sort.label}</span>
                              {tableSortBy === sort.id && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {isTableFilterActive && (
                        <div className="pt-2 border-t border-[#E8E8E8]">
                          <button
                            type="button"
                            onClick={() => {
                              setTableStatusFilter('All');
                              setTableSortBy('default');
                              setIsTableFilterOpen(false);
                            }}
                            className="w-full text-center text-xs text-[#CE3627] font-semibold py-1 hover:underline cursor-pointer"
                          >
                            Reset Table Filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* New Order Action */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="h-11 px-5 rounded-full text-sm font-semibold shadow-xs flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>New Order</span>
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
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#71717A]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Filter className="w-8 h-8 text-[#A0A0A0]" />
                          <p className="font-medium text-base text-[#000000]">No sales found</p>
                          <p className="text-xs text-[#71717A]">
                            Try adjusting your search query or clearing active filters.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setRecentSalesSearch('');
                              setSelectedCategory('All');
                              setTableStatusFilter('All');
                              setTableSortBy('default');
                              setDashboardFilters({ timePeriod: 'all', status: 'all', channel: 'all' });
                            }}
                            className="mt-2 px-4 py-1.5 rounded-full bg-[#FEF1ED] text-[#CE3627] text-xs font-semibold hover:bg-[#FDE2D9] transition-colors"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((ord) => (
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
                            onClick={(e) => e.stopPropagation()}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< 768px screens) */}
            <div className="md:hidden space-y-3">
              {filteredSales.length === 0 ? (
                <div className="py-8 text-center text-[#71717A] text-xs">
                  No sales match your current search/filter.
                </div>
              ) : (
                filteredSales.map((ord) => (
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
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <DashboardFilterModal
        isOpen={isDashboardFilterOpen}
        onClose={() => setIsDashboardFilterOpen(false)}
        filters={dashboardFilters}
        onApplyFilters={setDashboardFilters}
        onResetFilters={() =>
          setDashboardFilters({ timePeriod: 'all', status: 'all', channel: 'all' })
        }
      />
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
