'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('engineer@codedna.dev');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await login({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] relative flex items-center justify-center p-6 bg-grid">
      {/* Glow Center */}
      <div className="absolute w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0b101b] border border-[#162032] rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="text-3xl font-black tracking-wider text-[#67e8f9]">
              CODE <span className="text-white">DNA</span>
            </span>
          </Link>
          <p className="text-xs font-mono text-[#64748b]">
            Sign in to access your developer intelligence workspace.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-[#2a141b] border border-[#521b27] rounded-lg text-xs font-mono text-[#f87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#94a3b8] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="engineer@codedna.dev"
              className="w-full px-3.5 py-2.5 bg-[#080d16] border border-[#172235] rounded-lg text-xs font-mono text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#94a3b8] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#64748b]" />
                <span>Password</span>
              </label>
              <a href="#" className="text-[11px] font-mono text-[#38bdf8] hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#080d16] border border-[#172235] rounded-lg text-xs font-mono text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#56b6f7] hover:bg-[#38bdf8] disabled:opacity-50 text-[#030712] font-mono font-bold text-xs transition-all active:scale-[0.98] shadow-md mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#172033] text-center text-xs font-mono text-[#64748b]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#38bdf8] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
