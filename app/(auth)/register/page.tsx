'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.success('Account created! Proceeding to workspace onboarding...');
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col justify-between p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto pt-6">
        <Link href="/">
          <Logo className="w-9 h-9" />
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E2E2] shadow-sm">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-[#000000]">Create Workspace</h1>
            <p className="text-xs sm:text-sm text-[#71717A] mt-1">
              Start managing your retail products, orders, and sales today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-sm">
            <div>
              <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Brian Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="brian@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider block mb-1">
                Password Confirmation
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#1D4840] text-sm"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
              <span>Continue to Onboarding</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-[#E2E2E2]/60 text-xs text-[#71717A]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#1D4840] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-[#71717A]">
        Merchly Inc. • Modern Commerce Operations
      </div>
    </div>
  );
}
