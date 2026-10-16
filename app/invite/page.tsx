'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useMerchly } from '@/lib/store';
import { toast } from 'sonner';
import { Shield, Sparkles, Building2, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const { invitations, acceptInvitation, isAuthenticated, currentUser } = useMerchly();

  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const invitation = invitations.find((i) => i.token === token);

  useEffect(() => {
    if (currentUser?.name && !name) {
      setName(currentUser.name);
    }
  }, [currentUser, name]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E2E2E2] shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF1ED] text-[#CE3627] flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-black">Link Undangan Tidak Lengkap</h2>
          <p className="text-sm text-[#71717A]">
            Parameter token tidak ditemukan pada URL ini. Silakan periksa kembali email undangan Anda.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-full bg-[#CE3627] text-white font-medium text-sm hover:bg-[#B72E20] transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Harap masukkan nama lengkap Anda.');
      return;
    }

    setIsLoading(true);
    const success = acceptInvitation(token, name.trim());
    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        router.push('/dashboard');
      }, 500);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-[#E2E2E2] shadow-sm space-y-6">
        {/* Top Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo className="w-10 h-10 mx-auto" />
          </Link>
        </div>

        {/* Invitation Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF1ED] border border-[#F7D7D1] text-[#CE3627] text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Undangan Bergabung Tim</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#000000]">
            Bergabung dengan {invitation?.workspaceName || 'Nordic Furniture'}
          </h1>
          <p className="text-sm text-[#71717A]">
            Anda diundang oleh <strong className="text-black">{invitation?.invitedBy || 'Owner'}</strong> untuk
            menjadi anggota tim sebagai:
          </p>
        </div>

        {/* Role Badge Card */}
        <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E8E8E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#E2E2E2] text-[#CE3627]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#71717A]">Role Akses yang Ditentukan</p>
              <p className="text-base font-bold text-black capitalize">
                {invitation?.role === 'admin' ? '🛡️ Administrator' : '💼 Staff Anggota'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] uppercase">
            {invitation?.role || 'staff'}
          </span>
        </div>

        {/* Form to Accept and Join */}
        <form onSubmit={handleAccept} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#71717A] block">
              Email Undangan
            </label>
            <input
              type="email"
              value={invitation?.email || 'email@anda.com'}
              disabled
              className="w-full h-[45px] px-4 rounded-full border border-[#E8E8E8] bg-[#F6F6F6] text-sm text-[#71717A] cursor-not-allowed select-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-black block">
              Nama Lengkap Anda
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda..."
              required
              autoFocus
              className="w-full h-[45px] px-4 rounded-full border border-[#E8E8E8] bg-white text-sm text-black placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20 transition-all"
            />
          </div>

          {!isAuthenticated && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-black block">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat kata sandi akun Anda..."
                required
                className="w-full h-[45px] px-4 rounded-full border border-[#E8E8E8] bg-white text-sm text-black placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#CE3627] focus:ring-2 focus:ring-[#CE3627]/20 transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[47px] rounded-full bg-[#CE3627] hover:bg-[#B72E20] text-white text-base font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Terima Undangan &amp; Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#71717A]">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-black font-semibold hover:text-[#CE3627] underline">
            Masuk dengan akun lain
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-[#CE3627] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
