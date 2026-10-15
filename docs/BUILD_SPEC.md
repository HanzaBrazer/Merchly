# Build Spec — Antigravity-ready

Spesifikasi teknis untuk membangun Merchly di Antigravity (Gemini 3 Pro). Baca bersama tab Brief (produk/flow) dan DESIGN.md (UI/responsif). Payment: **Stripe Sandbox** (subscription Checkout + webhook).

## 1. Stack, Konvensi & Struktur Folder

- **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**; data via **Supabase** (Postgres, Auth, Realtime, RLS); **Stripe Billing**; deploy **Vercel**.
- Validasi: **zod**; form: **react-hook-form**. Mutasi data lewat **Server Actions**; webhook/callback lewat **Route Handlers** (`app/api/.../route.ts`).
- Query tenant-sensitive lewat Supabase client (RLS aktif). `service_role` hanya di server (webhook/seed).
- Penamaan: tabel/kolom `snake_case`; komponen `PascalCase`; util `camelCase`.

```
app/
  (auth)/login, register
  dashboard/ (layout.tsx = app shell)
    page.tsx, products/, orders/, customers/, analytics/, settings/
  api/stripe/checkout/route.ts, api/stripe/webhook/route.ts, api/stripe/portal/route.ts
components/ ui/ (shadcn), dashboard/, products/, orders/
lib/ supabase/{client,server}.ts, stripe.ts, permissions.ts, validations.ts
supabase/ migrations/*.sql, seed.sql
```

## 2. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only
# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
# App
NEXT_PUBLIC_APP_URL=https://<project>.vercel.app
```
Set di `.env.local` (dev) dan di **Vercel › Environment Variables** (prod). Jangan commit `.env.local`.

## 3. Skema Database (SQL) + RLS

```sql
-- Enums
create type plan as enum ('FREE','PRO','BUSINESS');
create type member_role as enum ('owner','admin','staff','viewer');
create type order_status as enum ('pending','processing','shipped','delivered','cancelled');
create type product_status as enum ('draft','published','hidden');

-- Multi-tenant
create table workspaces ( id uuid primary key default gen_random_uuid(), name text not null, owner_id uuid not null references auth.users(id), plan plan not null default 'FREE', created_at timestamptz default now() );
create table memberships ( workspace_id uuid references workspaces(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, role member_role not null default 'owner', primary key (workspace_id, user_id) );

-- Katalog
create table categories ( id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id) on delete cascade, name text not null );
create table products ( id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id) on delete cascade, name text not null, sku text, category_id uuid references categories(id), price numeric(12,2) not null default 0, cost numeric(12,2) default 0, stock int not null default 0, reorder_point int not null default 5, status product_status not null default 'published', image_url text, created_at timestamptz default now() );

-- Customers & orders
create table customers ( id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id) on delete cascade, name text not null, email text, phone text, created_at timestamptz default now() );
create table orders ( id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id) on delete cascade, customer_id uuid references customers(id), status order_status not null default 'pending', total numeric(12,2) not null default 0, created_at timestamptz default now() );
create table order_items ( id uuid primary key default gen_random_uuid(), order_id uuid not null references orders(id) on delete cascade, product_id uuid not null references products(id), qty int not null, price numeric(12,2) not null );
create table stock_movements ( id uuid primary key default gen_random_uuid(), workspace_id uuid not null references workspaces(id) on delete cascade, product_id uuid not null references products(id), change int not null, reason text not null, created_by uuid, created_at timestamptz default now() );

-- Subscriptions (per workspace) & invites (Gold)
create table subscriptions ( workspace_id uuid primary key references workspaces(id) on delete cascade, stripe_customer_id text, stripe_subscription_id text, stripe_price_id text, plan plan not null default 'FREE', status text not null default 'ACTIVE', current_period_end timestamptz );
create table invites ( id uuid primary key default gen_random_uuid(), workspace_id uuid references workspaces(id) on delete cascade, email text not null, role member_role not null default 'staff', token text unique not null, status text default 'pending', created_at timestamptz default now() );
```

**Fungsi buat order (atomik, anti-race):**
```sql
create or replace function create_order(p_workspace uuid, p_customer uuid, p_items jsonb)
returns uuid language plpgsql security definer as $$
declare v_order uuid; it jsonb; v_total numeric := 0;
begin
  insert into orders(workspace_id, customer_id) values (p_workspace, p_customer) returning id into v_order;
  for it in select * from jsonb_array_elements(p_items) loop
    update products set stock = stock - (it->>'qty')::int
      where id = (it->>'product_id')::uuid and workspace_id = p_workspace and stock >= (it->>'qty')::int;
    if not found then raise exception 'Stok tidak cukup'; end if;
    insert into order_items(order_id, product_id, qty, price) values (v_order,(it->>'product_id')::uuid,(it->>'qty')::int,(it->>'price')::numeric);
    insert into stock_movements(workspace_id, product_id, change, reason) values (p_workspace,(it->>'product_id')::uuid,-(it->>'qty')::int,'sale');
    v_total := v_total + (it->>'qty')::int * (it->>'price')::numeric;
  end loop;
  update orders set total = v_total where id = v_order; return v_order;
