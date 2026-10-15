# Merchly — Product Brief & User Flows

Internal Solo SaaS Challenge · "From Zero to Live SaaS"

## Ringkasan Eksekutif

Merchly adalah SaaS dashboard all-in-one untuk bisnis retail & e-commerce kecil–menengah untuk mengelola produk, inventory, order, customer, dan performa bisnis dari satu workspace. Target minimum challenge adalah **Badge Silver** (Auth + Core MVP + live/HTTPS + Stripe sandbox + webhook + paywall bertingkat); **Gold** (workspace + RBAC + team invite) menjadi stretch di minggu ke-3.

Diferensiasi utamanya adalah **inventory & analytics real-time**: stok berkurang otomatis begitu order dibuat (tanpa refresh), dilengkapi low-stock alert dan saran restock — inilah momen "wow" saat demo. Stack final: **Next.js + TypeScript + Tailwind + shadcn/ui** di atas **Supabase** (Postgres, Auth, Realtime, RLS) dengan **Stripe Billing**, deploy ke **Vercel**.

Dua prinsip arsitektur dikunci sejak awal: billing berada di **level workspace**, dan semua data bisnis membawa `workspace_id` sejak hari pertama agar transisi ke multi-tenant (Gold) mulus tanpa membongkar skema.

## Catatan QC atas Draf Brainstorm

Draf (bantuan GPT) sudah kuat di fondasi dan sebagian besar dipakai. **Yang sudah bagus & dipertahankan:** problem statement + 4 pilar yang tajam, pemetaan Bronze→Silver→Gold yang benar sesuai brief, prinsip `workspace_id` sejak awal, entitlement system (bukan hardcode email), daftar event webhook, dan skrip demo naratif.

**Yang diperbaiki / ditambahkan di brief ini:**

1. **Stack dibuat koheren.** Draf mencampur Auth.js + Supabase dan Prisma + Supabase hosting tanpa keputusan tegas. Brief ini memilih Supabase sebagai backbone (Postgres + Auth + Realtime + RLS); tradeoff Prisma vs Supabase client dijelaskan di bagian arsitektur.
2. **Diferensiasi real-time dimasukkan.** Draf belum menonjolkan Supabase Realtime, padahal itu nilai jual utama dan momen "wow" demo.
3. **Spec Customer diperjelas** (lifecycle + klarifikasi sisi customer-facing).
4. **Asal order diklarifikasi:** order dibuat manual oleh admin (MVP); storefront di luar scope.
5. **Konkurensi stok ditambahkan:** pengurangan stok harus transaksional (Postgres function).
6. **Keamanan webhook ditambahkan:** verifikasi signature + idempotency.
7. **Enforcement paywall server-side.**
8. **Billing ditegaskan di level workspace** (bukan per user).

## Problem Statement & Target User

**Target user:** pemilik dan staf bisnis **retail & e-commerce kecil–menengah** yang sudah punya aktivitas penjualan sendiri — bukan marketplace seperti Tokopedia/Shopee.

**Masalah:** data produk, inventory, order, customer, dan sales tersebar di spreadsheet, sistem toko, dan WhatsApp. Owner tidak punya *single source of truth* dan lambat mengambil keputusan operasional.

Pertanyaan harian yang sulit dijawab cepat: produk apa hampir habis / perlu restock? Berapa order pending & rata-rata fulfillment? Revenue minggu ini naik/turun? Produk mana paling laku / slow-moving? Siapa yang menangani order tertentu?

Janji inti: **"Dalam 10 detik saya tahu kondisi bisnis saya."**

## Konsep Produk & Value Proposition

Empat pilar — **Analytics, Orders, Products (Inventory), Customers** — berdiri di atas satu fondasi: **workspace** multi-tenant, **billing** Stripe, dan **RBAC**. Diferensiasi utama ada pada **Products & Analytics yang real-time** — stok dan metrik berubah seketika saat order dibuat, lengkap dengan low-stock alert dan saran restock.

## Spesifikasi Admin (Pengguna Dashboard)

**Admin** adalah pengguna yang login ke dashboard Merchly untuk menjalankan toko. Satu workspace bisa memiliki banyak admin dengan peran berbeda via RBAC (aktif penuh di Gold / tier Business).

