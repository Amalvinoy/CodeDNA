'use client';

import React from 'react';
import { Target, Activity } from 'lucide-react';

interface DnaHeroVisualProps {
  metrics?: {
    codeComplexity?: number;
    testCoverage?: number;
    modularity?: number;
    recurringBugFrequency?: number;
    codeEfficiency?: number;
  };
  languages?: {
    language: string;
    percentage: number;
    count?: number;
  }[];
  reviewCount?: number;
}

export function DnaHeroVisual({
  metrics,
  languages = [],
  reviewCount = 0,
}: DnaHeroVisualProps) {
  const hasData = reviewCount > 0;

  const testCoverageStr = hasData && metrics?.testCoverage ? `${metrics.testCoverage}%` : 'N/A';
  const codeComplexityStr = hasData && metrics?.codeComplexity ? `${metrics.codeComplexity}%` : 'N/A';
  const modularityStr = hasData && metrics?.modularity ? `${metrics.modularity}%` : 'N/A';
  const bugFrequencyStr =
    hasData && metrics?.recurringBugFrequency !== undefined
      ? `${metrics.recurringBugFrequency}%`
      : 'N/A';
  const codeEfficiencyStr = hasData && metrics?.codeEfficiency ? `${metrics.codeEfficiency}%` : 'N/A';

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden h-full">
      {/* Top Header line matching Stitch */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] font-semibold tracking-wider">
          <Target className="w-3.5 h-3.5" />
          <span>COGNITIVE & STRUCTURAL FOOTPRINT</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#101827] border border-[#1e293b] text-[#64748b]">
          {hasData ? `${reviewCount} REVIEWS ANALYZED` : 'ZERO REVIEWS'}
        </span>
      </div>

      {/* Holographic DNA Canvas / Graphic Centerpiece */}
      <div className="relative my-4 flex-1 min-h-[320px] rounded-lg bg-[#06090e] border border-[#121b2a] overflow-hidden flex items-center justify-center p-4">
        {/* Background Coordinate Grid */}
        <div className="absolute inset-0 bg-grid opacity-60" />

        {/* Central Glowing Radial */}
        <div className="absolute w-72 h-72 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        {/* DNA Helix SVG Graphic */}
        <svg
          viewBox="0 0 500 240"
          className="w-full max-w-[460px] h-auto z-10 overflow-visible"
        >
          <defs>
            <linearGradient id="dnaGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#67e8f9" stopOpacity="1" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="dnaSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Cross connecting rungs */}
          {[...Array(14)].map((_, i) => {
            const x = 40 + i * 32;
            const phase = (i / 14) * Math.PI * 2;
            const y1 = 120 + Math.sin(phase) * 55;
            const y2 = 120 - Math.sin(phase) * 55;
            const opacity = 0.3 + Math.abs(Math.sin(phase)) * 0.5;

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity={opacity}
                  strokeDasharray="2 2"
                />
                {/* Strand Node Top */}
                <circle
                  cx={x}
                  cy={y1}
                  r="3.5"
                  fill="#070a0f"
                  stroke="#67e8f9"
                  strokeWidth="2"
                />
                <circle cx={x} cy={y1} r="1.5" fill="#ffffff" />

                {/* Strand Node Bottom */}
                <circle
                  cx={x}
                  cy={y2}
                  r="3.5"
                  fill="#070a0f"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <circle cx={x} cy={y2} r="1.5" fill="#ffffff" />
              </g>
            );
          })}

          {/* Primary Strand Wave */}
          <path
            d="M 40 120 Q 120 220, 200 120 T 360 120 T 460 120"
            fill="none"
            stroke="url(#dnaGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Secondary Strand Wave */}
          <path
            d="M 40 120 Q 120 20, 200 120 T 360 120 T 460 120"
            fill="none"
            stroke="url(#dnaSecondary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Floating HUD Telemetry Tags on Graphic */}
          <g className="font-mono text-[9px]">
            {/* Tag 1: Top Right */}
            <rect x="290" y="24" width="150" height="20" rx="3" fill="#080e1a" stroke="#1e3456" />
            <text x="298" y="38" fill="#67e8f9">TEST COVERAGE ({testCoverageStr})</text>

            {/* Tag 2: Top Left */}
            <rect x="50" y="30" width="160" height="20" rx="3" fill="#080e1a" stroke="#1e3456" />
            <text x="58" y="44" fill="#94a3b8">CODE COMPLEXITY ({codeComplexityStr})</text>

            {/* Tag 3: Middle Right */}
            <rect x="330" y="80" width="130" height="20" rx="3" fill="#080e1a" stroke="#1e3456" />
            <text x="338" y="94" fill="#38bdf8">MODULARITY ({modularityStr})</text>

            {/* Tag 4: Bottom Left */}
            <rect x="30" y="190" width="165" height="20" rx="3" fill="#080e1a" stroke="#1e3456" />
            <text x="38" y="204" fill="#f59e0b">BUG FREQUENCY ({bugFrequencyStr})</text>

            {/* Tag 5: Bottom Right */}
            <rect x="280" y="185" width="155" height="20" rx="3" fill="#080e1a" stroke="#1e3456" />
            <text x="288" y="199" fill="#34d399">CODE EFFICIENCY ({codeEfficiencyStr})</text>
          </g>
        </svg>

        {/* Bottom HUD mini-panels: Dynamic Language Distribution */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#64748b] border-t border-[#121c2b] pt-2 z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#38bdf8]" />
            <span>Language Distribution</span>
          </div>
          <div className="flex items-center gap-3">
            {!languages || languages.length === 0 ? (
              <span className="text-[#64748b]">No review data yet</span>
            ) : (
              languages.slice(0, 4).map((lang) => (
                <span key={lang.language} className="text-[#cbd5e1]">
                  {lang.language}: <strong className="text-[#38bdf8]">{lang.percentage}%</strong>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
