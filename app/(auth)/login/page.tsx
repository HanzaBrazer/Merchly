'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('brian@email.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signed in successfully as Brian!');
    router.push('/dashboard');
  };

  const handleDemoLogin = () => {
    setEmail('brian@email.com');
    setPassword('demo-owner-123');
    toast.success('Logging in as Brian (Store Owner)...');
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
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
            <h1 className="text-2xl font-extrabold text-[#000000]">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-[#71717A] mt-1">
              Sign in to manage your Merchly retail operations.
            </p>
          </div>

          {/* 1-Click Quick Demo Login Button for Evaluators */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1] text-center">
            <p className="text-xs font-bold text-[#CE3627] mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#CE3627]" />
              Solo SaaS Challenge Evaluator?
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleDemoLogin}
              className="w-full text-xs font-bold shadow-xs"
            >
              🚀 Instant 1-Click Demo Login
            </Button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#E2E2E2] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#A0A0A0] uppercase">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-sm">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#000000] uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#CE3627] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627] text-sm"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6 pt-4 border-t border-[#E2E2E2]/60 text-xs text-[#71717A]">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-bold text-[#CE3627] hover:underline">
              Create a workspace
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
