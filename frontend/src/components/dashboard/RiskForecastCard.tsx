'use client';

import React from 'react';
import { Target } from 'lucide-react';

interface RiskForecastCardProps {
  risks?: {
    category: string;
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    percent: number;
  }[];
}

export function RiskForecastCard({
  risks = [],
}: RiskForecastCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header with Title & Target Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Risk Forecast
          </h3>
          <Target className="w-4 h-4 text-[#38bdf8]" />
        </div>
        <p className="text-xs text-[#64748b] mt-0.5">
          What you&apos;re likely to get wrong next.
        </p>

        {/* Meters List matching Stitch */}
        {risks.length === 0 ? (
          <div className="mt-6 py-6 text-center text-xs font-mono text-[#64748b] bg-[#080d16] border border-[#172033] rounded-md">
            No risk data available yet
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {risks.map((risk) => {
              const barColor =
                risk.level === 'HIGH'
                  ? 'bg-[#f87171]'
                  : risk.level === 'MEDIUM'
                  ? 'bg-[#fbbf24]'
                  : 'bg-[#38bdf8]';

              const textColor =
                risk.level === 'HIGH'
                  ? 'text-[#f87171]'
                  : risk.level === 'MEDIUM'
                  ? 'text-[#fbbf24]'
                  : 'text-[#38bdf8]';

              return (
                <div key={risk.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#cbd5e1] text-[11px]">
                      {risk.category}
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${textColor}`}>
                      {risk.level}
                    </span>
                  </div>
                  {/* Track */}
                  <div className="w-full h-1 bg-[#172033] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full`}
                      style={{ width: `${risk.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
