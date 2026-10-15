'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { ProductStatus } from '@/lib/types';
import { toast } from 'sonner';

export function ProductModal() {
  const { isNewProductModalOpen, setIsNewProductModalOpen, addProduct } = useMerchly();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Chair');
  const [price, setPrice] = useState<number>(99);
  const [cost, setCost] = useState<number>(45);
  const [stock, setStock] = useState<number>(20);
  const [reorderPoint, setReorderPoint] = useState<number>(5);
  const [status, setStatus] = useState<ProductStatus>('published');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&auto=format&fit=crop&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      toast.error('Please provide product name and SKU');
      return;
    }

    const success = addProduct({
      name,
      sku,
      category,
      price: Number(price),
      cost: Number(cost),
      stock: Number(stock),
      reorderPoint: Number(reorderPoint),
      status,
      imageUrl,
    });

    if (success) {
      setIsNewProductModalOpen(false);
      setName('');
      setSku('');
      setStock(20);
    }
  };

  return (
    <Modal
      isOpen={isNewProductModalOpen}
      onClose={() => setIsNewProductModalOpen(false)}
      title="Add New Product"
      description="Enter product details, pricing, and initial inventory stock."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Nordic Lounge Chair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              SKU
            </label>
            <input
              type="text"
              placeholder="e.g. NRD-CHR-09"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm bg-white"
            >
              <option value="Chair">Chair</option>
              <option value="Table">Table</option>
              <option value="Sofa">Sofa</option>
              <option value="Bed">Bed</option>
              <option value="Storage">Storage</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        {/* Pricing & Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Retail Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Cost per Unit ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
            />
          </div>
        </div>

        {/* Stock & Reorder point */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Initial Stock (Pcs)
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Low-Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              value={reorderPoint}
              onChange={(e) => setReorderPoint(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
              required
            />
          </div>
        </div>

        {/* Photo URL */}
        <div>
          <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
            Photo URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
            placeholder="https://..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2E2]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewProductModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
