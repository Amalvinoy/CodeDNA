'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface OptimizationsCardProps {
  optimizations?: {
    id: string;
    title: string;
    priority: string;
    description: string;
  }[];
}

export function OptimizationsCard({
  optimizations = [],
}: OptimizationsCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 border-l-2 border-l-[#f87171] space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
        <AlertTriangle className="w-4 h-4 text-[#f87171]" />
        <span>Areas for Optimization</span>
      </div>

      {/* Optimizations List */}
      {optimizations.length === 0 ? (
        <p className="text-xs font-mono text-[#64748b] py-3">
          No optimization bottlenecks detected.
        </p>
      ) : (
        <div className="space-y-3">
          {optimizations.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3.5 bg-[#080d16] border border-[#172033] rounded-md space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f87171] tracking-tight">
                  {item.title}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#2a141b] border border-[#4a1f29] text-[#f87171]">
                  {item.priority}
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
