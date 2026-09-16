'use client';

import React from 'react';
import { ShieldAlert, Sparkles, Info, Wrench, AlertTriangle, Paintbrush } from 'lucide-react';
import { CodeIssue } from '@/types';

interface IssueDetailCardProps {
  issue: CodeIssue;
}

export function IssueDetailCard({ issue }: IssueDetailCardProps) {
  const cat = issue.category.toLowerCase();
  const Icon =
    cat === 'security'
      ? ShieldAlert
      : cat === 'correctness'
      ? AlertTriangle
      : cat === 'performance'
      ? AlertTriangle
      : cat === 'maintainability'
      ? Wrench
      : Paintbrush;

  const iconColor =
    cat === 'security'
      ? 'text-[#f87171]'
      : cat === 'correctness'
      ? 'text-[#f43f5e]'
      : cat === 'performance'
      ? 'text-[#fbbf24]'
      : cat === 'architecture'
      ? 'text-[#a855f7]'
      : cat === 'maintainability'
      ? 'text-[#38bdf8]'
      : 'text-[#94a3b8]';

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {issue.title}
            </h2>
            <div className="text-xs font-mono text-[#64748b] mt-0.5">
              {issue.file} • Line {issue.line}
            </div>
          </div>
        </div>

        {/* Historical Rule Match Badge matching Stitch */}
        {issue.historicalMatchPercent && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f2438] border border-[#1e4566] text-[#67e8f9] text-xs font-mono flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Historical rule matched: {issue.historicalMatchPercent}%</span>
          </div>
        )}
      </div>

      {/* Two-Column Detail Cards matching Stitch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why it matters */}
        <div className="bg-[#080d16] border border-[#172033] rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Why it matters</span>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {issue.whyItMatters}
          </p>
        </div>

        {/* Suggested fix */}
        <div className="bg-[#080d16] border border-[#172033] rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Suggested fix</span>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {issue.suggestedFix}
          </p>
        </div>
      </div>
    </div>
  );
}
