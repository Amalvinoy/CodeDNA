'use client';

import React from 'react';

interface BattleScoreWidgetProps {
  originalScore?: number;
  optimizedScore?: number;
  scoreDelta?: number;
  winner?: 'Original' | 'AI Optimization' | 'Tie';
}

export function BattleScoreWidget({
  originalScore = 0,
  optimizedScore = 0,
  scoreDelta,
  winner,
}: BattleScoreWidgetProps) {
  const delta = scoreDelta !== undefined ? scoreDelta : Number((optimizedScore - originalScore).toFixed(1));
  const calculatedWinner =
    winner ||
    (optimizedScore > originalScore
      ? 'AI Optimization'
      : optimizedScore < originalScore
      ? 'Original'
      : 'Tie');

  const winnerLabel =
    calculatedWinner === 'AI Optimization'
      ? 'AI WINNER'
      : calculatedWinner === 'Original'
      ? 'ORIGINAL WINNER'
      : 'TIED';

  const winnerColor =
    calculatedWinner === 'AI Optimization'
      ? 'text-[#38bdf8] drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]'
      : calculatedWinner === 'Original'
      ? 'text-[#34d399] drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]'
      : 'text-[#94a3b8]';

  const deltaColor =
    delta > 0
      ? 'text-[#38bdf8] bg-[#0c2236] border-[#1b3d5e]'
      : delta < 0
      ? 'text-[#f87171] bg-[#2a141b] border-[#521b27]'
      : 'text-[#94a3b8] bg-[#162032] border-[#223049]';

  return (
    <div className="bg-[#101726] border border-[#1e2d45] rounded-xl px-5 py-2.5 flex items-center gap-5 shadow-lg">
      <div className="flex flex-col items-center">
        <span className="text-[9px] font-mono tracking-widest text-[#64748b] uppercase font-bold">
          YOUR CODE
        </span>
        <span className="text-2xl sm:text-3xl font-black text-[#cbd5e1] font-mono">
          {originalScore.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[8px] font-mono tracking-wider text-[#64748b] uppercase font-bold">
          DELTA
        </span>
        <span className={`px-2 py-0.5 rounded border text-[11px] font-mono font-bold ${deltaColor}`}>
          {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
        </span>
      </div>

      <div className="h-8 w-px bg-[#1e2d45]" />

      <div className="flex flex-col items-center">
        <span className="text-[9px] font-mono tracking-widest text-[#64748b] uppercase font-bold">
          AI CANDIDATE
        </span>
        <span className={`text-2xl sm:text-3xl font-black font-mono ${winnerColor}`}>
          {optimizedScore.toFixed(1)}
        </span>
      </div>

      <div className="hidden sm:flex flex-col items-center pl-2 border-l border-[#1e2d45]">
        <span className="text-[8px] font-mono tracking-wider text-[#64748b] uppercase">
          RESULT
        </span>
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-white">
          {winnerLabel}
        </span>
      </div>
    </div>
  );
}
