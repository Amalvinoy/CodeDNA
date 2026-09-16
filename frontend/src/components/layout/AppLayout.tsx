'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Menu, X, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <Loader2 className="w-7 h-7 animate-spin text-[#38bdf8]" />
        <span className="text-[#64748b]">Initializing Code DNA workspace...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] flex flex-col items-center justify-center gap-3 font-mono text-xs">
        <Loader2 className="w-7 h-7 animate-spin text-[#38bdf8]" />
        <span className="text-[#64748b]">Redirecting to login...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070a0f] text-[#f1f5f9]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-[#090d16] h-full z-50">
            <div className="flex items-center justify-between p-4 border-b border-[#172033]">
              <span className="text-lg font-bold text-[#67e8f9]">CODE DNA</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#090d16] border-b border-[#172033] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#131d2e]"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="font-bold tracking-wide text-[#67e8f9] text-base">
              CODE DNA
            </Link>
          </div>
          <Link
            href="/review/new"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#56b6f7] text-[#030712] rounded text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Review</span>
          </Link>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
