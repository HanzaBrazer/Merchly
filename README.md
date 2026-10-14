# 🚀 Merchly — All-in-One Retail & E-Commerce Operations Platform

> **Internal Solo SaaS Challenge: "From Zero to Live SaaS"**  
> **Status:** Bronze ✅ | Silver (Syarat Wajib Podium) ✅ | Gold (Enterprise RBAC) ✅

**Merchly** is an all-in-one operations & business analytics platform built specifically for small-to-midsize retail and e-commerce brands. It unifies finance analytics, order fulfillment, inventory stock control, and AI-assisted customer communication into a single high-performance workspace.

---

## 🌟 Fitur Utama & Kesesuaian Desain Figma

1. **Executive Business Analytics (`/dashboard`)**
   - Kartu metrik: *Total Sales (3,700)*, *Total Customers (2,250)*, *Total Revenue ($7,865)*, *Total Products (248)*.
   - **Sales Overview Gauge:** Semi-circular gauge (85% Sales Growth) dengan visual bar *Net Profit vs Gross Revenue vs Target*.
   - **Revenue Insights Chart:** Grouped bar chart Recharts perbandingan mingguan (*This week vs Last week*).
   - **Recent Sales:** Tabel transaksi responsif (DataTable pada Desktop, Card interaktif pada Mobile).

2. **Orders Management & Fulfillment Hub (`/dashboard/orders`)**
   - Metrik logistik: *Total Orders (432,500)*, *Average Delivery Time (4.1 days)*, *Average Shipping Distance (481 miles)*.
   - **Order Status Pipeline:** Segmented progress bar untuk status *Pending*, *Shipped*, dan *Canceled*.
   - **Pengurangan Stok Transaksional (Atomic):** Membuat pesanan baru langsung memotong stok produk secara atomik dan mencatat audit pergerakan stok.
   - **Restorasi Stok:** Membatalkan pesanan (*Cancel Order*) otomatis mengembalikan kuantitas stok ke katalog.
   - **Public Order Tracking (`/track` & `/track/[id]`):** Portal pelacakan resi publik tanpa harus login.

3. **Smart Inventory Catalog & AI Insights (`/dashboard/products`)**
   - Breakdown kesehatan stok: *In stock (700)*, *Low stock (29)*, *Out of stock (12)*.
   - **AI Insight Card:** Notifikasi cerdas rekomendasi restock otomatis (*"Stock up 6% in 7 days"*, *"Sales up 9% vs last week"*).
   - Tab status produk: *Published*, *Drafts*, *Hidden*, *All Items*.
   - Tambah produk baru, edit kuantitas stok cepat (+ / -), dan hapus produk.

4. **Omnichannel AI Support Desk (`/dashboard/chats`)**
   - Tampilan chat 2 kolom (responsif dengan drawer toggle di mobile 390px).
   - Daftar kontak pelanggan dengan indikator online & badge unread count merah.
   - Dukungan lampiran foto barang komplain (foto meja lecet sesuai Figma).
   - **"Productive with AI" Quick Reply:** 1-klik generate balasan otomatis yang sopan dan solutif.

5. **Integrations Directory (`/dashboard/integrations`)**
   - 10 konektor dari Figma: **TikTok Shop, Shopee, Amazon, Stripe, PayPal, DHL Express, HubSpot, WhatsApp Business, Zendesk, Custom Webhooks**.
   - Dilengkapi saklar interaktif *On/Off* dan status sinkronisasi.

6. **Monetisasi & Stripe Sandbox Billing (`/dashboard/settings` & Upgrade Modal)**
   - 3 Tier Berjenjang: **Free ($0)**, **Pro ($19/bln)**, dan **Business ($49/bln)**.
   - **Stripe Sandbox Checkout:** Terintegrasi kartu tes `4242 4242 4242 4242` dan webhook instan.
   - **Paywall Server-side Enforcement:** Fitur Advanced Analytics dan AI di-gate untuk pengguna Free.
   - **Customer Portal:** Manajemen langganan mandiri.

7. **Team Management & RBAC (Gold Tier)**
   - Pembagian hak akses: **Owner, Admin, Staff, Viewer**.
   - Undangan tim (*Invite Member*) dengan proteksi kuota Business tier.

8. **Onboarding Personalization Wizard (`/onboarding`)**
   - 3 langkah wizard dari Figma untuk personalisasi jenis industri (*Fashion, Electronics, Furniture, F&B, Beauty, Others*).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Tokens Desain Figma (`#1D4840`, `#97DF68`, `#F6F6F6`)
- **Data Visualization:** Recharts
- **Icons & Motion:** Lucide Icons + Framer Motion
- **Database & Auth Schema:** Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Billing:** Stripe Node.js SDK (Checkout & Webhooks)
- **Deployment Target:** Vercel (Production Ready)

---

## 📱 Responsiveness (Desktop, Tablet, Mobile 390px)

- **Desktop (1024px+):** Sidebar kiri tetap (240px-280px) + TopBar ringkas + Grid 4 kolom.
- **Tablet (768px - 1023px):** Grid 2 kolom + Collapsible navigation.
- **Mobile (<768px / 390px iPhone & Android):**
  - Topbar dengan tombol hamburger drawer (Sheet).
  - Bottom navigation bar untuk navigasi 1 jempol (*Dashboard, Orders, Products, Chats, More*).
  - Tabel otomatis berubah menjadi kartu data (*label-value pairs*).
  - Modal form berubah menjadi *Bottom Sheet*.
  - Touch target $\ge$ 44px.

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Masuk ke folder proyek
cd merchly

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🚢 Panduan Push ke GitHub & Deploy ke Vercel

### 1. Push ke Repository GitHub Anda

```bash
git add .
git commit -m "feat: complete merchly e-commerce retail management platform"
git branch -M main
git remote add origin https://github.com/<username-anda>/<nama-repo>.git
git push -u origin main
```

### 2. Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **"Add New Project"**.
2. Pilih repository GitHub **merchly** yang baru Anda push.
3. Pada bagian **Environment Variables**, masukkan variabel berikut (lihat `.env.example`):
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_BUSINESS`
4. Klik **Deploy**! Vercel akan mengompilasi dan menerbitkan URL HTTPS aktif secara otomatis dalam 1-2 menit.
