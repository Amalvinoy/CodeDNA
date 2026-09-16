'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface StrengthsCardProps {
  strengths?: {
    id: string;
    title: string;
    percentile: string;
    description: string;
  }[];
}

export function StrengthsCard({
  strengths = [],
}: StrengthsCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 border-l-2 border-l-[#10b981] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
        <ShieldCheck className="w-4 h-4 text-[#10b981]" />
        <span>Identified Strengths</span>
      </div>

      {/* Strengths List */}
      {!strengths || strengths.length === 0 ? (
        <div className="p-5 bg-[#080d16] border border-[#172033] rounded-md text-center space-y-1">
          <p className="text-xs font-mono font-semibold text-[#cbd5e1]">
            Complete your first review
          </p>
          <p className="text-[11px] font-mono text-[#64748b]">
            Submit reviews to identify engineering strengths and code patterns.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {strengths.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3.5 bg-[#080d16] border border-[#172033] rounded-md space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#34d399] tracking-tight">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-[#64748b]">
                  {item.percentile}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
