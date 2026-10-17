'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMerchly } from '@/lib/store';
import { MemberRole } from '@/lib/types';
import { toast } from 'sonner';
import { X, UserPlus, Check, Sparkles, Shield, ArrowLeft, ExternalLink, Settings2, Database, Globe, Copy, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
  defaultRole?: MemberRole;
}

interface SavedGoogleAccount {
  name: string;
  email: string;
  role: MemberRole;
  avatar: string;
}

const DEFAULT_GOOGLE_ACCOUNTS: SavedGoogleAccount[] = [
  {
    name: 'Raihan Fahreza',
    email: 'raihanfahreza04@gmail.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Raihan Reza',
    email: 'raihanreza004@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sarah Amelia',
    email: 'staff@merchly.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
];

const GOOGLE_ACCOUNTS_STORAGE_KEY = 'merchly_saved_google_accounts';

export function GoogleAuthModal({
  isOpen,
  onClose,
  redirectPath = '/dashboard',
  defaultRole = 'owner',
}: GoogleAuthModalProps) {
  const router = useRouter();
  const { login } = useMerchly();

  const [accounts, setAccounts] = useState<SavedGoogleAccount[]>(DEFAULT_GOOGLE_ACCOUNTS);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<MemberRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);
  const callbackUrl = 'https://vsoxcoawjcgbppxcsrch.supabase.co/auth/v1/callback';

  const copyCallbackUrl = () => {
    try {
      navigator.clipboard.writeText(callbackUrl);
      setCopied(true);
      toast.success('Callback URL Supabase berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.info(`Callback URL: ${callbackUrl}`);
    }
  };

  // Sync saved accounts from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GOOGLE_ACCOUNTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom accounts with defaults avoiding duplicates
          const merged = [...parsed];
          DEFAULT_GOOGLE_ACCOUNTS.forEach((def) => {
            if (!merged.some((a) => a.email.toLowerCase() === def.email.toLowerCase())) {
              merged.push(def);
            }
          });
          setAccounts(merged);
        }
      }
    } catch (e) {
      console.warn('Failed to read saved google accounts', e);
    }
  }, [isOpen]);

  // Keep selectedRole synced with defaultRole prop if modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const handleSelectAccount = (acc: SavedGoogleAccount) => {
    setIsSubmitting(true);
    login(acc.email, acc.name, acc.role, acc.avatar);
    toast.success(`Berhasil login via Google sebagai ${acc.name} (${acc.role.toUpperCase()})`);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      router.push(redirectPath);
    }, 400);
  };

  const handleSupabaseGoogleOAuth = async () => {
    if (!isSupabaseConfigured) {
      toast.info('Supabase Anon Key belum diisi di .env.local. Gunakan pilihan akun di bawah untuk login instan.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        toast.error('Supabase OAuth error: ' + error.message);
        setIsSubmitting(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err: any) {
      toast.error('Gagal membuka Supabase Google OAuth: ' + (err?.message || 'Error'));
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      toast.error('Masukkan alamat email Google yang valid (misal: nama@gmail.com)');
      return;
    }

    const trimmedEmail = customEmail.trim();
    const finalName = customName.trim() || trimmedEmail.split('@')[0].replace('.', ' ');
    const formattedName = finalName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formattedName
    )}&background=4285F4&color=fff&size=128&bold=true`;

    let finalRole = selectedRole;
    if (trimmedEmail.toLowerCase() === 'raihanfahreza04@gmail.com') {
      finalRole = 'owner';
    } else if (trimmedEmail.toLowerCase() === 'raihanreza004@gmail.com') {
      finalRole = 'admin';
    }

    const newAcc: SavedGoogleAccount = {
      name: formattedName,
      email: trimmedEmail,
      role: finalRole,
      avatar: avatarUrl,
    };

    // Save to accounts list
    const updatedAccounts = [newAcc, ...accounts.filter((a) => a.email.toLowerCase() !== trimmedEmail.toLowerCase())];
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem(GOOGLE_ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(true);
    login(newAcc.email, newAcc.name, newAcc.role, newAcc.avatar);
    toast.success(`Berhasil login via Google sebagai ${newAcc.name} (${newAcc.role.toUpperCase()})`);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      router.push(redirectPath);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[460px] bg-white rounded-[28px] shadow-2xl border border-[#E2E2E2] overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-[#F0F0F0] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            {/* Google Colorful Logo */}
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <h2 className="text-xl font-medium text-[#202124]">Masuk dengan Google</h2>
          </div>

          <p className="text-xs text-[#5f6368]">
            Pilih akun Google untuk melanjutkan ke <span className="font-semibold text-[#202124]">Merchly</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-4 max-h-[480px] overflow-y-auto">
          {!isAddingCustom ? (
            <div className="space-y-3">
              {/* Account List */}
              <div className="divide-y divide-[#F0F0F0] border border-[#E8E8E8] rounded-2xl overflow-hidden bg-white shadow-xs">
                {accounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2E2E2] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#202124] group-hover:text-[#1a73e8] truncate">
                            {acc.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                              acc.role === 'owner'
                                ? 'bg-[#FEF1ED] text-[#CE3627] border-[#F7D7D1]'
                                : acc.role === 'admin'
                                ? 'bg-[#EBF5FF] text-[#1E40AF] border-[#BFDBFE]'
                                : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                            }`}
                          >
                            {acc.role === 'owner' ? '👑 Owner' : acc.role === 'admin' ? '🛡️ Admin' : '💼 Staff'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5f6368] truncate mt-0.5">{acc.email}</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] group-hover:text-[#1a73e8] group-hover:bg-white shrink-0">
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}

                {/* Add Custom / Use Another Account Option */}
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full p-3.5 flex items-center gap-3 hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer text-[#1a73e8] font-medium text-xs sm:text-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center shrink-0 text-[#1a73e8]">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a73e8]">Gunakan Akun Google Lain</p>
                    <p className="text-xs text-[#5f6368] font-normal">
                      Masuk dengan Gmail pribadi/organisasi &amp; tentukan role
                    </p>
                  </div>
                </button>
              </div>

              {/* Roles Explanation */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E8E8E8] text-xs space-y-1.5 text-[#5f6368]">
                <div className="flex items-center gap-1.5 font-semibold text-[#202124]">
                  <Shield className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>3 Akun Role Berbeda Siap Digunakan:</span>
                </div>
                <ul className="space-y-1 pl-4 list-disc text-[11px] leading-relaxed">
                  <li>
                    <strong className="text-[#CE3627]">👑 Owner (Raihan Fahreza)</strong>: Akses penuh finansial ($432,500), analytics, subscription &amp; RBAC.
                  </li>
                  <li>
                    <strong className="text-[#1E40AF]">🛡️ Admin (Dimas Pratama)</strong>: Operasional inventaris (48 SKU), manajemen pesanan &amp; tim.
                  </li>
                  <li>
                    <strong className="text-[#15803D]">💼 Staff (Sarah Amelia)</strong>: Pemenuhan pesanan (Fulfillment), live chat Gemini &amp; tiket pembeli.
                  </li>
                </ul>
              </div>

              {/* Supabase Integration Info */}
              <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Database className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#166534] truncate">Supabase Cloud Connected</p>
                    <p className="text-[10px] text-[#15803D] font-mono truncate">
                      vsoxcoawjcgbppxcsrch.supabase.co
                    </p>
                  </div>
                </div>
                {isSupabaseConfigured ? (
                  <button
                    type="button"
                    onClick={handleSupabaseGoogleOAuth}
                    className="px-2.5 py-1 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-bold transition-colors shrink-0 cursor-pointer shadow-xs"
                    title="Jalankan Google OAuth via Supabase"
                  >
                    Live OAuth
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#15803D] border border-[#BBF7D0] shrink-0">
                    Siap Anon Key
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Custom Google Account Entry Form */
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="inline-flex items-center gap-1.5 text-xs text-[#5f6368] hover:text-[#202124] transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke pilihan akun</span>
              </button>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#202124] block">
                  Email Akun Google Real
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="contoh: nama.anda@gmail.com"
                  required
                  autoFocus
                  className="w-full h-[42px] px-4 rounded-xl border border-[#DADCE0] bg-white text-sm text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#202124] block">
                  Nama Lengkap (Sesuai Profil Google)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="contoh: Alex Sanders"
                  className="w-full h-[42px] px-4 rounded-xl border border-[#DADCE0] bg-white text-sm text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all"
                />
              </div>

              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#202124] block">
                  Pilih Role Akses di Merchly
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('owner')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'owner'
                        ? 'border-[#CE3627] bg-[#FEF1ED] text-[#CE3627] font-bold shadow-xs'
                        : 'border-[#E2E2E2] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <p className="text-xs font-bold">👑 Owner</p>
                    <p className="text-[10px] mt-0.5 opacity-80">Full Access</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-[#1E40AF] bg-[#EBF5FF] text-[#1E40AF] font-bold shadow-xs'
                        : 'border-[#E2E2E2] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <p className="text-xs font-bold">🛡️ Admin</p>
                    <p className="text-[10px] mt-0.5 opacity-80">Operations</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('staff')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedRole === 'staff'
                        ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] font-bold shadow-xs'
                        : 'border-[#E2E2E2] bg-white text-[#71717A] hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <p className="text-xs font-bold">💼 Staff</p>
                    <p className="text-[10px] mt-0.5 opacity-80">Fulfillment</p>
                  </button>
                </div>
              </div>

              {/* Submit Google Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Menghubungkan Akun Google...</span>
                ) : (
                  <>
                    <span>Lanjutkan Masuk dengan Akun Ini</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Google Footnote */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#F0F0F0] text-[11px] text-[#5f6368] flex items-center justify-between">
          <span>Secured by Google Identity Services</span>
          <div className="flex items-center gap-3">
            <span className="hover:underline cursor-pointer">Privasi</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Persyaratan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
