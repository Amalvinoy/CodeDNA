'use client';

import React from 'react';

interface PatternHistoryChartProps {
  patterns?: {
    category: string;
    pastFrequency: number;
    currentFrequency: number;
  }[];
}

export function PatternHistoryChart({
  patterns = [],
}: PatternHistoryChartProps) {
  const activePatterns = patterns.filter(
    (p) => p.pastFrequency > 0 || p.currentFrequency > 0
  );

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Pattern History
        </h3>
        <span className="text-[11px] font-mono text-[#64748b]">
          Recurring Issue Frequency
        </span>
      </div>

      {/* Progress frequency comparison */}
      {activePatterns.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs font-mono text-[#64748b]">
            No pattern history yet
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {activePatterns.map((item) => {
            const hasPast = item.pastFrequency > 0;
            const reductionPercent = hasPast
              ? Math.round(
                  ((item.pastFrequency - item.currentFrequency) / item.pastFrequency) * 100
                )
              : 0;

            const maxRef = Math.max(1, item.pastFrequency, item.currentFrequency, 12);

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#cbd5e1] text-[11px]">{item.category}</span>
                  <div className="flex items-center gap-2">
                    {hasPast && (
                      <span className="text-[#64748b] line-through text-[10px]">
                        {item.pastFrequency}
                      </span>
                    )}
                    <span className="text-[#38bdf8] font-bold text-[10px]">
                      {item.currentFrequency}
                    </span>
                    {hasPast && (
                      <span className={`${reductionPercent >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'} text-[9px] font-semibold`}>
                        {reductionPercent >= 0 ? `-${reductionPercent}%` : `+${Math.abs(reductionPercent)}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#38bdf8] rounded-full"
                    style={{ width: `${Math.min(100, (item.currentFrequency / maxRef) * 100)}%` }}
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
