'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  X,
  Check,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  orderNumber: string;
  fullOrderNumber: string;
  orderDate: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  productImage: string;
  productExtraCount?: number;
  category: string;
  amount: string;
  amountNum: number;
  status: 'shipped' | 'pending' | 'cancelled';
}

const figmaMockOrders: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#C0875...',
    fullOrderNumber: '#C087598025',
    orderDate: 'Nov 3, 2025',
    customerName: 'Alex',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    productName: 'Oslo Chair',
    productImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop',
    productExtraCount: 3,
    category: 'Chair',
    amount: '$55',
    amountNum: 55,
    status: 'shipped',
  },
  {
    id: 'ord-2',
    orderNumber: '#T0142...',
    fullOrderNumber: '#T014298104',
    orderDate: 'Nov 3, 2025',
    customerName: 'Jhony',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    productName: 'Sapporo Sofa',
    productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
    productExtraCount: 4,
    category: 'Sofa',
    amount: '$90',
    amountNum: 90,
    status: 'pending',
  },
  {
    id: 'ord-3',
    orderNumber: '#C0875...',
    fullOrderNumber: '#C087598026',
    orderDate: 'Nov 4, 2025',
    customerName: 'Alexander',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    productName: 'Oslo Chair',
    productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop',
    productExtraCount: 3,
    category: 'Chair',
    amount: '$581',
    amountNum: 581,
    status: 'pending',
  },
  {
    id: 'ord-4',
    orderNumber: '#P0865...',
    fullOrderNumber: '#P086529381',
    orderDate: 'Oct 19, 2025',
    customerName: 'Michelle',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    productName: 'Bergen Table',
    productImage: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=100&h=100&fit=crop',
    productExtraCount: 2,
    category: 'Table',
    amount: '$20',
    amountNum: 20,
    status: 'shipped',
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useMerchly();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'shipped' | 'pending' | 'cancelled'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Combine Mock with Store Orders
  const allOrders: OrderItem[] = useMemo(() => {
    const storeConverted: OrderItem[] = orders
      .filter((o) => !figmaMockOrders.some((f) => f.id === o.id))
      .map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber.length > 7 ? `${o.orderNumber.slice(0, 6)}...` : o.orderNumber,
        fullOrderNumber: o.orderNumber,
        orderDate: o.date,
        customerName: o.customerName,
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        productName: o.items[0]?.productName || 'Custom Order',
        productImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop',
        productExtraCount: o.items.length > 1 ? o.items.length : undefined,
        category: 'Chair',
        amount: `$${o.total}`,
        amountNum: o.total,
        status: o.status === 'delivered' ? 'shipped' : o.status === 'cancelled' ? 'cancelled' : 'pending',
      }));

    return [...figmaMockOrders, ...storeConverted];
  }, [orders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return allOrders.filter((ord) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = ord.fullOrderNumber.toLowerCase().includes(q);
        const matchCust = ord.customerName.toLowerCase().includes(q);
        const matchProd = ord.productName.toLowerCase().includes(q);
        if (!matchNum && !matchCust && !matchProd) return false;
      }
      // Category
      if (selectedCategory !== 'All') {
        if (ord.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      // Status
      if (statusFilter !== 'all') {
        if (ord.status !== statusFilter) return false;
      }
      return true;
    });
  }, [allOrders, searchQuery, selectedCategory, statusFilter]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredOrders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delivery Time Mini Chart Bars (8 pill bars matching Figma 9:4697)
  const deliveryTimeBars = [
    { height: 40, color: '#E8E8E8' },
    { height: 60, color: '#CE3627' },
    { height: 50, color: '#CE3627' },
    { height: 75, color: '#4A1512' },
    { height: 55, color: '#CE3627' },
    { height: 85, color: '#CE3627' },
    { height: 100, color: '#4A1512' },
    { height: 70, color: '#CE3627' },
    { height: 90, color: '#E8E8E8' },
  ];

  // Pipeline Bar Teeth: 64 discrete rounded teeth (Figma 9:1430)
  // ~26 Pending (#FFAA33), 32 Shipped (#5EB46A), 6 Canceled (#FF5461)
  const totalTeeth = 64;
  const teeth = Array.from({ length: totalTeeth }, (_, i) => {
    if (i < 26) return '#FFAA33'; // Pending
    if (i < 58) return '#5EB46A'; // Shipped
    return '#FF5461'; // Canceled
  });

  return (
    <AppShell>
      <div className="space-y-6 w-full max-w-[1400px]">
        {/* Headline */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
            Orders
          </h1>
          <p className="text-base text-[#A0A0A0] mt-1 font-normal">
            View, process, and fulfill customer orders.
          </p>
        </div>

        {/* Top Cards Section: Robust 2-Column Auto-Layout matching Figma Frame 9:4584 */}
        <div className="flex flex-col xl:flex-row items-stretch gap-6 w-full">
          {/* Left Column (Figma width: 366px fixed on desktop) */}
          <div className="w-full xl:w-[366px] shrink-0 flex flex-col gap-6">
            {/* Card 1: Total Orders (Figma Widget 9:1416, height: 286px) */}
            <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs relative overflow-hidden flex flex-col justify-between h-[270px]">
              {/* Package Watermark graphic */}
              <div className="absolute right-[-20px] bottom-[-20px] text-black/[0.04] pointer-events-none select-none">
                <Package className="w-56 h-56 stroke-[1.2]" />
              </div>

              <div>
                <div className="flex items-center gap-3 text-[#000000] text-base font-normal mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[#000000]" />
                  </div>
                  <span className="text-base font-normal text-[#000000]">Total Orders</span>
                </div>
                <div className="text-[52px] sm:text-[56px] font-medium tracking-tight text-[#000000] leading-none mb-4">
                  432,500
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#E7F4E9] text-[#0E8F21]">
                  <ArrowUp className="w-3.5 h-3.5" />
                  7%
                </span>
                <span className="text-[#A0A0A0] text-sm font-normal">From last month</span>
              </div>
            </div>

            {/* Card 2: Average Shipping Distance (Figma Widget 9:751, height: 219px) */}
            <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs relative overflow-hidden flex flex-col justify-between h-[219px]">
              {/* World Map Dotted Pattern Graphic */}
              <div className="absolute right-0 bottom-0 w-52 h-36 opacity-30 pointer-events-none select-none">
                <svg viewBox="0 0 200 120" className="w-full h-full fill-current text-[#71717A]">
                  <circle cx="20" cy="30" r="2.5" /><circle cx="30" cy="35" r="2.5" /><circle cx="45" cy="40" r="3" />
                  <circle cx="60" cy="30" r="2.5" /><circle cx="75" cy="25" r="3.5" /><circle cx="90" cy="35" r="2.5" />
                  <circle cx="110" cy="45" r="3" /><circle cx="125" cy="35" r="3.5" /><circle cx="140" cy="50" r="2.5" />
                  <circle cx="155" cy="40" r="3" /><circle cx="170" cy="55" r="2.5" /><circle cx="185" cy="45" r="2.5" />
                  <circle cx="35" cy="65" r="2.5" /><circle cx="50" cy="70" r="3.5" /><circle cx="70" cy="75" r="2.5" />
                  <circle cx="95" cy="80" r="3" /><circle cx="120" cy="75" r="2.5" /><circle cx="145" cy="85" r="3.5" />
                  <circle cx="165" cy="80" r="2.5" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-3 text-[#000000] text-base font-normal mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#000000]" />
                  </div>
                  <span className="text-base font-normal text-[#000000]">Average Shipping Distance</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[40px] font-medium tracking-tight text-[#000000] leading-none">
                    481
                  </span>
                  <span className="text-sm text-[#A0A0A0] font-normal">miles</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#E7F4E9] text-[#0E8F21]">
                  <ArrowUp className="w-3.5 h-3.5" />
                  2%
                </span>
                <span className="text-[#A0A0A0] text-sm font-normal">From yesterday</span>
              </div>
            </div>
          </div>

          {/* Right Column (Fills remaining width, Figma width: 731px on desktop) */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Top Row: 2 Cards (Order Volume Growth + Delivery Time) */}
            <div className="flex flex-col sm:flex-row items-stretch gap-6">
              {/* Card 3: Order Volume Growth (Figma Widget 9:827, width: 269px, height: 201px) */}
              <div className="w-full sm:w-[269px] shrink-0 bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs flex flex-col justify-between min-h-[201px]">
                <div className="flex items-center gap-3 text-[#000000] text-base font-normal">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[#000000]" />
                  </div>
                  <span className="text-base font-normal text-[#000000]">Order Volume Growth</span>
                </div>
                <div className="text-[40px] font-medium tracking-tight text-[#000000] leading-none my-2">
                  -2%
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#A0A0A0] font-normal">Last week:</span>
                  <span className="font-medium text-[#000000]">754</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFE6E7] text-[#FF0013]">
                    <ArrowDown className="w-3.5 h-3.5" />
                    7%
                  </span>
                </div>
              </div>

              {/* Card 4: Average Delivery Time with Mini Bar Chart (Figma Widget 9:841, width: 454px, height: 201px) */}
              <div className="flex-1 min-w-0 bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs flex items-center justify-between min-h-[201px]">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center gap-3 text-[#000000] text-base font-normal">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#000000]" />
                    </div>
                    <span className="text-base font-normal text-[#000000]">Average Delivery Time</span>
                  </div>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-[40px] font-medium tracking-tight text-[#000000] leading-none">
                      4.1
                    </span>
                    <span className="text-sm text-[#A0A0A0] font-normal">days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#A0A0A0] font-normal">Last week:</span>
                    <span className="font-medium text-[#000000]">4.8</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                  </div>
                </div>

                {/* Vertical Pill Bars Chart */}
                <div className="h-28 flex items-end gap-2 pl-4 pr-2">
                  {deliveryTimeBars.map((bar, idx) => (
                    <div
                      key={idx}
                      className="w-3 rounded-full transition-all duration-300"
                      style={{
                        height: `${bar.height}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 5: Order Pipeline Stats (Figma Widget 9:1430, width: 731px) */}
            <div className="w-full bg-white rounded-[40px] p-6 sm:p-7 border border-[#E2E2E2]/70 shadow-xs flex flex-col justify-between min-h-[270px]">
              {/* 3 Metric Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <span className="text-base font-normal text-[#000000] block mb-1">
                    Pending Orders
                  </span>
                  <div className="text-[38px] sm:text-[40px] font-medium tracking-tight text-[#000000] leading-none mb-2">
                    720
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                    <span className="text-[#A0A0A0] text-sm font-normal">From yesterday</span>
                  </div>
                </div>

                <div>
                  <span className="text-base font-normal text-[#000000] block mb-1">
                    Shipped Orders
                  </span>
                  <div className="text-[38px] sm:text-[40px] font-medium tracking-tight text-[#000000] leading-none mb-2">
                    985
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFE6E7] text-[#FF0013]">
                      <ArrowDown className="w-3.5 h-3.5" />
                      8%
                    </span>
                    <span className="text-[#A0A0A0] text-sm font-normal">From yesterday</span>
                  </div>
                </div>

                <div>
                  <span className="text-base font-normal text-[#000000] block mb-1">
                    Canceled Orders
                  </span>
                  <div className="text-[38px] sm:text-[40px] font-medium tracking-tight text-[#000000] leading-none mb-2">
                    24
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                    <span className="text-[#A0A0A0] text-sm font-normal">From yesterday</span>
                  </div>
                </div>
              </div>

              {/* Segmented Pipeline Bar: Discrete vertical teeth perfectly spanning full width */}
              <div className="w-full flex items-center justify-between gap-[3px] py-1 select-none">
                {teeth.map((clr, idx) => (
                  <div
                    key={idx}
                    className="h-7 flex-1 rounded-full shrink-0 transition-opacity hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: clr }}
                  />
                ))}
              </div>

              {/* Legend matching Figma 9:1430 */}
              <div className="flex items-center gap-6 mt-4 text-sm font-normal text-[#000000]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFAA33]" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5EB46A]" />
                  <span>Shipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5461]" />
                  <span>Canceled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Orders (Figma Replica 9:4591) */}
        <div className="bg-white rounded-[40px] p-6 border border-[#E2E2E2]/70 shadow-xs">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-medium text-[#000000]">Recent Orders</h3>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Action */}
              {isSearchOpen ? (
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search order, customer, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="h-[47px] pl-10 pr-9 rounded-full border border-[#E8E8E8] bg-white text-sm text-[#000000] focus:outline-hidden focus:border-[#CE3627] w-64 sm:w-72 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 text-[#A0A0A0] hover:text-[#000000]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-[47px] h-[47px] rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center text-[#000000] hover:bg-[#F6F6F6] transition-colors shadow-xs cursor-pointer"
                  title="Search orders"
                >
                  <Search className="w-5 h-5 text-[#000000]" />
                </button>
              )}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsFilterOpen(false);
                  }}
                  className={`h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-base text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 shadow-xs cursor-pointer select-none ${
                    selectedCategory !== 'All' ? 'border-[#CE3627] text-[#CE3627]' : ''
                  }`}
                >
                  <span>{selectedCategory === 'All' ? 'Categories' : selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 text-[#000000]" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-2 z-30 space-y-1">
                    {['All', 'Chair', 'Sofa', 'Table'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                          toast.info(`Filter category: ${cat}`);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                            : 'text-[#000000] hover:bg-[#F6F6F6]'
                        }`}
                      >
                        <span>{cat === 'All' ? 'All Categories' : cat}</span>
                        {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsCategoryOpen(false);
                  }}
                  className={`h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-base text-[#000000] hover:bg-[#F6F6F6] transition-colors flex items-center gap-2 shadow-xs cursor-pointer select-none ${
                    statusFilter !== 'all' ? 'border-[#CE3627] text-[#CE3627]' : ''
                  }`}
                >
                  <Filter className="w-4 h-4 text-[#000000]" />
                  <span>{statusFilter === 'all' ? 'Filter' : `Status: ${statusFilter}`}</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-2 z-30 space-y-1">
                    <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A0A0A0]">
                      Filter Status
                    </p>
                    {[
                      { key: 'all', label: 'All Status' },
                      { key: 'shipped', label: 'Shipped' },
                      { key: 'pending', label: 'Pending' },
                      { key: 'cancelled', label: 'Canceled' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.key as any);
                          setIsFilterOpen(false);
                          toast.info(`Filter status: ${opt.label}`);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          statusFilter === opt.key
                            ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                            : 'text-[#000000] hover:bg-[#F6F6F6]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {statusFilter === opt.key && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] rounded-full text-sm text-[#A0A0A0] font-normal">
                  <th className="py-3.5 pl-6 pr-3 rounded-l-full w-12">
                    <input
                      type="checkbox"
                      aria-label="Select all orders"
                      checked={selectedRows.length > 0 && selectedRows.length === filteredOrders.length}
                      onChange={toggleSelectAll}
                      className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Order ID</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Order Date</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Customer</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Product</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Amount</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-3.5 pr-6 pl-4 font-normal rounded-r-full">
                    <div className="flex items-center gap-1.5 cursor-pointer select-none">
                      <span>Status</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5] text-base font-normal text-[#000000]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#A0A0A0]">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => router.push(`/dashboard/orders/${ord.fullOrderNumber.replace('#', '')}`)}
                      className="hover:bg-[#FBFBFB] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select order ${ord.fullOrderNumber}`}
                          checked={selectedRows.includes(ord.id)}
                          onChange={() => toggleSelectRow(ord.id)}
                          className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4 font-normal text-[#000000] group-hover:text-[#CE3627] transition-colors">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-4 text-[#000000]">{ord.orderDate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ord.customerAvatar}
                            alt={ord.customerName}
                            className="w-9 h-9 rounded-full object-cover bg-[#F6F6F6] shrink-0"
                          />
                          <span className="text-[#000000]">{ord.customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ord.productImage}
                            alt={ord.productName}
                            className="w-10 h-10 rounded-md object-cover bg-[#F6F6F6] shrink-0"
                          />
                          <span className="text-[#000000]">{ord.productName}</span>
                          {ord.productExtraCount && (
                            <span className="w-6 h-6 rounded-full bg-[#E2E2E2] text-xs font-medium text-[#000000] flex items-center justify-center shrink-0">
                              +{ord.productExtraCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#000000]">{ord.amount}</td>
                      <td className="py-4 pr-6 pl-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            ord.status === 'shipped'
                              ? 'bg-[#E7F4E9] text-[#0E8F21] border border-[#B4DCBA]'
                              : ord.status === 'pending'
                              ? 'bg-[#FFF4E6] text-[#FF9500] border border-[#FFDEB0]'
                              : 'bg-[#FFE6E7] text-[#FF0013] border border-[#FFCCD0]'
                          }`}
                        >
                          {ord.status === 'shipped'
                            ? 'Shipped'
                            : ord.status === 'pending'
                            ? 'Pending'
                            : 'Canceled'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< 768px) */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => router.push(`/dashboard/orders/${ord.fullOrderNumber.replace('#', '')}`)}
                className="p-4 rounded-2xl border border-[#E2E2E2] bg-white space-y-3 cursor-pointer hover:border-[#CE3627] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#000000]">{ord.fullOrderNumber}</span>
                    <span className="text-xs text-[#A0A0A0]">{ord.orderDate}</span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ord.status === 'shipped'
                        ? 'bg-[#E7F4E9] text-[#0E8F21] border border-[#B4DCBA]'
                        : ord.status === 'pending'
                        ? 'bg-[#FFF4E6] text-[#FF9500] border border-[#FFDEB0]'
                        : 'bg-[#FFE6E7] text-[#FF0013] border border-[#FFCCD0]'
                    }`}
                  >
                    {ord.status === 'shipped'
                      ? 'Shipped'
                      : ord.status === 'pending'
                      ? 'Pending'
                      : 'Canceled'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F5]">
                  <div className="flex items-center gap-2">
                    <img
                      src={ord.productImage}
                      alt={ord.productName}
                      className="w-10 h-10 rounded-md object-cover bg-[#F6F6F6]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#000000]">{ord.productName}</p>
                      <p className="text-xs text-[#A0A0A0]">{ord.customerName}</p>
                    </div>
                  </div>
                  <span className="text-base font-semibold text-[#000000]">{ord.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
