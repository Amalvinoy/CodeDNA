'use client';

import React from 'react';
import { Shield, Zap, Wrench, ArrowRight } from 'lucide-react';

interface BattleMetricBarProps {
  metrics?: {
    security: { original: number; optimized: number };
    performance: { original: number; optimized: number };
    maintainability: { original: number; optimized: number };
  };
}

export function BattleMetricBar({
  metrics = {
    security: { original: 0, optimized: 0 },
    performance: { original: 0, optimized: 0 },
    maintainability: { original: 0, optimized: 0 },
  },
}: BattleMetricBarProps) {
  const metricList = [
    {
      label: 'SECURITY',
      icon: Shield,
      original: metrics.security.original,
      optimized: metrics.security.optimized,
    },
    {
      label: 'PERFORMANCE',
      icon: Zap,
      original: metrics.performance.original,
      optimized: metrics.performance.optimized,
    },
    {
      label: 'MAINTAINABILITY',
      icon: Wrench,
      original: metrics.maintainability.original,
      optimized: metrics.maintainability.optimized,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-4">
      {metricList.map((m) => {
        const Icon = m.icon;
        const isBetter = m.optimized > m.original;

        return (
          <div key={m.label} className="flex flex-col items-center gap-1.5 w-full">
            <div className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#64748b] uppercase">
              <Icon className="w-3 h-3 text-[#64748b]" />
              <span>{m.label}</span>
            </div>

            {/* Metric pill comparison */}
            <div className="flex items-center justify-between w-32 px-3 py-1.5 rounded-lg bg-[#090e18] border border-[#172236] text-xs font-mono">
              <span className="text-[#cbd5e1] font-semibold">{m.original}</span>
              <div className="w-6 h-1 rounded-full bg-[#1e2d45] overflow-hidden flex">
                <div
                  className={`h-full ${isBetter ? 'bg-[#38bdf8]' : 'bg-[#f87171]'}`}
                  style={{ width: `${Math.min(100, (m.optimized / 100) * 100)}%` }}
                />
              </div>
              <span className="text-[#38bdf8] font-bold">{m.optimized}</span>
            </div>
          </div>
        );
      })}

      <div className="w-8 h-8 rounded-full bg-[#0d1522] border border-[#1a2942] flex items-center justify-center text-[#38bdf8] mt-2">
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