**Persona peran:** Owner (akses penuh + billing + hapus workspace), Admin (operasional, tanpa billing), Staff (operator harian), Viewer (read-only).

**Matriks RBAC** (✅ penuh, 👁️ lihat saja, ❌ tidak ada):

| Kapabilitas | Owner | Admin | Staff | Viewer |
| --- | :---: | :---: | :---: | :---: |
| Lihat Dashboard & Analytics | ✅ | ✅ | ✅ (ringkas) | 👁️ |
| Kelola Produk (CRUD, stok, publish) | ✅ | ✅ | ✅ | 👁️ |
| Kelola Order (ubah status) | ✅ | ✅ | ✅ | 👁️ |
| Kelola Customer | ✅ | ✅ | ✅ | 👁️ |
| Export / CSV import | ✅ | ✅ | ❌ | ❌ |
| Kelola Tim (invite, ubah role) | ✅ | ✅ | ❌ | ❌ |
| Billing & Subscription | ✅ | ❌ | ❌ | ❌ |
| Hapus Workspace | ✅ | ❌ | ❌ | ❌ |

Untuk Bronze/Silver cukup satu admin (owner). Peran multi-role diaktifkan di Gold; model data sudah menyiapkannya lewat tabel `memberships` + kolom `role`.

## Spesifikasi Customer

Di Merchly, **"customer" adalah entitas yang dikelola admin** (pembeli dari toko), **bukan** pengguna yang login. Tidak ada autentikasi customer sepanjang Bronze–Gold.

**Atribut:** nama, email, telepon (opsional); total orders, total spent, tanggal order terakhir; status Active/Inactive/VIP; histori order.

**Lifecycle:** Baru → Active → Repeat/VIP → Inactive.

**Sumber data:** otomatis saat admin membuat order (match email), atau manual.

**Keputusan (dikonfirmasi):** customer-facing boleh ditambah jika penting untuk flow. Rekomendasi minimal: halaman **Order Tracking** publik (tanpa login, via link/kode order) untuk cek status pesanan — murah, memperkuat alur order, bagus untuk demo. **Storefront penuh** (browse → cart → checkout) tetap **di luar scope** dan **bukan syarat Silver**; kerjakan hanya sebagai stretch Minggu 3 setelah Silver aman.

## User Flow End-to-End

### A. Onboarding
1. Landing page → **Get Started**.
2. **Sign Up** (OAuth Google/GitHub atau email + password).
3. **Create Workspace** (mis. "Nordic Furniture") → role **Owner**, plan **Free**.
4. (Opsional) onboarding checklist / skip.
5. Masuk ke **Dashboard**.

### B. Operasional Harian — Produk & Order (Core MVP)
**Produk:** Add Product (nama, SKU, kategori, harga, cost, stok, reorder point, foto); status stok otomatis (Out/Low/In); Edit/Hide/Publish/Delete.

**Order lifecycle:**
1. New Order (pilih customer, item + qty).
2. Simpan → **transaksi atomik**: buat `order` + `order_items`, kurangi `products.stock`, catat `stock_movement` (reason=sale).
3. **Realtime:** stok & analytics ter-update di semua layar **tanpa refresh**; low-stock alert saat stok ≤ reorder point.
4. Status: **Pending → Processing → Shipped → Delivered**; Pending/Processing → **Cancelled** (stok dikembalikan).
5. Filter & search by status / customer.

### C. Billing & Upgrade (Silver)
1. User Free buka fitur terkunci → **paywall** "🔒 Upgrade to Pro".
2. Pricing → pilih Pro/Business → **Upgrade**.
3. Redirect ke **Stripe Checkout** (subscription, test mode).
4. Bayar kartu test `4242 4242 4242 4242` → sukses.
5. Stripe kirim webhook `checkout.session.completed`.
6. Backend **verifikasi signature** → update `subscriptions` untuk **workspace**.
7. **Entitlement** berubah → fitur terbuka otomatis. Kelola/cancel via **Customer Portal**.

