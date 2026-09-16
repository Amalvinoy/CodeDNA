'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { RecurringPattern } from '@/types';

interface RecurringPatternsCardProps {
  patterns?: RecurringPattern[];
}

export function RecurringPatternsCard({
  patterns = [],
}: RecurringPatternsCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header with Title & Chip Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Recurring Patterns
          </h3>
          <Cpu className="w-4 h-4 text-[#38bdf8]" />
        </div>
        <p className="text-xs text-[#64748b] mt-0.5">Your code has a memory.</p>

        {/* Pattern List */}
        {patterns.length === 0 ? (
          <div className="mt-6 py-6 text-center text-xs font-mono text-[#64748b] bg-[#080d16] border border-[#172033] rounded-md">
            No recurring anti-patterns detected.
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {patterns.map((item) => {
              const badgeColor =
                item.severity === 'high'
                  ? 'bg-[#2a141b] text-[#f87171] border-[#4a1f29]'
                  : item.severity === 'medium'
                  ? 'bg-[#291e12] text-[#fbbf24] border-[#4a341b]'
                  : 'bg-[#102438] text-[#38bdf8] border-[#1a3d5e]';

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-[#080d16] border border-[#172033] rounded-md transition-colors hover:border-[#1e2e4a]"
                >
                  <span className="text-xs font-mono text-[#cbd5e1] font-medium">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeColor}`}
                  >
                    {item.instances} instances
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
