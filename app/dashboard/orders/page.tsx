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
import Image from 'next/image';

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'shipped' | 'pending' | 'cancelled'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Delivery Time Mini Chart Bars (8 pill bars)
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

  // Pipeline Bar Teeth (72 discrete rounded teeth)
  // 30 Pending (#FFAA33), 38 Shipped (#5EB46A), 4 Canceled (#FF5461)
  const totalTeeth = 72;
  const teeth = Array.from({ length: totalTeeth }, (_, i) => {
    if (i < 30) return '#FFAA33'; // Pending
    if (i < 68) return '#5EB46A'; // Shipped
    return '#FF5461'; // Canceled
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Headline */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-medium tracking-tight text-[#000000]">
            Orders
          </h1>
          <p className="text-base text-[#A0A0A0] mt-1 font-normal">
            View, process, and fulfill customer orders.
          </p>
        </div>

        {/* Top Cards Section: 2-Column Desktop Grid (Figma Replica) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (span 4): Total Orders + Average Shipping Distance */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Card 1: Total Orders */}
            <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[200px]">
              {/* Package Watermark graphic */}
              <div className="absolute right-2 -bottom-4 text-black/[0.04] pointer-events-none select-none">
                <Package className="w-56 h-56 stroke-[1]" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 text-[#000000] text-base font-normal mb-4">
                  <Package className="w-5 h-5 text-[#000000]" />
                  <span>Total Orders</span>
                </div>
                <div className="text-[52px] sm:text-[56px] font-medium tracking-tight text-[#000000] leading-none mb-4">
                  432,500
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm z-10">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                  <ArrowUp className="w-3.5 h-3.5" />
                  7%
                </span>
                <span className="text-[#A0A0A0] font-normal">From last month</span>
              </div>
            </div>

            {/* Card 2: Average Shipping Distance */}
            <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[175px]">
              {/* World Map Dotted Pattern Graphic */}
              <div className="absolute right-0 bottom-0 w-48 h-32 opacity-25 pointer-events-none select-none">
                <svg viewBox="0 0 200 120" className="w-full h-full fill-current text-[#71717A]">
                  <circle cx="20" cy="30" r="2" /><circle cx="30" cy="35" r="2" /><circle cx="45" cy="40" r="2.5" />
                  <circle cx="60" cy="30" r="2" /><circle cx="75" cy="25" r="3" /><circle cx="90" cy="35" r="2" />
                  <circle cx="110" cy="45" r="2.5" /><circle cx="125" cy="35" r="3" /><circle cx="140" cy="50" r="2" />
                  <circle cx="155" cy="40" r="2.5" /><circle cx="170" cy="55" r="2" /><circle cx="185" cy="45" r="2" />
                  <circle cx="35" cy="65" r="2" /><circle cx="50" cy="70" r="3" /><circle cx="70" cy="75" r="2" />
                  <circle cx="95" cy="80" r="2.5" /><circle cx="120" cy="75" r="2" /><circle cx="145" cy="85" r="3" />
                  <circle cx="165" cy="80" r="2" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2.5 text-[#000000] text-base font-normal mb-3">
                  <MapPin className="w-5 h-5 text-[#000000]" />
                  <span>Average Shipping Distance</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[40px] font-medium tracking-tight text-[#000000] leading-none">
                    481
                  </span>
                  <span className="text-base text-[#A0A0A0] font-normal">miles</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm z-10">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                  <ArrowUp className="w-3.5 h-3.5" />
                  2%
                </span>
                <span className="text-[#A0A0A0] font-normal">From yesterday</span>
              </div>
            </div>
          </div>

          {/* Right Area (span 8): Order Volume Growth, Delivery Time & Pipeline Bar */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Top Row: 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Order Volume Growth */}
              <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between min-h-[175px]">
                <div className="flex items-center gap-2.5 text-[#000000] text-base font-normal">
                  <Package className="w-5 h-5 text-[#000000]" />
                  <span>Order Volume Growth</span>
                </div>
                <div className="text-[40px] font-medium tracking-tight text-[#000000] leading-none my-2">
                  -2%
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#A0A0A0] font-normal">Last week:</span>
                  <span className="font-medium text-[#000000]">754</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFE6E7] text-[#FF0013]">
                    <ArrowDown className="w-3.5 h-3.5" />
                    7%
                  </span>
                </div>
              </div>

              {/* Average Delivery Time (with Mini Bar Chart) */}
              <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm flex items-center justify-between min-h-[175px]">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center gap-2.5 text-[#000000] text-base font-normal">
                    <Clock className="w-5 h-5 text-[#000000]" />
                    <span>Average Delivery Time</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-2">
                    <span className="text-[40px] font-medium tracking-tight text-[#000000] leading-none">
                      4.1
                    </span>
                    <span className="text-base text-[#A0A0A0] font-normal">days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#A0A0A0] font-normal">Last week:</span>
                    <span className="font-medium text-[#000000]">4.8</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                  </div>
                </div>

                {/* Vertical Pill Bars Chart */}
                <div className="h-24 flex items-end gap-1.5 pl-3">
                  {deliveryTimeBars.map((bar, idx) => (
                    <div
                      key={idx}
                      className="w-2.5 rounded-full transition-all duration-300"
                      style={{
                        height: `${bar.height}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Pipeline Stats Card (Figma Widget 9:1430) */}
            <div className="bg-white rounded-[36px] p-6 sm:p-7 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
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
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                    <span className="text-[#A0A0A0] font-normal">From yesterday</span>
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
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFE6E7] text-[#FF0013]">
                      <ArrowDown className="w-3.5 h-3.5" />
                      8%
                    </span>
                    <span className="text-[#A0A0A0] font-normal">From yesterday</span>
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
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F4E9] text-[#0E8F21]">
                      <ArrowUp className="w-3.5 h-3.5" />
                      3%
                    </span>
                    <span className="text-[#A0A0A0] font-normal">From yesterday</span>
                  </div>
                </div>
              </div>

              {/* Segmented Pipeline Bar: Discrete vertical teeth */}
              <div className="w-full flex items-center justify-between gap-[3px] py-1 select-none overflow-x-auto">
                {teeth.map((clr, idx) => (
                  <div
                    key={idx}
                    className="h-7 w-[5px] rounded-full shrink-0 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: clr }}
                  />
                ))}
              </div>

              {/* Legend */}
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
        <div className="bg-white rounded-[36px] p-6 border border-[#E2E2E2] shadow-sm">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-normal text-[#000000]">Recent Orders</h3>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Action */}
              {isSearchOpen ? (
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search order ID, customer, product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 pr-9 bg-white text-sm rounded-full border border-[#CE3627] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#CE3627]/20 w-64 sm:w-72 shadow-xs transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 text-[#A0A0A0] hover:text-[#000000] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                  className={`w-11 h-11 rounded-full border transition-colors flex items-center justify-center shadow-xs cursor-pointer ${
                    searchQuery
                      ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627]'
                      : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
                  }`}
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
                  <option value="Chair">Chair</option>
                  <option value="Sofa">Sofa</option>
                  <option value="Table">Table</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#000000] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Filter Button & Status Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`h-11 px-5 rounded-full border transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
                    statusFilter !== 'all'
                      ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] font-medium'
                      : 'border-[#E8E8E8] bg-white text-[#000000] hover:bg-[#F6F6F6]'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {statusFilter !== 'all' && (
                    <span className="w-2 h-2 rounded-full bg-[#CE3627]" />
                  )}
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl p-3 z-30 space-y-1">
                    <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-1.5 px-2">
                      Filter By Status
                    </span>
                    {(['all', 'shipped', 'pending', 'cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs capitalize transition-colors cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#FEF1ED] text-[#CE3627] font-semibold'
                            : 'text-[#000000] hover:bg-[#F6F6F6]'
                        }`}
                      >
                        <span>{st === 'all' ? 'All Statuses' : st}</span>
                        {statusFilter === st && <Check className="w-3.5 h-3.5 text-[#CE3627]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table View (Figma 9:4599) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] rounded-full text-base font-normal text-[#A0A0A0]">
                  <th className="py-4 px-5 rounded-l-full w-12 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all orders"
                      className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4 font-normal text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <span>Order ID</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-4 px-4 font-normal text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <span>Order Date</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-4 px-4 font-normal text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <span>Customer</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-4 px-4 font-normal text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <span>Product</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-4 px-4 font-normal text-[#A0A0A0]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <span>Amount</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                  <th className="py-4 px-5 rounded-r-full text-right font-normal text-[#A0A0A0]">
                    <div className="flex items-center justify-end gap-1.5 cursor-pointer">
                      <span>Status</span>
                      <ChevronsUpDown className="w-4 h-4 text-[#A0A0A0]" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]/50 text-base">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#71717A]">
                      No orders found matching your search/filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => router.push(`/dashboard/orders/${ord.fullOrderNumber.replace('#', '')}`)}
                      className="hover:bg-[#F6F6F6]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select order ${ord.orderNumber}`}
                          className="rounded border-[#A0A0A0] text-[#CE3627] focus:ring-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>

                      {/* Order ID */}
                      <td className="py-4 px-4 font-normal text-[#000000] group-hover:text-[#CE3627] transition-colors">
                        <Link
                          href={`/dashboard/orders/${ord.fullOrderNumber.replace('#', '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline"
                        >
                          {ord.orderNumber}
                        </Link>
                      </td>

                      {/* Order Date */}
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.orderDate}</td>

                      {/* Customer with Avatar */}
                      <td className="py-4 px-4 font-normal text-[#000000]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ord.customerAvatar}
                            alt={ord.customerName}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <span>{ord.customerName}</span>
                        </div>
                      </td>

                      {/* Product with Image + Count */}
                      <td className="py-4 px-4 font-normal text-[#000000]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={ord.productImage}
                            alt={ord.productName}
                            className="w-10 h-10 rounded-xl object-cover bg-[#F6F6F6] shrink-0"
                          />
                          <span>{ord.productName}</span>
                          {ord.productExtraCount && (
                            <span className="w-6 h-6 rounded-full bg-[#F6F6F6] text-xs font-medium text-[#71717A] flex items-center justify-center shrink-0">
                              +{ord.productExtraCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-normal text-[#000000]">{ord.amount}</td>

                      {/* Status Badge */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
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
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => router.push(`/dashboard/orders/${ord.fullOrderNumber.replace('#', '')}`)}
                className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-2.5 cursor-pointer active:bg-[#EAEAEA]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#71717A] font-medium">
                    {ord.fullOrderNumber}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
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

                <div className="flex items-center gap-3">
                  <img
                    src={ord.productImage}
                    alt={ord.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-white"
                  />
                  <div>
                    <p className="font-semibold text-sm text-[#000000]">{ord.productName}</p>
                    <p className="text-xs text-[#71717A] mt-0.5">{ord.customerName} • {ord.amount}</p>
                  </div>
                </div>

                <div className="text-xs text-[#71717A] pt-1.5 border-t border-[#E2E2E2]/60 flex justify-between">
                  <span>{ord.orderDate}</span>
                  <span className="text-[#CE3627] font-medium">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
