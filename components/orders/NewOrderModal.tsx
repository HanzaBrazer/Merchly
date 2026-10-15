'use client';

import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';

export function NewOrderModal() {
  const { isNewOrderModalOpen, setIsNewOrderModalOpen, products, customers, createOrder } = useMerchly();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ productId: string; qty: number }[]>([
    { productId: products[0]?.id || '', qty: 1 },
  ]);

  const handleAddItem = () => {
    const unselected = products.find((p) => !selectedItems.some((item) => item.productId === p.id));
    if (unselected) {
      setSelectedItems([...selectedItems, { productId: unselected.id, qty: 1 }]);
    } else {
      toast.info('All catalog products already added to this order.');
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemProductChange = (index: number, newProductId: string) => {
    setSelectedItems(
      selectedItems.map((item, i) => (i === index ? { ...item, productId: newProductId } : item))
    );
  };

  const handleQtyChange = (index: number, delta: number) => {
    setSelectedItems(
      selectedItems.map((item, i) => {
        if (i === index) {
          const prod = products.find((p) => p.id === item.productId);
          const maxStock = prod ? prod.stock : 999;
          const nextQty = Math.min(maxStock, Math.max(1, item.qty + delta));
          return { ...item, qty: nextQty };
        }
        return item;
      })
    );
  };

  const handleSelectExistingCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    const cust = customers.find((c) => c.id === custId);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerEmail(cust.email);
    }
  };

  // Calculate live total
  const calculatedTotal = selectedItems.reduce((acc, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return acc + (prod ? prod.price * item.qty : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      toast.error('Please enter customer name and email.');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Please add at least one product.');
      return;
    }

    const success = createOrder({
      customerName,
      customerEmail,
      items: selectedItems,
      shippingAddress: shippingAddress || '742 Evergreen Terrace, Springfield, OR',
    });

    if (success) {
      setIsNewOrderModalOpen(false);
      setCustomerName('');
      setCustomerEmail('');
      setShippingAddress('');
      setSelectedItems([{ productId: products[0]?.id || '', qty: 1 }]);
    }
  };

  return (
    <Modal
      isOpen={isNewOrderModalOpen}
      onClose={() => setIsNewOrderModalOpen(false)}
      title="Create New Order"
      description="Stock will automatically be deducted from inventory in real-time."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {/* Customer Information Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider">
              Customer Details
            </label>
            {customers.length > 0 && (
              <select
                onChange={handleSelectExistingCustomer}
                className="text-xs text-[#CE3627] font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Quick Fill from Customers...
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Full Name (e.g. Alex Johnson)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Shipping Address (e.g. 10880 Wilshire Blvd, Los Angeles)"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
            />
          </div>
        </div>

        {/* Order Items Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider">
              Products to Fulfill
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-semibold text-[#CE3627] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedItems.map((item, idx) => {
              const currentProd = products.find((p) => p.id === item.productId);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2]"
                >
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemProductChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-[#000000] focus:outline-none cursor-pointer truncate"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} — ${p.price} ({p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'})
                      </option>
                    ))}
                  </select>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(idx, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E2E2E2] flex items-center justify-center text-[#71717A] hover:text-[#000000]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-[#000000]">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(idx, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E2E2E2] flex items-center justify-center text-[#71717A] hover:text-[#000000]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="w-16 text-right font-semibold text-[#000000]">
                    ${currentProd ? currentProd.price * item.qty : 0}
                  </span>

                  {/* Delete Item */}
                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-[#A0A0A0] hover:text-[#FF0013]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Total Bar */}
        <div className="p-4 rounded-2xl bg-[#FEF1ED] flex items-center justify-between border border-[#F7D7D1]">
          <div>
            <span className="text-xs text-[#CE3627] font-medium block">Total Order Amount</span>
            <span className="text-xs text-[#71717A]">{selectedItems.length} product(s) selected</span>
          </div>
          <span className="text-2xl font-bold text-[#CE3627]">${calculatedTotal}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2E2]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewOrderModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Order &amp; Deduct Stock
          </Button>
        </div>
      </form>
    </Modal>
  );
}
