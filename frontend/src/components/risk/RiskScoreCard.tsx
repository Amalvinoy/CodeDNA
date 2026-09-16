'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskScoreCardProps {
  category?: string;
  riskPercent?: number;
  riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
}

export function RiskScoreCard({
  category = 'Risk Evaluation',
  riskPercent = 0,
  riskLevel = 'LOW',
  recommendation = 'No risk data available yet. Complete reviews to run predictive risk analysis.',
}: RiskScoreCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 flex flex-col items-center text-center justify-between h-full space-y-4">
      {/* Icon with subtle coral glow */}
      <div className="w-12 h-12 rounded-xl bg-[#2a141b]/60 border border-[#501c28] flex items-center justify-center text-[#f87171] shadow-[0_0_20px_rgba(248,113,113,0.15)]">
        <AlertTriangle className="w-6 h-6 stroke-[2]" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-white tracking-tight">
          {category}
        </h3>

        {/* Score & Level Badge matching Stitch */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl lg:text-6xl font-black text-white font-mono tracking-tight">
            {riskPercent}%
          </span>
          <span className="px-2.5 py-1 rounded bg-[#2a141b] border border-[#521b27] text-[#f87171] text-xs font-mono font-bold uppercase tracking-wider">
            {riskLevel}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#94a3b8] max-w-xs leading-relaxed">
        {recommendation}
      </p>
    </div>
  );
}
