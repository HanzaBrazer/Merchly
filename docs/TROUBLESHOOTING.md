# Panduan Troubleshooting & Auth Flow Merchly (Production & Local)

Dokumen ini merangkum arsitektur autentikasi, penyelesaian kendala *redirect*, dan konfigurasi email OTP untuk platform Merchly SaaS (Next.js App Router + Supabase).

---

## 1. Penyebab Error "Localhost Refused to Connect" di Vercel

### Alur Kerja OAuth yang Benar:
```text
Browser User 
  → Google Cloud OAuth (accounts.google.com)
  → Supabase Auth Server (https://vsoxcoawjcgbppxcsrch.supabase.co/auth/v1/callback)
  → Merchly App Callback (${window.location.origin}/auth/callback)
  → /dashboard (User Lama) ATAU /onboarding (User Baru)
```

### Mengapa Muncul `ERR_CONNECTION_REFUSED`?
Jika di Supabase Dashboard bagian **Site URL** atau **Redirect URLs** masih terpasang `http://localhost:3000`, maka setelah pengguna login di domain produksi Vercel (`https://merchlysaas.vercel.app`), Supabase akan melempar pengguna kembali ke `http://localhost:3000` yang sedang tidak aktif di laptop pengguna.

---

## 2. Checklist Konfigurasi Eksternal (Manual oleh User)

### A. Supabase Dashboard → Authentication → URL Configuration
* **Site URL**:
  ```text
  https://merchlysaas.vercel.app
  ```
* **Redirect URLs** (Tambahkan kedua baris ini):
  ```text
  https://merchlysaas.vercel.app/**
  http://localhost:3000/**
  ```

### B. Google Cloud Console → Credentials → OAuth 2.0 Client ID (Merchly Web)
* **Authorized JavaScript origins**:
  ```text
  https://merchlysaas.vercel.app
  http://localhost:3000
  ```
* **Authorized redirect URIs** (⚠️ Wajib URL callback Supabase):
  ```text
  https://vsoxcoawjcgbppxcsrch.supabase.co/auth/v1/callback
  ```

### C. Vercel Dashboard → Project Settings → Environment Variables
Pastikan variabel lingkungan berikut terpasang di Vercel:
* `NEXT_PUBLIC_APP_URL` = `https://merchlysaas.vercel.app`
* `NEXT_PUBLIC_SUPABASE_URL` = `https://vsoxcoawjcgbppxcsrch.supabase.co`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable__s17axD1aqKvd0vCXqTbdw___S1IgVY`

*(Lakukan **Redeploy** di Vercel setelah mengubah Environment Variables).*

---

## 3. Aturan Alur Autentikasi di Kode Merchly

### Fix 1: Origin Dinamis (Bebas Hardcode)
Semua pemanggilan `signInWithOAuth` menggunakan:
```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: { prompt: 'select_account', access_type: 'offline' }
  },
});
```
Ketika berjalan di Vercel, `window.location.origin` otomatis bernilai `https://merchlysaas.vercel.app`. Ketika berjalan di komputer lokal, otomatis bernilai `http://localhost:3000`.

### Fix 2: Google Login Melewati OTP
* Google OAuth telah memverifikasi kepemilikan email secara resmi.
* Oleh karena itu, pengguna yang login dengan Google **tidak perlu melewati layar verifikasi OTP**, melainkan langsung dievaluasi di `app/auth/callback/route.ts`:
  * Jika user sudah memiliki workspace/membership → langsung diarahkan ke `/dashboard`.
  * Jika user baru pertama kali mendaftar via Google → diarahkan ke `/onboarding` untuk mengisi nama toko/kategori, membuat workspace, menjadi Store Owner, lalu masuk ke `/dashboard`.

### Fix 3: Standar 6-Digit OTP untuk Signup Email + Sandi
* Verifikasi OTP hanya berlaku untuk pendaftaran mandiri menggunakan form **Email + Password**.
* Token OTP Supabase berstandar **6 Digit**. Komponen antarmuka registrasi Merchly di `app/(auth)/register/page.tsx` telah disesuaikan menjadi 6 kotak input.
* Verifikasi dilakukan langsung menggunakan `supabase.auth.verifyOtp({ email, token, type: 'email' })`.

### Fix 4: Proteksi Route Server `/dashboard/*`
File `middleware.ts` memeriksa token sesi (`merchly_auth` dan Supabase auth cookies). Pengguna tanpa sesi yang mencoba membuka `/dashboard/*` akan otomatis dialihkan ke `/login?redirect=...`.
