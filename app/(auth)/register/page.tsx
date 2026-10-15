'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';
import { TrendingUp, BarChart3, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useMerchly();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);
    register(email, 'Raihan Fahreza');
    toast.success('Pendaftaran berhasil! Melanjutkan ke onboarding workspace...');
    setTimeout(() => {
      router.push('/onboarding');
    }, 400);
  };

  const handleSocialRegister = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    register(`raihan.${provider.toLowerCase()}@merchly.com`, 'Raihan Fahreza');
    toast.success(`Berhasil mendaftar menggunakan ${provider}!`);
    setTimeout(() => {
      router.push('/onboarding');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1400px] min-h-[750px] lg:h-[880px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Registration Form Card (Figma Node 9:2044) */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 lg:p-16 flex flex-col justify-between border border-[#E2E2E2] shadow-sm">
          <div>
            {/* Top Logo */}
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <Logo className="w-9 h-9" />
              </Link>
            </div>

            {/* Form Title & Subtitle */}
            <div className="space-y-2 mb-8">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
                Register Your Account
              </h1>
              <p className="text-sm sm:text-base text-[#A0A0A0]">
                Please fill out this field to continue the registration
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
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

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[47px] rounded-full bg-[#CE3627] hover:bg-[#B72E20] text-white text-base sm:text-lg font-medium transition-colors shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
              <span className="text-sm text-[#A0A0A0]">or register with</span>
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleSocialRegister('Google')}
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
                onClick={() => handleSocialRegister('Apple')}
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
          <div className="pt-8 text-center text-sm sm:text-base text-[#A0A0A0]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#000000] hover:text-[#CE3627] underline">
              Login now
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Visual Frame (Figma Screen 9:2044 Right Hero) */}
        <div className="bg-[#4A1512] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CE3627]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Header Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CE3627] flex items-center justify-center shadow-md">
              <Logo showText={false} className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-medium tracking-tight text-white">Merchly</span>
          </div>

          {/* Figma Revenue Insights Preview Card (EL-63d420b6) */}
          <div className="relative z-10 my-8 bg-white rounded-[28px] p-6 sm:p-7 text-[#000000] shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#000000]">Revenue Insights</h3>
                <p className="text-xs text-[#71717A]">Weekly multi-store sales aggregation</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0E8F21] bg-[#E7F4E9] px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                +18.4%
              </span>
            </div>

            {/* Weekly Bars matching Figma elements EL-cc529bd5 to EL-c849839f */}
            <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E2E2E2]">
              {[
                { day: 'Sun', height: '55%', value: '$22k' },
                { day: 'Mon', height: '70%', value: '$28k' },
                { day: 'Tue', height: '45%', value: '$18k' },
                { day: 'Wed', height: '90%', value: '$38k', active: true },
                { day: 'Thu', height: '65%', value: '$26k' },
                { day: 'Fri', height: '80%', value: '$32k' },
                { day: 'Sat', height: '85%', value: '$35k' },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[36px] bg-[#F6F6F6] rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        item.active ? 'bg-[#CE3627]' : 'bg-[#FF7A6B]/80 group-hover:bg-[#CE3627]'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs font-medium text-[#71717A]">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-[#71717A]">
              <span>Store Owner: <b className="text-black">Raihan Fahreza</b></span>
              <span className="text-[#CE3627] font-semibold">Live Real-time Sync</span>
            </div>
          </div>

          {/* Bottom Feature Highlights */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A6B] shrink-0" />
              <span>Multi-channel catalog &amp; order hub</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A6B] shrink-0" />
              <span>AI-powered customer chat assistant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
