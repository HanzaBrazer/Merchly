'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Order,
  Customer,
  Conversation,
  Integration,
  TeamMember,
  Workspace,
  Plan,
  OrderStatus,
  StockStatus,
  ProductStatus,
  CurrentUser,
  MemberRole,
  WorkspaceInvite,
} from './types';
import {
  initialWorkspace,
  initialProducts,
  initialOrders,
  initialCustomers,
  initialConversations,
  initialIntegrations,
  initialTeamMembers,
} from './seedData';
import { canAccess, PLAN_LIMITS } from './permissions';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from './supabase/client';

interface MerchlyContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  login: (email?: string, name?: string, role?: MemberRole, avatar?: string) => void;
  logout: () => void;
  register: (email: string, name?: string, role?: MemberRole) => void;
  workspace: Workspace;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  conversations: Conversation[];
  integrations: Integration[];
  teamMembers: TeamMember[];
  invitations: WorkspaceInvite[];
  createInvitation: (email: string, role: MemberRole) => WorkspaceInvite;
  acceptInvitation: (token: string, name: string) => boolean;
  activeChatId: string;
  isUpgradeModalOpen: boolean;
  isNewOrderModalOpen: boolean;
  isNewProductModalOpen: boolean;
  isSearchModalOpen: boolean;
  selectedOrder: Order | null;
  // Setters & Modals
  setActiveChatId: (id: string) => void;
  setIsUpgradeModalOpen: (open: boolean) => void;
  setIsNewOrderModalOpen: (open: boolean) => void;
  setIsNewProductModalOpen: (open: boolean) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  setSelectedOrder: (order: Order | null) => void;
  // Core Business Actions
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    items: { productId: string; qty: number }[];
    shippingAddress: string;
  }) => boolean;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addProduct: (productData: {
    name: string;
    sku: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    reorderPoint: number;
    status: ProductStatus;
    imageUrl?: string;
  }) => boolean;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (id: string, delta: number) => void;
  addCustomer: (customerData: { name: string; email: string; phone?: string }) => void;
  sendMessage: (chatId: string, text: string, sender?: 'admin' | 'customer', isAi?: boolean) => void;
  generateAiReply: (chatId: string) => Promise<string>;
  toggleIntegration: (id: string) => void;
  upgradePlan: (newPlan: Plan) => void;
  inviteTeamMember: (data: { name: string; email: string; role: any }) => boolean;
  resetToInitialDemo: () => void;
}

const MerchlyContext = createContext<MerchlyContextType | undefined>(undefined);

const STORAGE_KEY = 'merchly_app_state_v1';
const AUTH_STORAGE_KEY = 'merchly_auth_session';

