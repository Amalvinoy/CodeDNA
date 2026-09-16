'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CodeDNA Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] flex items-center justify-center p-6 bg-grid">
      <div className="w-full max-w-md bg-[#0b101b] border border-[#162032] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#2a141b] border border-[#521b27] flex items-center justify-center text-[#f87171] mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-white">
            Workspace Anomaly Detected
          </h2>
          <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">
            {error?.message || 'An unexpected runtime error occurred in the intelligence engine.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#56b6f7] hover:bg-[#38bdf8] text-[#030712] font-mono font-bold text-xs transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#080d16] border border-[#172235] hover:border-[#253550] text-xs font-mono text-[#cbd5e1] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
