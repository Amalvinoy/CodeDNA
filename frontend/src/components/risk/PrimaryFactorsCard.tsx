'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';

interface PrimaryFactorsCardProps {
  confidencePercent?: number;
  factors?: {
    id: string;
    label: string;
    impactPercent: number;
    color: 'red' | 'amber' | 'cyan';
  }[];
}

export function PrimaryFactorsCard({
  confidencePercent = 0,
  factors = [],
}: PrimaryFactorsCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#38bdf8]" />
          <span>Primary Factors</span>
        </h3>

        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#101827] border border-[#1e2d42] text-[#94a3b8]">
          Confidence: {confidencePercent}%
        </span>
      </div>

      {/* Factors List */}
      {factors.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs font-mono text-[#64748b]">
            No structural risk factors identified yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {factors.map((factor) => {
            const barColor =
              factor.color === 'red'
                ? 'bg-[#f87171]'
                : factor.color === 'amber'
                ? 'bg-[#fbbf24]'
                : 'bg-[#38bdf8]';

            const textColor =
              factor.color === 'red'
                ? 'text-[#f87171]'
                : factor.color === 'amber'
                ? 'text-[#fbbf24]'
                : 'text-[#38bdf8]';

            return (
              <div key={factor.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#cbd5e1] text-[11px] font-medium">
                    {factor.label}
                  </span>
                  <span className={`font-bold ${textColor}`}>
                    +{factor.impactPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full`}
                    style={{ width: `${(factor.impactPercent / 40) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