### D. Team & RBAC (Gold)
1. Settings → Team → **Invite Member** (email + role).
2. Undangan (link/token) tercatat di `invites`.
3. Penerima sign up/in → bergabung dengan role tersebut.
4. Akses difilter per role; data **terisolasi per workspace** lewat RLS.

### E. Customer (pendukung)
1. Customer dibuat otomatis saat order (match email) atau manual.
2. Customers → daftar + metrik; detail → histori order.
3. (Stretch) customer buka link **Order Tracking** publik — tanpa login.

## Scope per Badge & Definition of Done

### Bronze — Fondasi SaaS (Minggu 1)
- [ ] Auth + session aman
- [ ] Buat workspace otomatis saat signup
- [ ] CRUD Produk + upload foto + status stok otomatis
- [ ] CRUD Order yang mengurangi stok secara transaksional
- [ ] Dashboard analytics dasar
- [ ] Deploy live di Vercel (HTTPS)

### Silver — Monetisasi (Minggu 2) · syarat podium
- [ ] Pricing page Free / Pro / Business
- [ ] Stripe Checkout (subscription, test mode)
- [ ] Webhook 5 event + verifikasi signature + idempotency
- [ ] Tabel `subscriptions` di-update oleh webhook
- [ ] Paywall/entitlement memengaruhi fitur nyata
- [ ] Stripe Customer Portal
- [ ] Real-time stok + low-stock alert

### Gold — Enterprise-ready (Minggu 3, stretch)
- [ ] Workspace multi-tenant + isolasi data (RLS)
- [ ] Team invite
- [ ] RBAC menegakkan akses
- [ ] Billing level workspace; seat di-gate pada tier Business

## Pricing, Tier & Entitlement

Angka harga untuk mendemonstrasikan mekanisme SaaS billing, bukan harga final.

| Fitur | Free ($0) | Pro ($19/bln) | Business ($49/bln) |
| --- | :---: | :---: | :---: |
| Produk | ≤ 50 | Unlimited | Unlimited |
| Order / bulan | ≤ 100 | Unlimited | Unlimited |
| Dashboard dasar | ✅ | ✅ | ✅ |
| Advanced & customer analytics | ❌ | ✅ | ✅ |
| Low-stock alert + saran restock | ❌ | ✅ | ✅ |
| CSV import / export | ❌ | ✅ | ✅ |
| Team members + RBAC | ❌ | ❌ | ✅ |
| Priority support | ❌ | ❌ | ✅ |

**Arsitektur paywall:** satu fungsi `canAccess(workspace, feature)` memetakan `plan → fitur`; **enforce di server**; UI tetap menampilkan state terkunci ("🔒 Available on Pro").

## Integrasi Stripe & Webhook

**Stripe test mode (sandbox)**, langganan di **level workspace**. Alur: Pricing → Stripe Checkout (subscription) → bayar kartu test → webhook → update `subscriptions` → entitlement unlock. Kelola/cancel via Customer Portal.

| Event | Aksi di backend |
| --- | --- |
| `checkout.session.completed` | Aktifkan plan, simpan `stripe_customer_id` & `stripe_subscription_id` |
| `invoice.paid` | Perbarui `current_period_end` (renewal) |
| `customer.subscription.updated` | Sinkron plan/status |
| `customer.subscription.deleted` | Downgrade ke Free |
| `invoice.payment_failed` | Tandai `PAST_DUE` |

**Wajib:** verifikasi signature (`stripe-signature`); idempotency (simpan `event.id`); Stripe CLI untuk test lokal.

