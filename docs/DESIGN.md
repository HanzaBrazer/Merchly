# DESIGN.md — UI & Responsive Spec

Panduan UI untuk Merchly. Target: **responsif penuh** — jalan mulus dari mobile (360px) sampai desktop. Baca bersama Brief & Build Spec.

## 1. Sumber Kebenaran (Design System)

- **Figma Merchly + design system** yang sudah dibuat adalah acuan. Token: **primary red `#CE3627`** (+ skala 50–900), neutral grey, semantic (success `#0E8F21`, danger `#FF0013`, warning, info). Tipografi **Geist** (Heading / Subheading / Body / Label). **Button pill** (Primary/Secondary/Outline/Danger/Text × Default/Hover/Pressed/Disabled). Ikon **Linear 24px**.
- Map ke **tailwind.config** (`colors.primary=#CE3627` dst, font Geist, radius pill untuk Button). Pakai **shadcn/ui**, override agar cocok token.

## 2. Breakpoints & Grid

- **Mobile-first.** Tailwind: base `<640` (mobile), `sm 640`, `md 768` (tablet), `lg 1024` (desktop), `xl 1280`.
- Container maks `xl`; padding 16 (mobile) → 24–32 (desktop); skala spacing 4px.

## 3. App Shell & Navigasi (responsif)

- **Desktop (lg+):** sidebar kiri tetap (~240px) + topbar (search, notifikasi, avatar). Konten di kanan.
- **Tablet (md):** sidebar collapsible (icon-only) / toggle.
- **Mobile (<md):** sidebar jadi **drawer** (shadcn **Sheet**) dibuka via hamburger di topbar; atau **bottom-nav** untuk menu utama (Dashboard/Orders/Products/Customers). Topbar ringkas + ikon search.

## 4. Pola Responsif Umum (WAJIB)

- **Tabel → kartu:** DataTable di desktop; di mobile tiap baris jadi **Card** (label–value).
- **Dialog → Sheet:** form modal di desktop pakai **Dialog**; di mobile pakai **Sheet** (bottom).
- **Grid metrik:** 4 kolom (desktop) → 2 (tablet) → 1 (mobile).
- **Chart:** sederhanakan di mobile (legend di bawah, label lebih sedikit).
- **Touch target ≥44px**; font min 14px; hindari aksi hover-only (sediakan padanan tap).

## 5. Spesifikasi Per Layar (desktop vs mobile)

- **Auth / Onboarding:** card ter-center; mobile full-width padded. Create-workspace step.
- **Dashboard:** kartu metrik (grid responsif) + chart revenue + recent sales (tabel→kartu) + widget low-stock.
- **Products:** list (DataTable→cards) + search/filter + tombol Add (Dialog→Sheet); badge status stok (In/Low/Out); empty state.
- **Orders:** list + filter status (tabs/chips) + search; detail (halaman penuh di mobile, drawer di desktop); aksi ubah status; timeline.
- **Customers:** list + detail (histori order, total spent).
- **Analytics:** chart lebih kaya; untuk Free → **paywall overlay**.
- **Pricing / Upgrade:** 3 kartu tier (stacked di mobile); tombol Upgrade → Stripe Checkout.
- **Settings / Team:** profil, workspace, Team (invite + role) — gated Business.

## 6. Komponen (shadcn mapping)

Button (pill, varian token) · Card · Table/DataTable · Dialog + Sheet · DropdownMenu · Form + zod · Input/Select · Badge (status) · Tabs · Toast (Sonner) · Skeleton · Command (search) · Avatar · Dialog paywall.

## 7. State UX (wajib tiap list/form)

- **Loading** → Skeleton (bukan spinner kosong).
- **Empty** → ilustrasi + CTA (mis. "Belum ada produk — Tambah Produk").
- **Error** → pesan ramah + retry.
- **Success** → Toast.
- **Paywall** → overlay "🔒 Available on Pro" + tombol Upgrade.

## 8. Theming & Aksesibilitas

- **Light theme** sesuai desain; tampilan **flat** (shadow ringan, radius konsisten dari token).
- **Kontras AA:** tombol primary `#CE3627` + teks **putih** (jangan teks gelap di atasnya).
- **Focus ring** terlihat; semua elemen interaktif reachable via keyboard; label pada input.
