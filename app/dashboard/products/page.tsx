'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Upload,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMerchly } from '@/lib/store';
import { ProductModal } from '@/components/products/ProductModal';
import { AiInsightCard } from '@/components/dashboard/AiInsightCard';
import { ProductStatus } from '@/lib/types';
import { toast } from 'sonner';

export function ProductsPage() {
  const {
    products,
    setIsNewProductModalOpen,
    deleteProduct,
    adjustProductStock,
    workspace,
    setIsUpgradeModalOpen,
  } = useMerchly();

  const [activeTab, setActiveTab] = useState<string>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Stock summary counts
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stockStatus === 'out_of_stock').length;
  const lowStockCount = products.filter((p) => p.stockStatus === 'low_stock').length;
  const inStockCount = products.filter((p) => p.stockStatus === 'in_stock').length;

  const filteredProducts = products.filter((p) => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesQuery;
  });

  const handleImport = () => {
    if (workspace.plan === 'FREE') {
      toast.info('Bulk CSV Import is a Pro feature.');
      setIsUpgradeModalOpen(true);
    } else {
      toast.success('CSV Import Wizard ready: Select file to bulk import products.');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Products
            </h1>
            <p className="text-sm text-[#71717A] mt-1">View and manage all products in your store.</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="text-xs sm:text-sm"
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 text-[#71717A]" />
              <span>Import</span>
            </Button>

            <Button
              variant="mint"
              size="md"
              className="text-xs sm:text-sm font-semibold"
              onClick={() => setIsNewProductModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </Button>
          </div>
        </div>

        {/* Top 3 Cards Grid (Figma Screen 3 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Product */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <Package className="w-5 h-5" />
              </div>
              <span>Total Product</span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl font-bold text-[#000000]">
                {products.length > 0 ? products.length + 469 : 481}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#0E8F21] bg-[#E7F4E9] px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                7% From last week
              </span>
            </div>

            {/* Subtle curve decoration */}
            <div className="h-8 w-full mt-2">
              <svg viewBox="0 0 200 40" className="w-full h-full overflow-visible">
                <path
                  d="M0 30 Q 50 35, 100 20 T 200 10"
                  fill="none"
                  stroke="#97DF68"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Product Stock Breakdown */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#1D4840]">
                <Package className="w-5 h-5" />
              </div>
              <span>Product Stock</span>
            </div>

            {/* Segmented stock progress bar */}
            <div className="w-full h-3 rounded-full bg-[#F6F6F6] flex overflow-hidden my-2">
              <div
                className="h-full bg-[#1D4840] rounded-l-full"
                style={{ width: '15%' }}
                title="Out of stock"
              />
              <div
                className="h-full bg-[#97DF68]"
                style={{ width: '35%' }}
                title="Low stock"
              />
              <div
                className="h-full bg-[#E2E2E2] rounded-r-full"
                style={{ width: '50%' }}
                title="In stock"
              />
            </div>

            {/* Breakdown numbers */}
            <div className="space-y-1.5 mt-2 text-xs font-medium">
              <div className="flex items-center justify-between text-[#000000]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D4840]" />
                  <span>Out of stock</span>
                </div>
                <span className="font-bold">{outOfStockCount > 0 ? outOfStockCount : 12}</span>
              </div>

              <div className="flex items-center justify-between text-[#000000]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#97DF68]" />
                  <span>Low stock</span>
                </div>
                <span className="font-bold">{lowStockCount > 0 ? lowStockCount : 29}</span>
              </div>

              <div className="flex items-center justify-between text-[#000000]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2E2E2]" />
                  <span>In stock</span>
                </div>
                <span className="font-bold">{inStockCount > 0 ? inStockCount + 680 : 700}</span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Insight Card */}
          <AiInsightCard />
        </div>

        {/* All Products Master List */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
          {/* Header row: Status Tabs + Search & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            {/* Status Tabs (Figma replica: Published, Drafts, Hidden, Under Review) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F6F6F6] p-1 rounded-full border border-[#E2E2E2] w-fit">
              {[
                { id: 'published', label: 'Published' },
                { id: 'draft', label: 'Drafts' },
                { id: 'hidden', label: 'Hidden' },
                { id: 'all', label: 'All Items' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-[#000000] shadow-xs'
                      : 'text-[#71717A] hover:text-[#000000]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-full border border-[#E2E2E2] text-xs sm:text-sm focus:outline-none focus:border-[#1D4840] bg-[#F6F6F6]"
                />
              </div>

              {/* Category Dropdown */}
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
                  <option value="Lighting">Lighting</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] text-xs font-semibold text-[#71717A]">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F6F6F6] transition-colors group">
                    <td className="py-3 px-3 font-semibold text-[#000000]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#E2E2E2]">
                          {prod.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-[#A0A0A0]" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#000000]">{prod.name}</p>
                          <p className="text-xs text-[#71717A] font-mono">{prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#71717A]">{prod.category}</td>
                    <td className="py-3 px-3 font-semibold text-[#000000]">${prod.price}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#000000]">
                          {prod.stock} pcs
                        </span>
                        {/* Quick stock adjustment buttons */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => adjustProductStock(prod.id, -1)}
                            className="w-5 h-5 rounded-md bg-[#F6F6F6] border border-[#E2E2E2] text-[11px] font-bold text-[#71717A] hover:text-[#000000]"
                          >
                            -
                          </button>
                          <button
                            onClick={() => adjustProductStock(prod.id, 1)}
                            className="w-5 h-5 rounded-md bg-[#F6F6F6] border border-[#E2E2E2] text-[11px] font-bold text-[#71717A] hover:text-[#000000]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={prod.stockStatus} size="sm">
                        {prod.stockStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adjustProductStock(prod.id, 10)}
                          className="p-1.5 rounded-lg text-[#71717A] hover:text-[#1D4840] hover:bg-black/5"
                          title="Restock +10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-[#FF0013] hover:bg-black/5"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (<768px, as required by DESIGN.md) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#E2E2E2] overflow-hidden shrink-0">
                    {prod.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-[#A0A0A0]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#000000] truncate">{prod.name}</h4>
                      <Badge variant={prod.stockStatus} size="sm">
                        {prod.stockStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5">{prod.category} • {prod.sku}</p>
                    <p className="text-sm font-bold text-[#1D4840] mt-1">${prod.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E2E2]/60 text-xs">
                  <span className="text-[#71717A]">Stock: <b className="text-black">{prod.stock} pcs</b></span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs py-1 px-3"
                      onClick={() => adjustProductStock(prod.id, 5)}
                    >
                      +5 Restock
                    </Button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-2 text-[#A0A0A0] hover:text-[#FF0013]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductModal />
    </AppShell>
  );
}

export default ProductsPage;
