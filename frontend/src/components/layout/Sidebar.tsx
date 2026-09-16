'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Plus,
  History,
  Dna,
  AlertTriangle,
  Swords,
  BrainCircuit,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const mainNavItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Review History',
    href: '/history',
    icon: History,
  },
  {
    label: 'Code DNA',
    href: '/dna',
    icon: Dna,
  },
  {
    label: 'Risk Forecast',
    href: '/risk',
    icon: AlertTriangle,
  },
  {
    label: 'Code Battle',
    href: '/battle',
    icon: Swords,
  },
  {
    label: 'Review Memory',
    href: '/memory',
    icon: BrainCircuit,
  },
  {
    label: 'Achievements',
    href: '/achievements',
    icon: Award,
  },
];

const bottomNavItems = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    label: 'Support',
    href: '#',
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#090d16] border-r border-[#172033] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Brand & Action */}
      <div className="p-5 flex flex-col gap-5">
        {/* Brand Logo matching Stitch */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-[#67e8f9] group-hover:text-primary transition-colors">
              CODE
            </span>
          </div>
          <span className="text-2xl font-black tracking-wider text-[#67e8f9] -mt-1 group-hover:text-primary transition-colors">
            DNA
          </span>
          <span className="text-[9px] tracking-[0.25em] font-mono uppercase text-[#64748b] mt-1">
            DEVELOPER INTELLIGENCE
          </span>
        </Link>

        {/* Start Review CTA Button matching Stitch */}
        <Link
          href="/review/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-[#56b6f7] hover:bg-[#38bdf8] text-[#030712] font-semibold text-sm transition-all duration-150 shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Start Review</span>
        </Link>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 mt-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
              (item.href === '/history' && pathname.startsWith('/review/REV'));

            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2 rounded-md text-sm font-medium transition-colors group relative',
                  isActive
                    ? 'bg-[#131d2e] text-[#67e8f9] border-l-2 border-[#38bdf8]'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Navigation */}
      <div className="p-4 border-t border-[#172033]/60 flex flex-col gap-2">
        {/* User Card */}
        {user && (
          <div className="px-3 py-2 bg-[#06090e] border border-[#141e30] rounded-lg flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#102235] border border-[#1f4265] flex items-center justify-center text-[#38bdf8] flex-shrink-0 text-xs font-mono font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {user.name}
                </div>
                <div className="text-[10px] font-mono text-[#64748b] truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded hover:bg-[#1a263c] text-[#94a3b8] hover:text-[#f87171] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors group',
                isActive
                  ? 'bg-[#131d2e] text-[#67e8f9] border-l-2 border-[#38bdf8]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]'
              )}
            >
              <Icon
                className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  isActive ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