end $$;
```

**RLS (isolasi per workspace) — pola untuk SEMUA tabel bisnis:**
```sql
alter table products enable row level security;
create policy ws_rw on products for all using (
  workspace_id in (select workspace_id from memberships where user_id = auth.uid()));
-- ulangi pola yang sama untuk categories, customers, orders, order_items, stock_movements, subscriptions, invites
```

## 4. Auth & Bootstrap Workspace

- Supabase Auth: email+password dan/atau OAuth Google. Redirect = `NEXT_PUBLIC_APP_URL/auth/callback`.
- User baru → **otomatis buat workspace + membership owner + subscription FREE** via trigger:
```sql
create function handle_new_user() returns trigger security definer language plpgsql as $$
declare w uuid;
begin
  insert into workspaces(name, owner_id) values ('Workspace Saya', new.id) returning id into w;
  insert into memberships(workspace_id, user_id, role) values (w, new.id, 'owner');
  insert into subscriptions(workspace_id, plan, status) values (w, 'FREE', 'ACTIVE');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
```
- `middleware.ts` memproteksi `/dashboard/*` (redirect ke `/login` bila tak ada sesi).

## 5. Entitlement / Paywall

```ts
// lib/permissions.ts
const FEATURES = {
  advanced_analytics: ['PRO','BUSINESS'],
  csv_import:         ['PRO','BUSINESS'],
  low_stock_alerts:   ['PRO','BUSINESS'],
  team_management:    ['BUSINESS'],
} as const;
export function canAccess(plan: Plan, f: keyof typeof FEATURES) {
  return FEATURES[f].includes(plan);
}
```
- **Enforce di server** (Server Action/Route Handler), bukan sekadar sembunyikan tombol. UI tampilkan state terkunci (lihat DESIGN.md).
- Limit Free (maks 50 produk, 100 order/bln) dicek di server sebelum insert.

## 6. Integrasi Stripe (Sandbox)

- Buat 2 Price recurring (Pro, Business) di test mode → id ke env.
- **Checkout** (`api/stripe/checkout`): Session `mode:'subscription'`, `line_items:[{price, quantity:1}]`, `success_url`/`cancel_url`, `metadata:{ workspace_id }`.
- **Webhook** (`api/stripe/webhook`): baca raw body, `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)` (**verifikasi signature**); simpan `event.id` di tabel `webhook_events` untuk **idempotency**. Tangani: `checkout.session.completed` (set plan+stripe ids), `invoice.paid` (update period end), `customer.subscription.updated` (sinkron), `customer.subscription.deleted` (→FREE), `invoice.payment_failed` (→PAST_DUE).
- **Customer Portal** (`api/stripe/portal`): `stripe.billingPortal.sessions.create({ customer, return_url })`.
- Test lokal: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 7. Kontrak API / Server Actions

| Action | Input | Output |
| --- | --- | --- |
| `createProduct` | `{name, sku?, categoryId?, price, cost?, stock, reorderPoint?, status}` | `{product}` |
| `updateProduct` / `deleteProduct` | `{id, ...}` / `{id}` | `{product}` / `{ok}` |
| `createOrder` | `{customerId, items:[{productId, qty, price}]}` | `{orderId}` (via RPC `create_order`) |
| `updateOrderStatus` | `{id, status}` | `{order}` (cancel → kembalikan stok) |
| `upsertCustomer` | `{name, email?, phone?}` | `{customer}` |
| `getDashboardMetrics` | `{range}` | `{revenue, orders, customers, products, lowStock, series[]}` |
| `createCheckout` / `openPortal` | `{plan}` / `{}` | `{url}` |

Semua action: cek sesi → cek membership/role → validasi zod → operasi (RLS aktif).

## 8. Realtime (Diferensiasi)

```ts
supabase.channel('ws:'+workspaceId)
  .on('postgres_changes', { event:'*', schema:'public', table:'products', filter:'workspace_id=eq.'+workspaceId }, onChange)
  .subscribe();
```
- Dashboard & halaman Products subscribe → angka stok + kartu metrik update tanpa refresh.
- Low-stock: saat `stock <= reorder_point` → badge + toast (fitur Pro).

## 9. Standar Non-Fungsional

- **Keamanan:** RLS semua tabel; verifikasi signature webhook; gating entitlement di server; `service_role` tak pernah ke client.
- **Validasi & error:** zod di tiap input; pesan error ramah; aman saat data kosong.
- **Responsif:** wajib jalan mulai 360px → desktop. Pola lengkap di **DESIGN.md**.
- **Performa:** index pada `workspace_id`; pagination untuk daftar panjang.

## 10. Seed Data (Demo)

`supabase/seed.sql`: workspace 'Nordic Furniture' + 1 owner, ~12 produk (mis. Oak Dining Table 399 stok 5, beberapa low-stock), 3–4 kategori, ~8 customer, ~15 order lintas status — agar dashboard langsung hidup saat demo.

## 11. Acceptance Criteria (Checklist)

**Auth & Workspace**
- [ ] Signup/login (email + Google) berhasil, sesi aman.
- [ ] User baru otomatis punya 1 workspace + membership owner + subscription FREE.
- [ ] `/dashboard` tak bisa diakses tanpa login.

**Products & Inventory**
- [ ] CRUD produk + upload foto; status stok (In/Low/Out) otomatis.
- [ ] Free diblok server-side saat lebih dari 50 produk.

**Orders**
- [ ] Buat order mengurangi stok + catat `stock_movement` dalam 1 transaksi; gagal bila stok kurang.
- [ ] Ubah status; cancel mengembalikan stok.
- [ ] Stok & metrik update **real-time** tanpa refresh.

**Billing (Silver)**
- [ ] Checkout Stripe (sandbox) sukses dengan kartu test.
- [ ] Webhook (signature terverifikasi) mengubah `subscriptions` → plan.
- [ ] Fitur terkunci terbuka setelah upgrade; portal bisa cancel → balik FREE.
- [ ] Event duplikat tidak menggandakan efek (idempotent).

**Gold**
- [ ] Undang anggota; role menegakkan akses; data antar-workspace terisolasi (RLS).

## 12. Build Task Order — Prompt Siap-Tempel (Antigravity)

Jalankan **per badge**; review Artifact (plan/walkthrough) tiap langkah sebelum eksekusi.

**Bronze**
```
1) Inisialisasi Next.js (App Router, TS, Tailwind, shadcn/ui). Siapkan lib/supabase/{client,server}.ts dan .env.local sesuai Build Spec §2. Buat app shell dashboard sesuai DESIGN.md (sidebar responsif).
2) Buat migration SQL (§3): semua tabel, enum, fungsi create_order, RLS tiap tabel, trigger handle_new_user (§4).
3) Auth Supabase (email + Google) + middleware proteksi /dashboard + halaman login/register.
4) Products: CRUD + upload foto (Supabase Storage) + status stok otomatis + list search/filter (responsif: tabel->kartu di mobile).
5) Orders: form new order memanggil RPC create_order; list + detail + ubah status (cancel mengembalikan stok).
6) Dashboard analytics dasar + Realtime stok. Jalankan seed Nordic Furniture.
7) Deploy Vercel; set env; verifikasi live HTTPS.
```
**Silver**
```
8) Entitlement module (§5) + paywall UI (state terkunci sesuai DESIGN.md).
9) Stripe: Price Pro/Business; route checkout, webhook (5 event + signature + idempotency), portal (§6).
10) Hubungkan entitlement ke subscriptions; uji upgrade->unlock, cancel->lock. Low-stock alert (Pro).
```
**Gold**
```
11) Team: invite (email/token) + join flow; RBAC enforcement per role.
12) Pastikan RLS isolasi antar-workspace; polish empty/loading/error states; latihan demo.
```
