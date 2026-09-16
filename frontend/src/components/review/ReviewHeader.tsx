'use client';

import React from 'react';
import { TrendingUp, Bug } from 'lucide-react';

interface ReviewHeaderProps {
  reviewId: string;
  title: string;
  summary: string;
  qualityScore: number;
  scoreDelta: number;
  issuesCount: number;
  hasCritical?: boolean;
}

export function ReviewHeader({
  reviewId = '#REV-8924A',
  title = 'Authentication Service PR',
  summary = 'The implementation introduces a major security flaw in the user login query structure. While performance is optimized, the current string interpolation method exposes the database to injection attacks. Immediate remediation required.',
  qualityScore = 7.8,
  scoreDelta = 0.9,
  issuesCount = 3,
  hasCritical = true,
}: ReviewHeaderProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* Left Details */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono text-[#38bdf8] font-semibold tracking-wider">
            REVIEW ID: {reviewId}
          </span>
          {hasCritical && (
            <span className="px-2 py-0.5 rounded bg-[#2b141a] border border-[#521b27] text-[#f87171] text-[10px] font-mono font-bold uppercase tracking-wider">
              Critical Issues Found
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
          <span className="font-semibold text-white">AI Summary: </span>
          {summary}
        </p>
      </div>

      {/* Right Score Widget matching Stitch */}
      <div className="bg-[#080d16] border border-[#172235] rounded-lg px-6 py-4 flex items-center gap-6 min-w-[240px] flex-shrink-0">
        <div>
          <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
            {qualityScore.toFixed(1)}
          </div>
          <div className="text-[10px] font-mono tracking-wider text-[#64748b] uppercase mt-0.5">
            Code Quality Score
          </div>
        </div>

        <div className="border-l border-[#172235] pl-5 space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#34d399] font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{scoreDelta.toFixed(1)} from previous</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#64748b]">
            <Bug className="w-3.5 h-3.5" />
            <span>{issuesCount} Issues Detected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
