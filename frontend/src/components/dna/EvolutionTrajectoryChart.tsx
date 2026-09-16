'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EvolutionTrajectoryChartProps {
  data?: { month: string; score: number }[];
  ptsDelta?: number;
}

export function EvolutionTrajectoryChart({
  data = [],
  ptsDelta = 0,
}: EvolutionTrajectoryChartProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Evolution Trajectory
        </h3>
        {ptsDelta > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0f2438] border border-[#1e4566] text-[#38bdf8] text-[11px] font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+{ptsDelta} Pts</span>
          </div>
        )}
      </div>

      {/* Chart or Empty State */}
      {(!data || data.length === 0) ? (
        <div className="h-44 w-full flex items-center justify-center bg-[#080d16] border border-[#172033] rounded-md text-xs font-mono text-[#64748b]">
          No evolution data yet
        </div>
      ) : (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#172235' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#172235' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#080d16',
                  borderColor: '#1e3456',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#scoreGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
