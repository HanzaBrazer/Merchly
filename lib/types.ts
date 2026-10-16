export type Plan = 'FREE' | 'PRO' | 'BUSINESS';
export type MemberRole = 'owner' | 'admin' | 'staff' | 'viewer';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ProductStatus = 'published' | 'draft' | 'hidden' | 'under_review';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderPoint: number;
  status: ProductStatus;
  stockStatus: StockStatus;
  imageUrl?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  deliveryTimeDays?: number;
  shippingDistanceMiles?: number;
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  lastOrderDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  images?: string[];
  isAiGenerated?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  channel: 'all' | 'whatsapp' | 'web' | 'shopee' | 'tiktok';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Marketplace' | 'Payment' | 'Logistics' | 'CRM' | 'Developers';
  icon: string;
  enabled: boolean;
  connectedAt?: string;
  statusText?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  currency: string;
  salesTargetMonthly: number;
  plan: Plan;
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  currentPeriodEnd?: string;
  category?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar: string;
  workspaceId?: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  workspaceName: string;
  email: string;
  role: MemberRole;
  invitedBy: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

