'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useMerchly } from '@/lib/store';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const { customers, addCustomer, orders, setSelectedOrder } = useMerchly();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.status === 'vip').length;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase())
    : [];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addCustomer({ name, email, phone });
    setName('');
    setEmail('');
    setPhone('');
    setIsAddCustomerOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000000]">
              Customers
            </h1>
            <p className="text-sm text-[#71717A] mt-1">
              Buyer relationships, lifetime spend, and purchase history.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsAddCustomerOpen(true)}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Customer</span>
          </Button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#CE3627]">
                <Users className="w-5 h-5" />
              </div>
              <span>Total Customers</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#000000]">
              {customers.length}
            </span>
            <div className="mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#0E8F21] font-semibold">
              <span>↑ 3% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF1ED] flex items-center justify-center text-[#CE3627]">
                <Crown className="w-5 h-5 text-[#CE3627]" />
              </div>
              <span>VIP Tier Buyers</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#000000]">{vipCount}</span>
            <div className="mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#71717A]">
              <span>Spent &gt; $1,000</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#CE3627]">
                <DollarSign className="w-5 h-5" />
              </div>
              <span>Total Lifetime Spend</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#000000]">
              ${totalSpentAll.toLocaleString()}
            </span>
            <div className="mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#71717A]">
              <span>Cumulative store volume</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2.5 text-[#71717A] text-sm font-medium mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6F6F6] flex items-center justify-center text-[#CE3627]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span>Average Orders / Buyer</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#000000]">
              {(orders.length / (customers.length || 1)).toFixed(1)}
            </span>
            <div className="mt-2 pt-2 border-t border-[#E2E2E2]/40 text-xs text-[#0E8F21] font-semibold">
              <span>High repeat purchase rate</span>
            </div>
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E2E2] shadow-sm">
          {/* Search bar */}
          <div className="relative max-w-sm mb-5">
            <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E2E2E2] text-xs sm:text-sm focus:outline-none focus:border-[#CE3627] bg-[#F6F6F6]"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E2E2] text-xs font-semibold text-[#71717A]">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Total Spent</th>
                  <th className="py-3 px-3">Last Order</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]/60">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#F6F6F6] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            cust.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                          }
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#000000]">{cust.name}</p>
                          <p className="text-xs text-[#71717A]">{cust.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-[#71717A]">
                      {cust.phone || '+1 (555) 000-0000'}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#000000]">
                      {cust.totalOrders} orders
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#CE3627]">
                      ${cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-[#71717A]">{cust.lastOrderDate}</td>
                    <td className="py-3.5 px-3 text-right">
                      <Badge variant={cust.status as any} size="sm">
                        {cust.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (<768px) */}
          <div className="md:hidden space-y-3">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="p-4 rounded-2xl bg-[#F6F6F6] border border-[#E2E2E2] flex flex-col gap-2.5 active:bg-[#EAEAEA] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        cust.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                      }
                      alt={cust.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm text-[#000000]">{cust.name}</span>
                  </div>
                  <Badge variant={cust.status as any} size="sm">
                    {cust.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E2E2E2]/60">
                  <span className="text-[#71717A]">{cust.totalOrders} orders</span>
                  <span className="font-bold text-sm text-[#CE3627]">
                    ${cust.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          description="Customer Profile & Lifetime Purchase Record"
          maxWidth="lg"
        >
          <div className="space-y-5 text-sm">
            <div className="p-4 rounded-2xl bg-[#F6F6F6] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#71717A]">Lifetime Spend</p>
                <p className="text-2xl font-bold text-[#CE3627]">
                  ${selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>
              <Badge variant={selectedCustomer.status as any} size="md">
                {selectedCustomer.status} Customer
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#71717A]">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#CE3627]" />
                <span className="text-black font-medium">{selectedCustomer.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#CE3627]" />
                <span className="text-black font-medium">
                  {selectedCustomer.phone || '+1 (555) 000-0000'}
                </span>
              </p>
            </div>

            {/* Order History */}
            <div>
              <span className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-2">
                Order History ({customerOrders.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customerOrders.length > 0 ? (
                  customerOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setSelectedCustomer(null);
                        setSelectedOrder(o);
                      }}
                      className="p-3 rounded-2xl bg-[#F6F6F6] hover:bg-[#EAEAEA] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-xs text-[#000000]">{o.orderNumber}</p>
                        <p className="text-[11px] text-[#71717A]">{o.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#000000]">${o.total}</span>
                        <Badge variant={o.status as any} size="sm">
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#71717A] py-2">No past orders recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title="Add Customer"
        description="Register a new buyer profile into your workspace."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2E2]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCustomerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