export function MerchlyProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [invitations, setInvitations] = useState<WorkspaceInvite[]>([
    {
      id: 'inv-01',
      workspaceId: 'ws-nordic-01',
      workspaceName: 'Nordic Furniture',
      email: 'staff@merchly.com',
      role: 'staff',
      invitedBy: 'Raihan Fahreza',
      token: 'inv_demo_staff',
      createdAt: '2026-10-15',
      expiresAt: '2026-10-22',
      status: 'pending',
    },
    {
      id: 'inv-02',
      workspaceId: 'ws-nordic-01',
      workspaceName: 'Nordic Furniture',
      email: 'raihanreza004@gmail.com',
      role: 'admin',
      invitedBy: 'Raihan Fahreza',
      token: 'inv_demo_admin',
      createdAt: '2026-10-15',
      expiresAt: '2026-10-22',
      status: 'pending',
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('chat-01');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      // Check auth session
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth && parsedAuth.name) {
          setCurrentUser(parsedAuth);
          setIsAuthenticated(true);
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workspace) setWorkspace(parsed.workspace);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.conversations) setConversations(parsed.conversations);
        if (parsed.integrations) setIntegrations(parsed.integrations);
        if (parsed.teamMembers) setTeamMembers(parsed.teamMembers);
      }

      // If no saved localStorage auth, check active Supabase OAuth session
      if (isSupabaseConfigured && !savedAuth) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const email = session.user.email || '';
            const metadata = session.user.user_metadata || {};
            const name = metadata.full_name || metadata.name || email.split('@')[0];
            const avatar = metadata.avatar_url || metadata.picture;
            login(email, name, metadata.role, avatar);
          }
        });
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  const login = (email?: string, name?: string, role?: MemberRole, avatar?: string) => {
    const finalEmail = (email || 'raihan@merchly.com').trim();

    // Auto-detect role if not explicitly provided
    let finalRole: MemberRole = role || 'owner';
    if (!role) {
      const lower = finalEmail.toLowerCase();
      if (lower === 'raihanreza004@gmail.com' || lower.includes('admin') || lower.includes('dimas')) {
        finalRole = 'admin';
      } else if (lower.includes('staff') || lower.includes('sarah')) {
        finalRole = 'staff';
      } else {
        finalRole = 'owner';
      }
    }

    let finalName = name;
    if (!finalName) {
      if (finalRole === 'admin') {
        finalName = finalEmail === 'raihanreza004@gmail.com' ? 'Raihan Reza' : 'Dimas Pratama';
      } else if (finalRole === 'staff') {
        finalName = 'Sarah Amelia';
      } else {
        finalName = 'Raihan Fahreza';
      }
    }

    let finalAvatar = avatar;
    if (!finalAvatar) {
      if (finalRole === 'admin') {
        finalAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80';
      } else if (finalRole === 'staff') {
        finalAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80';
      } else {
        finalAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
      }
    }

    const user: CurrentUser = {
      id: `user-${finalRole}-${Date.now()}`,
      name: finalName,
      email: finalEmail,
      role: finalRole,
      avatar: finalAvatar,
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (typeof document !== 'undefined') {
        document.cookie = `merchly_auth=true; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `merchly_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `merchly_has_ws=true; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (typeof document !== 'undefined') {
        document.cookie = `merchly_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `merchly_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `merchly_has_ws=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const register = (email: string, name?: string, role?: MemberRole) => {
    login(email, name, role);
  };

  // Save to local storage
  const saveState = (newState: {
    workspace?: Workspace;
    products?: Product[];
    orders?: Order[];
    customers?: Customer[];
    conversations?: Conversation[];
    integrations?: Integration[];
    teamMembers?: TeamMember[];
  }) => {
    try {
      const current = {
        workspace: newState.workspace || workspace,
        products: newState.products || products,
        orders: newState.orders || orders,
        customers: newState.customers || customers,
        conversations: newState.conversations || conversations,
        integrations: newState.integrations || integrations,
        teamMembers: newState.teamMembers || teamMembers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const calculateStockStatus = (stock: number, reorderPoint: number): StockStatus => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= reorderPoint) return 'low_stock';
    return 'in_stock';
  };

  // 1. CREATE ORDER (Atomic reduction of stock)
  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    items: { productId: string; qty: number }[];
    shippingAddress: string;
  }): boolean => {
    // Check order limits for free plan
    if (workspace.plan === 'FREE' && orders.length >= PLAN_LIMITS.FREE.maxOrdersPerMonth) {
      toast.error('Limit reached: Free plan is limited to 100 orders/month. Upgrade to Pro!');
      setIsUpgradeModalOpen(true);
      return false;
    }

    // Validate inventory stock
    for (const item of orderData.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        toast.error(`Product with ID ${item.productId} not found`);
        return false;
      }
      if (prod.stock < item.qty) {
        toast.error(`Insufficient stock for "${prod.name}" (Available: ${prod.stock}, Requested: ${item.qty})`);
        return false;
      }
    }

    // Deduct stock atomically
    const updatedProducts = products.map((prod) => {
      const orderItem = orderData.items.find((item) => item.productId === prod.id);
      if (orderItem) {
        const newStock = prod.stock - orderItem.qty;
        return {
          ...prod,
          stock: newStock,
          stockStatus: calculateStockStatus(newStock, prod.reorderPoint),
        };
      }
      return prod;
    });

    // Calculate total & build items
    let total = 0;
    const finalItems = orderData.items.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const lineTotal = prod.price * item.qty;
      total += lineTotal;
      return {
        productId: prod.id,
        productName: prod.name,
        qty: item.qty,
        price: prod.price,
        imageUrl: prod.imageUrl,
      };
    });

    // Create or match customer
    let matchedCustomer = customers.find(
      (c) => c.email.toLowerCase() === orderData.customerEmail.toLowerCase()
    );
    let updatedCustomers = [...customers];

    if (matchedCustomer) {
      matchedCustomer = {
        ...matchedCustomer,
        totalOrders: matchedCustomer.totalOrders + 1,
        totalSpent: matchedCustomer.totalSpent + total,
        lastOrderDate: new Date().toISOString().split('T')[0],
        status: matchedCustomer.totalSpent + total > 1000 ? 'vip' : 'active',
      };
      updatedCustomers = updatedCustomers.map((c) =>
        c.id === matchedCustomer!.id ? matchedCustomer! : c
      );
    } else {
      matchedCustomer = {
        id: `cust-${Date.now()}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        totalOrders: 1,
        totalSpent: total,
        status: total > 1000 ? 'vip' : 'active',
        lastOrderDate: new Date().toISOString().split('T')[0],
      };
      updatedCustomers.unshift(matchedCustomer);
    }

    // Create new order
    const randomHex = Math.floor(Math.random() * 8999 + 1000).toString();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#C${randomHex}`,
      customerId: matchedCustomer.id,
      customerName: matchedCustomer.name,
      customerEmail: matchedCustomer.email,
      customerAvatar: matchedCustomer.avatar,
      items: finalItems,
      total,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      shippingAddress: orderData.shippingAddress || '123 Market St, Suite 400',
      deliveryTimeDays: 3.5,
      shippingDistanceMiles: Math.floor(Math.random() * 400 + 150),
    };

    const newOrdersList = [newOrder, ...orders];

    setProducts(updatedProducts);
    setOrders(newOrdersList);
    setCustomers(updatedCustomers);
    saveState({ products: updatedProducts, orders: newOrdersList, customers: updatedCustomers });

    toast.success(`Order ${newOrder.orderNumber} created! Inventory stock updated real-time.`);
    return true;
  };

  // 2. UPDATE ORDER STATUS (and return stock if cancelled)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    let updatedProducts = [...products];

    // If order is cancelled, return stock
    if (newStatus === 'cancelled' && targetOrder.status !== 'cancelled') {
      updatedProducts = updatedProducts.map((prod) => {
        const item = targetOrder.items.find((i) => i.productId === prod.id);
        if (item) {
          const newStock = prod.stock + item.qty;
          return {
            ...prod,
            stock: newStock,
            stockStatus: calculateStockStatus(newStock, prod.reorderPoint),
          };
        }
        return prod;
      });
      setProducts(updatedProducts);
      toast.info(`Stock restored for items in order ${targetOrder.orderNumber}`);
    }

    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    setOrders(updatedOrders);
    saveState({ orders: updatedOrders, products: updatedProducts });
    toast.success(`Order ${targetOrder.orderNumber} updated to ${newStatus}`);
  };

  // 3. ADD PRODUCT
  const addProduct = (productData: {
    name: string;
    sku: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    reorderPoint: number;
    status: ProductStatus;
    imageUrl?: string;
  }): boolean => {
    if (workspace.plan === 'FREE' && products.length >= PLAN_LIMITS.FREE.maxProducts) {
      toast.error('Limit reached: Free plan is limited to 50 products. Upgrade to Pro for unlimited products!');
      setIsUpgradeModalOpen(true);
      return false;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
      stockStatus: calculateStockStatus(productData.stock, productData.reorderPoint),
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl:
        productData.imageUrl ||
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80',
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    saveState({ products: updated });
    toast.success(`Product "${newProduct.name}" added successfully`);
    return true;
  };

  // 4. UPDATE PRODUCT
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const stock = updates.stock !== undefined ? updates.stock : p.stock;
        const reorderPoint =
          updates.reorderPoint !== undefined ? updates.reorderPoint : p.reorderPoint;
        return {
          ...p,
          ...updates,
          stockStatus: calculateStockStatus(stock, reorderPoint),
        };
      }
      return p;
    });
    setProducts(updated);
    saveState({ products: updated });
    toast.success('Product updated');
  };

  // 5. DELETE PRODUCT
  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveState({ products: updated });
    toast.success(`Product "${target?.name || id}" removed`);
  };

  // 6. QUICK ADJUST STOCK
  const adjustProductStock = (id: string, delta: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return {
          ...p,
          stock: newStock,
          stockStatus: calculateStockStatus(newStock, p.reorderPoint),
        };
      }
      return p;
    });
    setProducts(updated);
    saveState({ products: updated });
  };

  // 7. ADD CUSTOMER
  const addCustomer = (customerData: { name: string; email: string; phone?: string }) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      lastOrderDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    saveState({ customers: updated });
    toast.success(`Customer "${newCust.name}" added`);
  };

  // 8. SEND CHAT MESSAGE
  const sendMessage = (
    chatId: string,
    text: string,
    sender: 'admin' | 'customer' = 'admin',
    isAi = false
  ) => {
    const updated = conversations.map((conv) => {
      if (conv.id === chatId) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: any = {
          id: `msg-${Date.now()}`,
          sender,
          senderName: sender === 'admin' ? 'Merchly Support' : conv.customerName,
          text,
          timestamp: now,
          isAiGenerated: isAi,
        };
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: now,
          unreadCount: sender === 'admin' ? 0 : conv.unreadCount + 1,
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });
    setConversations(updated);
    saveState({ conversations: updated });
  };

  // 9. GENERATE AI SMART REPLY
  const generateAiReply = async (chatId: string): Promise<string> => {
    const conv = conversations.find((c) => c.id === chatId);
    if (!conv) return '';

    // Smart contextual prompt based on last message
    const lastMsg = conv.messages[conv.messages.length - 1]?.text.toLowerCase() || '';

    let aiSuggestion =
      "Hello! Thank you for reaching out to Nordic Furniture support. We are checking your details right away and will provide a resolution within 10 minutes.";

    if (lastMsg.includes('scratch') || lastMsg.includes('damage') || lastMsg.includes('refund')) {
      aiSuggestion =
        "Hi Alex, I am very sorry for the inconvenience caused by the scratch. I have alerted our warehouse quality team. We can either ship a brand new tabletop replacement today or process a 20% courtesy credit. Which would you prefer?";
    } else if (lastMsg.includes('shipped') || lastMsg.includes('tracking')) {
      aiSuggestion =
        "Hi James! Your Sapporo Sofa has been packed and handed over to DHL Express. Expected delivery is in 2 business days. Tracking code: TRK-98234710.";
    } else if (lastMsg.includes('address') || lastMsg.includes('change')) {
      aiSuggestion =
        "Hi Olivia! Yes, your order hasn't departed our fulfillment hub yet. Please share the updated address and I will modify the shipping label immediately.";
    }

    return aiSuggestion;
  };

  // 10. TOGGLE INTEGRATION
  const toggleIntegration = (id: string) => {
    const updated = integrations.map((i) => {
      if (i.id === id) {
        const nextState = !i.enabled;
        toast.success(`${i.name} is now ${nextState ? 'Connected' : 'Disconnected'}`);
        return {
          ...i,
          enabled: nextState,
          statusText: nextState ? 'Connected & active' : 'Disconnected',
          connectedAt: nextState ? new Date().toISOString().split('T')[0] : i.connectedAt,
        };
      }
      return i;
    });
    setIntegrations(updated);
    saveState({ integrations: updated });
  };

  // 11. UPGRADE PLAN (Stripe Simulation / Activation)
  const upgradePlan = (newPlan: Plan) => {
    const updatedWorkspace: Workspace = {
      ...workspace,
      plan: newPlan,
      subscriptionStatus: 'ACTIVE',
      currentPeriodEnd: 'Nov 30, 2026',
    };
    setWorkspace(updatedWorkspace);
    saveState({ workspace: updatedWorkspace });
    setIsUpgradeModalOpen(false);
    toast.success(`🎉 Upgraded to ${newPlan} plan! All AI tools and unlimited limits are unlocked.`);
  };

  // 12. INVITE TEAM MEMBER
  const inviteTeamMember = (data: { name: string; email: string; role: any }): boolean => {
    if (!canAccess(workspace.plan, 'team_management')) {
      toast.error('Team invites require Business tier. Please upgrade your plan!');
      setIsUpgradeModalOpen(true);
      return false;
    }

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    };

    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    saveState({ teamMembers: updated });
    toast.success(`Invite sent to ${data.email} (${data.role})`);
    return true;
  };

  const createInvitation = (email: string, role: MemberRole): WorkspaceInvite => {
    const token = 'inv_' + Math.random().toString(36).substring(2, 10);
    const newInv: WorkspaceInvite = {
      id: `inv-${Date.now()}`,
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      email: email.trim(),
      role: role,
      invitedBy: currentUser?.name || 'Raihan Fahreza',
      token: token,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    };
    const updated = [newInv, ...invitations];
    setInvitations(updated);
    toast.success(`Undangan berhasil dibuat untuk ${email} sebagai ${role.toUpperCase()}`);
    return newInv;
  };

  const acceptInvitation = (token: string, name: string): boolean => {
    const inv = invitations.find((i) => i.token === token);
    if (!inv) {
      toast.error('Token undangan tidak ditemukan atau sudah kedaluwarsa.');
      return false;
    }

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: name,
      email: inv.email,
      role: inv.role,
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: inv.role === 'admin'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    };
    const updatedTeam = [...teamMembers.filter((m) => m.email !== inv.email), newMember];
    setTeamMembers(updatedTeam);
    saveState({ teamMembers: updatedTeam });

    const updatedInvs = invitations.map((i) =>
      i.token === token ? { ...i, status: 'accepted' as const } : i
    );
    setInvitations(updatedInvs);

    login(inv.email, name, inv.role, newMember.avatar);
    toast.success(`Selamat bergabung di ${inv.workspaceName} sebagai ${inv.role.toUpperCase()}!`);
    return true;
  };

  const resetToInitialDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWorkspace(initialWorkspace);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setCustomers(initialCustomers);
    setConversations(initialConversations);
    setIntegrations(initialIntegrations);
    setTeamMembers(initialTeamMembers);
    toast.info('Reset to default Nordic Furniture demo state');
  };

  return (
    <MerchlyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        login,
        logout,
        register,
        workspace,
        products,
        orders,
        customers,
        conversations,
        integrations,
        teamMembers,
        activeChatId,
        isUpgradeModalOpen,
        isNewOrderModalOpen,
        isNewProductModalOpen,
        isSearchModalOpen,
        selectedOrder,
        setActiveChatId,
        setIsUpgradeModalOpen,
        setIsNewOrderModalOpen,
        setIsNewProductModalOpen,
        setIsSearchModalOpen,
        setSelectedOrder,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,
        addCustomer,
        sendMessage,
        generateAiReply,
        toggleIntegration,
        upgradePlan,
        inviteTeamMember,
        invitations,
        createInvitation,
        acceptInvitation,
        resetToInitialDemo,
      }}
    >
      {children}
    </MerchlyContext.Provider>
  );
}

export function useMerchly() {
  const context = useContext(MerchlyContext);
  if (!context) {
    throw new Error('useMerchly must be used within a MerchlyProvider');
  }
  return context;
}
