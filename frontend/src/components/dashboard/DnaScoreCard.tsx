'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface DnaScoreCardProps {
  score?: number;
  maxScore?: number;
  improvementPercent?: number;
  level?: number;
  levelTitle?: string;
  progressPercent?: number;
}

export function DnaScoreCard({
  score = 0,
  maxScore = 100,
  improvementPercent = 0,
  level = 1,
  levelTitle = 'NEW DEVELOPER',
  progressPercent = 0,
}: DnaScoreCardProps) {
  const formattedLevel = String(level).padStart(2, '0');

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Section */}
      <div className="space-y-4">
        <span className="text-[11px] font-mono tracking-widest text-[#64748b] uppercase block">
          YOUR CODE DNA
        </span>

        {score === 0 ? (
          <div className="py-2">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#64748b] font-mono tracking-tight">
              No reviews yet
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-5xl lg:text-6xl font-black text-white tracking-tight">
              {score}
            </span>
            <span className="text-2xl font-semibold text-[#475569]">
              /{maxScore}
            </span>
          </div>
        )}

        {/* Improvement Badge */}
        {score === 0 ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101827] border border-[#1e293b] text-[#64748b] text-xs font-mono">
            <span>Awaiting initial review</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0f2438] border border-[#1e4566] text-[#38bdf8] text-xs font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{improvementPercent}% improvement this month</span>
          </div>
        )}
      </div>

      {/* Bottom Section: Current Ranking & Progress */}
      <div className="mt-8 space-y-2.5">
        <span className="text-[10px] font-mono tracking-widest text-[#64748b] uppercase block">
          CURRENT RANKING
        </span>

        <div className="text-xl lg:text-2xl font-bold tracking-wide text-[#67e8f9] font-mono">
          LEVEL {formattedLevel} — {levelTitle}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#56b6f7] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(86,182,247,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
