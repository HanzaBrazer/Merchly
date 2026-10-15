'use client';

import React from 'react';
import {
  Printer,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  User,
  Package,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMerchly } from '@/lib/store';
import { OrderStatus } from '@/lib/types';
import { toast } from 'sonner';

export function OrderDetailsModal() {
  const { selectedOrder, setSelectedOrder, updateOrderStatus } = useMerchly();

  if (!selectedOrder) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(selectedOrder.id, newStatus);
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  const handlePrint = () => {
    toast.success(`Packing slip for ${selectedOrder.orderNumber} sent to printer!`);
  };

  return (
    <Modal
      isOpen={!!selectedOrder}
      onClose={() => setSelectedOrder(null)}
      title={`Order Details ${selectedOrder.orderNumber}`}
      description={`Placed on ${selectedOrder.date}`}
      maxWidth="xl"
    >
      <div className="space-y-6 text-sm">
        {/* Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              Status:
            </span>
            <Badge variant={selectedOrder.status as any} size="md">
              {selectedOrder.status}
            </Badge>
          </div>

          {selectedOrder.trackingNumber && (
            <div className="flex items-center gap-2 text-xs text-[#CE3627] font-medium bg-[#FEF1ED] border border-[#F7D7D1] px-3 py-1.5 rounded-full">
              <Truck className="w-3.5 h-3.5" />
              <span>Tracking: {selectedOrder.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-[#E2E2E2] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              <User className="w-4 h-4 text-[#CE3627]" />
              <span>Customer</span>
            </div>
            <p className="font-semibold text-[#000000]">{selectedOrder.customerName}</p>
            <p className="text-xs text-[#71717A] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{selectedOrder.customerEmail}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#E2E2E2] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#CE3627]" />
              <span>Shipping Address</span>
            </div>
            <p className="text-xs text-[#000000] leading-relaxed">
              {selectedOrder.shippingAddress || '742 Evergreen Terrace, Springfield, OR'}
            </p>
            <p className="text-[11px] text-[#71717A]">
              Est. Distance: {selectedOrder.shippingDistanceMiles || 340} miles
            </p>
          </div>
        </div>

        {/* Order Items List */}
        <div>
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2">
            Items Purchased ({selectedOrder.items.length})
          </span>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {selectedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E2E2] flex items-center justify-center overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-[#A0A0A0]" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm text-[#000000]">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[#71717A]">
                      Qty: {item.qty} × ${item.price}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#000000]">
                  ${item.qty * item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="p-4 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] flex items-center justify-between">
          <span className="font-semibold text-sm text-[#CE3627]">Total Amount</span>
          <span className="text-2xl font-bold text-[#CE3627]">${selectedOrder.total}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E2E2]">
          <Button type="button" variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print Packing Slip
          </Button>

          <div className="flex items-center gap-2">
            {selectedOrder.status === 'pending' && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange('shipped')}
                >
                  <Truck className="w-4 h-4 mr-1.5" />
                  Mark as Shipped
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Cancel Order
                </Button>
              </>
            )}

            {selectedOrder.status === 'shipped' && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange('delivered')}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Mark as Delivered
              </Button>
            )}

            {selectedOrder.status === 'processing' && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange('shipped')}
              >
                <Truck className="w-4 h-4 mr-1.5" />
                Dispatch &amp; Ship
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
