'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';
import { Eye, EyeOff, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/dashboard';

  const { login } = useMerchly();
  const [email, setEmail] = useState('raihan@merchly.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Harap masukkan email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    login(email, 'Raihan Fahreza');
    toast.success('Berhasil login sebagai Raihan Fahreza (Owner)!');
    setTimeout(() => {
      router.push(redirectPath);
    }, 300);
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    login(`raihan.${provider.toLowerCase()}@merchly.com`, 'Raihan Fahreza');
    toast.success(`Berhasil login via ${provider} sebagai Raihan Fahreza!`);
    setTimeout(() => {
      router.push(redirectPath);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1400px] min-h-[750px] lg:h-[880px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Login Form Card (Figma Node 9:3678) */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 lg:p-16 flex flex-col justify-between border border-[#E2E2E2] shadow-sm">
          <div>
            {/* Top Logo */}
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" className="inline-block">
                <Logo className="w-9 h-9" />
              </Link>

              {/* Instant 1-Click Demo Pill for Raihan Fahreza */}
              <button
                type="button"
                onClick={() => {
                  login('raihan@merchly.com', 'Raihan Fahreza');
                  toast.success('Login instan sebagai Raihan Fahreza (Owner)!');
                  router.push(redirectPath);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF1ED] border border-[#F7D7D1] text-[#CE3627] text-xs font-semibold hover:bg-[#FCE6DF] transition-colors"
                title="1-Click Demo Login as Raihan Fahreza"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Owner Demo</span>
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-[#A0A0A0]">
                Enter your email and password to access your dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm sm:text-base font-normal text-[#000000] block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full h-[47px] px-5 rounded-full border border-[#E8E8E8] bg-white text-sm sm:text-base text-[#000000] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20 transition-all"
                />
              </div>

              {/* Password with Eye Icon */}
              <div className="space-y-1.5">
                <label className="text-sm sm:text-base font-normal text-[#000000] block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    required
                    className="w-full h-[47px] pl-5 pr-12 rounded-full border border-[#E8E8E8] bg-white text-sm sm:text-base text-[#000000] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#000000] transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password (Figma Node EL-bb582553) */}
              <div className="flex items-center justify-between text-sm sm:text-base pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-[#000000]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#CE3627] focus:ring-[#CE3627] accent-[#CE3627]"
                  />
                  <span className="text-xs sm:text-sm">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => toast.info('Fitur reset kata sandi dikirimkan ke email terdaftar.')}
                  className="text-xs sm:text-sm font-medium text-[#000000] hover:text-[#CE3627] hover:underline"
                >
                  Forgot Password
                </button>
              </div>

              {/* Login Button (Figma Node EL-581d8d0c) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[47px] rounded-full bg-[#CE3627] hover:bg-[#B72E20] text-white text-base sm:text-lg font-medium transition-colors shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 mt-2"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
              <span className="text-sm text-[#A0A0A0]">or login with</span>
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full h-[47px] rounded-full border border-[#E8E8E8] bg-white hover:bg-[#F6F6F6] text-sm sm:text-base font-medium text-[#000000] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="w-full h-[47px] rounded-full border border-[#E8E8E8] bg-white hover:bg-[#F6F6F6] text-sm sm:text-base font-medium text-[#000000] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current text-[#000000]" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.04-1.81.93-2.87-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.51 2.67-1.27z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Bottom Prompt */}
          <div className="pt-6 text-center text-sm sm:text-base text-[#A0A0A0]">
            Don’t have an account?{' '}
            <Link href="/register" className="font-medium text-[#000000] hover:text-[#CE3627] underline">
              Register now
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Visual Frame (Figma Screen 9:3678 Right Hero) */}
        <div className="bg-[#4A1512] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE3627]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Header Brand */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#CE3627] flex items-center justify-center shadow-md">
                <Logo showText={false} className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-medium tracking-tight text-white">Merchly</span>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20">
              Retail Platform
            </span>
          </div>

          {/* Figma Live Operational Showcase Card */}
          <div className="relative z-10 my-8 bg-white rounded-[28px] p-6 sm:p-7 text-[#000000] shadow-2xl border border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E2]">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Raihan Fahreza"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#CE3627]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#000000]">Raihan Fahreza</h4>
                  <p className="text-xs text-[#71717A]">Store Owner • Nordic Furniture</p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1]">
                Owner Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="p-3.5 rounded-2xl bg-[#F6F6F6]">
                <p className="text-xs text-[#71717A]">Total Revenue</p>
                <p className="text-xl font-bold text-[#000000] mt-1">$432,500</p>
                <p className="text-[11px] text-[#0E8F21] font-semibold mt-1">↑ 12% vs last month</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F6F6]">
                <p className="text-xs text-[#71717A]">Active Orders</p>
                <p className="text-xl font-bold text-[#CE3627] mt-1">1,280 pcs</p>
                <p className="text-[11px] text-[#71717A] mt-1">Ready for fulfillment</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E2E2]/60 text-xs text-[#71717A]">
              <span>Channels: Shopify, Shopee, Tokopedia</span>
              <span className="font-semibold text-[#0E8F21] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Secured
              </span>
            </div>
          </div>

          {/* Bottom Highlights */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A6B] shrink-0" />
              <span>Direct access to sales &amp; orders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A6B] shrink-0" />
              <span>Full store settings &amp; RBAC control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-8 h-8 border-2 border-[#CE3627] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

