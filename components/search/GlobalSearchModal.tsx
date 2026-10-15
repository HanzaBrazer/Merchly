'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Package, MessageCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useMerchly } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';

export function GlobalSearchModal() {
  const router = useRouter();
  const { isSearchModalOpen, setIsSearchModalOpen, products, orders, conversations } = useMerchly();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 3);

  const filteredOrders = query.trim()
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          o.customerName.toLowerCase().includes(query.toLowerCase())
      )
    : orders.slice(0, 3);

  const filteredChats = query.trim()
    ? conversations.filter(
        (c) =>
          c.customerName.toLowerCase().includes(query.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(query.toLowerCase())
      )
    : conversations.slice(0, 2);

  const handleSelect = (url: string) => {
    setIsSearchModalOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={() => setIsSearchModalOpen(false)}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-[#E2E2E2] pb-3">
          <Search className="w-5 h-5 text-[#A0A0A0] absolute left-0" />
          <input
            type="text"
            placeholder="Search products, orders, customers, or messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-4 text-base bg-transparent focus:outline-none placeholder:text-[#A0A0A0] text-[#000000]"
            autoFocus
          />
        </div>

        {/* Results Sections */}
        <div className="max-h-[60vh] overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-2">
                Products
              </span>
              <div className="space-y-1">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('/dashboard/products')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F6F6F6] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-center text-[#CE3627]">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#000000]">{p.name}</p>
                        <p className="text-xs text-[#71717A]">
                          {p.sku} • ${p.price} • Stock: {p.stock} pcs
                        </p>
                      </div>
                    </div>
                    <Badge variant={p.stockStatus} size="sm">
                      {p.stockStatus.replace('_', ' ')}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {filteredOrders.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-2">
                Orders
              </span>
              <div className="space-y-1">
                {filteredOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleSelect('/dashboard/orders')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F6F6F6] text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-center text-[#CE3627]">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#000000]">
                          {o.orderNumber} — {o.customerName}
                        </p>
                        <p className="text-xs text-[#71717A]">
                          {o.items.length} items • ${o.total} • {o.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant={o.status as any} size="sm">
                      {o.status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chats */}
          {filteredChats.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider block mb-2">
                Conversations
              </span>
              <div className="space-y-1">
                {filteredChats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('/dashboard/chats')}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F6F6F6] text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F6F6F6] border border-[#E2E2E2] flex items-center justify-center text-[#CE3627]">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#000000]">{c.customerName}</p>
                        <p className="text-xs text-[#71717A] truncate max-w-xs">{c.lastMessage}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#A0A0A0]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
