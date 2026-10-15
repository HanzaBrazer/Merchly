'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';

export function LogoutModal() {
  const router = useRouter();
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout, currentUser } = useMerchly();

  const handleConfirmLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Modal
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      title="Konfirmasi Logout"
      description="Persetujuan diperlukan sebelum mengakhiri sesi Anda."
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FEF1ED] border border-[#F7D7D1]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#F7D7D1] text-[#CE3627]">
            <LogOut className="w-5 h-5 text-[#CE3627]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4A1512]">
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="text-xs text-[#71717A]">
                Login sebagai{' '}
                <span className="font-semibold text-[#000000]">
                  {currentUser?.name || 'Raihan Fahreza'}
                </span>{' '}
                ({currentUser?.email || 'raihan@merchly.com'})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF1ED] text-[#CE3627] border border-[#F7D7D1] uppercase">
                {currentUser?.role || 'owner'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#71717A] leading-relaxed">
          Setelah logout, Anda harus login kembali untuk mengelola produk, pesanan, analitik, dan chat pelanggan di dashboard toko.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E2E2]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setIsLogoutModalOpen(false)}
            className="text-xs sm:text-sm font-medium"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleConfirmLogout}
            className="text-xs sm:text-sm font-bold bg-[#CE3627] hover:bg-[#B72E20] text-white"
          >
            Ya, Keluar Akun
          </Button>
        </div>
      </div>
    </Modal>
  );
}
