'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  History,
  Search,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] relative overflow-hidden flex flex-col font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-80" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-16 relative z-10 flex flex-col gap-16">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1c2d] border border-[#1e3e5e] text-[#67e8f9] text-xs font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span>DEVELOPER INTELLIGENCE</span>
            </div>

            {/* Headline matching Stitch */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Code review <br />
              that{' '}
              <span className="relative inline-block text-[#67e8f9]">
                remembers.
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#38bdf8]/20 -z-10 rounded" />
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#94a3b8] max-w-xl leading-relaxed">
              Code DNA doesn&apos;t just find bugs. It learns your coding patterns,
              predicts what you&apos;ll get wrong next, and helps you become a
              better engineer.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/review/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#56b6f7] hover:bg-[#38bdf8] text-[#030712] font-bold text-sm transition-all duration-150 shadow-[0_0_20px_rgba(86,182,247,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Reviewing</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/dna"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#0b101b] hover:bg-[#131d2e] border border-[#1e293b] text-[#cbd5e1] hover:text-white font-medium text-sm transition-all duration-150"
              >
                <span>Explore Code DNA</span>
              </Link>
            </div>

            {/* Social Proof Divider */}
            <div className="pt-6 border-t border-[#172033]/60 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#1e293b] border border-[#070a0f] flex items-center justify-center text-[9px] font-bold text-[#38bdf8]">
                  C
                </div>
                <div className="w-6 h-6 rounded-full bg-[#0f2d4a] border border-[#070a0f] flex items-center justify-center text-[9px] font-bold text-[#67e8f9]">
                  D
                </div>
                <div className="w-6 h-6 rounded-full bg-[#133e5c] border border-[#070a0f] flex items-center justify-center text-[9px] font-bold text-[#38bdf8]">
                  +2k
                </div>
              </div>
              <span className="text-xs font-mono text-[#64748b]">
                Engineers evolving their code DNA
              </span>
            </div>
          </div>

          {/* Right Column: Hero Radar Geometry Graphic matching Stitch */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[380px] aspect-square rounded-xl bg-[#080d16]/80 border border-[#162032] p-6 flex items-center justify-center">
              {/* Coordinate Grid Box */}
              <div className="absolute inset-4 border border-[#172235]/40 grid grid-cols-2 grid-rows-2 pointer-events-none" />

              <svg
                viewBox="0 0 320 320"
                className="w-full h-full overflow-visible select-none"
              >
                {/* Concentric Background Polygons */}
                <polygon
                  points="160,40 260,95 260,225 160,280 60,225 60,95"
                  fill="none"
                  stroke="#172235"
                  strokeWidth="1"
                />
                <polygon
                  points="160,80 230,120 230,200 160,240 90,200 90,120"
                  fill="none"
                  stroke="#172235"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Outer Blue Hexagon Polygon */}
                <polygon
                  points="160,65 250,110 245,210 160,260 80,215 75,105"
                  fill="rgba(56, 189, 248, 0.06)"
                  stroke="#56b6f7"
                  strokeWidth="2"
                />

                {/* Inner Dashed Reddish/Coral Hexagon Polygon (Risk Pattern) */}
                <polygon
                  points="160,110 215,135 210,185 160,215 110,185 105,135"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="1.75"
                  strokeDasharray="3 3"
                />

                {/* Cyan Vertex Glow Points */}
                <circle cx="160" cy="65" r="3.5" fill="#67e8f9" />
                <circle cx="250" cy="110" r="3.5" fill="#67e8f9" />
                <circle cx="245" cy="210" r="3.5" fill="#67e8f9" />

                {/* Axis Labels matching Stitch */}
                <text
                  x="160"
                  y="25"
                  fill="#67e8f9"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                >
                  Architecture
                </text>
                <text
                  x="275"
                  y="110"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="start"
                >
                  Security
                </text>
                <text
                  x="270"
                  y="210"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="start"
                >
                  Performance
                </text>
                <text
                  x="160"
                  y="305"
                  fill="#f87171"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="middle"
                >
                  Risk Pattern
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* 4 FEATURE CARDS GRID matching Stitch */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
          {/* Card 1: Review (Left Column Top) */}
          <div className="md:col-span-7 bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#0f2438] flex items-center justify-center text-[#38bdf8]">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Review
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed max-w-lg">
                Deep contextual analysis that understands your framework,
                architecture, and specific business logic.
              </p>
            </div>

            {/* Mini Terminal Card */}
            <div className="bg-[#080d16] border border-[#172033] rounded-lg p-3 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <div className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              </div>
              <div className="text-[11px] space-y-1">
                <div className="text-[#94a3b8]">
                  const data = <span className="text-[#38bdf8]">await</span> fetchUserProfile(id);
                </div>
                <div className="text-[#fca5a5]">
                  return data.passwordHash; <span className="text-[#f87171]">{'// Potential leak detected'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Remember (Right Column Tall Card spanning vertical height) */}
          <div className="md:col-span-5 md:row-span-2 bg-[#0b101b] border border-[#162032] rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#0f2438] flex items-center justify-center text-[#38bdf8]">
                <History className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Remember
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                We build a historical graph of your PRs to identify recurring
                anti-patterns and structural blind spots.
              </p>
            </div>

            {/* Pattern Recognized Visual Graphic matching Stitch */}
            <div className="space-y-3 pt-6">
              <div className="w-3/4 h-3 bg-[#1e293b] rounded" />
              <div className="w-full h-3 bg-[#334155]/60 rounded overflow-hidden">
                <div className="w-4/5 h-full bg-[#475569]" />
              </div>
              <div className="w-1/2 h-3 bg-[#475569]/80 rounded" />

              <div className="mt-4 p-2.5 bg-[#080d16] border border-[#172033] rounded-md flex items-center justify-between text-xs font-mono text-[#cbd5e1]">
                <span>Pattern recognized</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
              </div>
            </div>
          </div>

          {/* Card 2: Predict (Bottom Left) */}
          <div className="md:col-span-3 bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#2a141b] flex items-center justify-center text-[#f87171]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Predict
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Forecasts potential regressions before you even commit.
            </p>
          </div>

          {/* Card 3: Evolve (Bottom Mid-Left) */}
          <div className="md:col-span-4 bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#291e12] flex items-center justify-center text-[#fbbf24]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Evolve
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Measurable improvement in code quality over time.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
