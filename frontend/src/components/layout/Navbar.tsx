'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="w-full border-b border-[#172033]/60 bg-[#070a0f]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 flex items-center justify-center">
            {/* Minimal DNA / Helix Glyph */}
            <svg
              className="w-5 h-5 text-[#67e8f9] transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8c4-4 8 4 12 0" />
              <path d="M4 16c4-4 8 4 12 0" />
              <circle cx="8" cy="10" r="1" fill="currentColor" />
              <circle cx="16" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="font-bold tracking-wider text-white text-base">
            CODE DNA
          </span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-8 text-sm text-[#94a3b8]">
          <Link
            href="#features"
            className="hover:text-white transition-colors text-xs tracking-wide"
          >
            Features
          </Link>
          <Link
            href="#methodology"
            className="hover:text-white transition-colors text-xs tracking-wide"
          >
            Methodology
          </Link>
          <Link
            href="#pricing"
            className="hover:text-white transition-colors text-xs tracking-wide"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="hover:text-white transition-colors text-xs tracking-wide"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