**Tabel `subscriptions` (per workspace):** `id`, `workspace_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `plan`, `status`, `current_period_start`, `current_period_end`.

## Tech Stack & Arsitektur

Arsitektur: Next.js (Vercel) ↔ Supabase (Postgres/Auth/Realtime/RLS); Stripe via webhook ke Next.js API; stok realtime dari Supabase ke browser.

**Stack final:** Next.js + TypeScript + Tailwind + shadcn/ui · Supabase · Stripe Billing · deploy **Vercel**.

**Keputusan kunci:** Auth = **Supabase Auth** (menyatu dengan RLS); Data access = **Supabase client + RLS** (Prisma boleh untuk migrasi/skema); Realtime = **Supabase Realtime** (diferensiasi).

**Struktur folder (modular monolith):** `app/(auth)`, `app/dashboard/{products,orders,customers,analytics,settings}`, `app/api/{products,orders,stripe}`, `components/{dashboard,ui}`, `lib/{supabase,stripe,permissions}`.

## Data Model

Semua tabel bisnis membawa `workspace_id` (multi-tenant + RLS).

| Tabel | Field kunci | Relasi |
| --- | --- | --- |
| `profiles` | id (= auth uid), name, avatar | 1–1 auth user |
| `workspaces` | id, name, owner_id, plan, subscription_status | punya banyak member, product, order, customer |
| `memberships` | workspace_id, user_id, role | user ↔ workspace (M–N) |
| `categories` | id, workspace_id, name | punya banyak product |
| `products` | id, workspace_id, name, sku, category_id, price, cost, stock, reorder_point, status, image_url | dirujuk order_items & stock_movements |
| `customers` | id, workspace_id, name, email, phone, status | punya banyak order |
| `orders` | id, workspace_id, customer_id, status, total, created_at | punya banyak order_item |
| `order_items` | id, order_id, product_id, qty, price | item dari sebuah order |
| `stock_movements` | id, workspace_id, product_id, change, reason, created_by, created_at | audit stok + sumber realtime |
| `subscriptions` | lihat bagian Stripe | 1–1 workspace |
| `invites` | id, workspace_id, email, role, token, status | undangan tim (Gold) |

**Catatan teknis:** pengurangan stok lewat Postgres function/transaction (atomik, anti-race); RLS policy = baris terlihat jika `workspace_id` ada di workspace milik user (via `memberships`).

## Roadmap 3 Minggu & Checkpoint

| Minggu | Target | Tugas utama |
| --- | --- | --- |
| **W0 (Jumat ini)** | Kunci ide | Finalisasi problem statement + tech stack untuk Checkpoint Ide |
| **W1 — Bronze** | Live + Auth + Core MVP | Setup; skema DB; Auth + create workspace; CRUD Produk; CRUD Order + stok transaksional + realtime; dashboard dasar; deploy Vercel |
| **W2 — Silver** | Real SaaS (billing) | Pricing; Stripe Checkout; webhook + signature + idempotency; `subscriptions`; entitlement/paywall; Customer Portal; low-stock alert |
| **W3 — Gold + polish** | Demo-ready | Workspace multi-tenant + RLS; team invite; RBAC; saran restock; onboarding; poles UX; seed data; latihan demo |

**Prinsip:** amankan Bronze, lalu Silver **sepenuhnya**, sebelum menyentuh Gold.

## Skrip Demo Day (5 Menit)

Pakai workspace demo **"Nordic Furniture"** dengan seed data realistis.

1. **Sign Up** — "Saya owner toko Nordic Furniture."
2. **Create Workspace** — Nordic Furniture.
3. **Dashboard** — revenue, orders, customers, products.
4. **Add Product** — Oak Dining Table, $399, stok 5.
5. **New Order** — stok **5 → 4 real-time**.
6. **Analytics** — metrik ikut berubah.
7. **Pricing** — Upgrade to Pro.
8. **Stripe Checkout (sandbox)** — bayar kartu test.
9. **Webhook** — subscription **Free → Pro**.
10. **Paywall** — Advanced Analytics yang tadi 🔒 kini **terbuka ✅**.

**Tip:** buka **2 window** saat scene 5 agar juri melihat perubahan real-time tanpa refresh.

## Risiko & Keputusan Terbuka

1. **Customer-facing?** Dikonfirmasi — Order Tracking publik (tanpa login) sebagai stretch W3; storefront penuh di luar scope.
2. **Asal order:** manual oleh admin untuk MVP.
3. **Auth:** Supabase Auth (rekomendasi).
4. **Data access:** Supabase client + RLS (rekomendasi).
5. **Billing per-workspace** dikonfirmasi; seat tier Business = anggota tim.

**Risiko & mitigasi:** scope creep → disiplin per badge; race condition stok → transaksi Postgres; webhook duplikat → signature + idempotency; realtime rumit → mulai refetch; demo gagal → seed data + rekaman cadangan.
