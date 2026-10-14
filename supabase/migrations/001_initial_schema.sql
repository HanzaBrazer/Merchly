-- =====================================================================
-- MERCHLY SUPABASE MIGRATION SCRIPT
-- Internal Solo SaaS Challenge: "From Zero to Live SaaS"
-- Meets: Bronze (Core MVP), Silver (Billing), Gold (Multi-tenant RBAC)
-- =====================================================================

-- 1. ENUMS
create type plan as enum ('FREE', 'PRO', 'BUSINESS');
create type member_role as enum ('owner', 'admin', 'staff', 'viewer');
create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type product_status as enum ('published', 'draft', 'hidden', 'under_review');

-- 2. WORKSPACES (Multi-Tenancy)
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  plan plan not null default 'FREE',
  currency text not null default 'USD',
  sales_target_monthly numeric(12,2) default 10000,
  category text default 'Furniture',
  created_at timestamptz default now()
);

-- 3. MEMBERSHIPS (RBAC)
create table memberships (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role member_role not null default 'owner',
  created_at timestamptz default now(),
  primary key (workspace_id, user_id)
);

-- 4. CATEGORIES & PRODUCTS
create table categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  sku text,
  category_id uuid references categories(id),
  price numeric(12,2) not null default 0,
  cost numeric(12,2) default 0,
  stock int not null default 0,
  reorder_point int not null default 5,
  status product_status not null default 'published',
  image_url text,
  created_at timestamptz default now()
);

-- 5. CUSTOMERS & ORDERS
create table customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  customer_id uuid references customers(id),
  order_number text not null,
  status order_status not null default 'pending',
  total numeric(12,2) not null default 0,
  shipping_address text,
  tracking_number text,
  delivery_time_days numeric(4,1) default 3.5,
  shipping_distance_miles int default 350,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  qty int not null,
  price numeric(12,2) not null
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  product_id uuid not null references products(id),
  change int not null,
  reason text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 6. SUBSCRIPTIONS (Stripe Sandbox Billing)
create table subscriptions (
  workspace_id uuid primary key references workspaces(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan plan not null default 'FREE',
  status text not null default 'ACTIVE',
  current_period_end timestamptz
);

create table invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  email text not null,
  role member_role not null default 'staff',
  token text unique not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- 7. ATOMIC ORDER CREATION (Anti-Race Condition Function)
create or replace function create_order(
  p_workspace uuid,
  p_customer uuid,
  p_items jsonb,
  p_order_number text,
  p_shipping_address text default null
)
returns uuid language plpgsql security definer as $$
declare
  v_order uuid;
  it jsonb;
  v_total numeric := 0;
begin
  insert into orders(workspace_id, customer_id, order_number, shipping_address)
  values (p_workspace, p_customer, p_order_number, p_shipping_address)
  returning id into v_order;

  for it in select * from jsonb_array_elements(p_items) loop
    update products set stock = stock - (it->>'qty')::int
    where id = (it->>'product_id')::uuid
      and workspace_id = p_workspace
      and stock >= (it->>'qty')::int;

    if not found then
      raise exception 'Stok tidak mencukupi untuk item %', it->>'product_id';
    end if;

    insert into order_items(order_id, product_id, qty, price)
    values (v_order, (it->>'product_id')::uuid, (it->>'qty')::int, (it->>'price')::numeric);

    insert into stock_movements(workspace_id, product_id, change, reason)
    values (p_workspace, (it->>'product_id')::uuid, -(it->>'qty')::int, 'sale');

    v_total := v_total + (it->>'qty')::int * (it->>'price')::numeric;
  end loop;

  update orders set total = v_total where id = v_order;
  return v_order;
end $$;

-- 8. ROW LEVEL SECURITY (RLS)
alter table workspaces enable row level security;
alter table memberships enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table stock_movements enable row level security;
alter table subscriptions enable row level security;
alter table invites enable row level security;

create policy ws_isolation_products on products for all using (
  workspace_id in (select workspace_id from memberships where user_id = auth.uid())
);
create policy ws_isolation_orders on orders for all using (
  workspace_id in (select workspace_id from memberships where user_id = auth.uid())
);
create policy ws_isolation_customers on customers for all using (
  workspace_id in (select workspace_id from memberships where user_id = auth.uid())
);
