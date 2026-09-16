'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';

interface BattleEditorPanelProps {
  type: 'original' | 'optimized';
  file: string;
  code: string;
  tag?: string;
  findingsCount?: number;
}

export function BattleEditorPanel({
  type,
  file,
  code,
  tag,
  findingsCount,
}: BattleEditorPanelProps) {
  const isOriginal = type === 'original';
  const Icon = isOriginal ? User : Bot;
  const title = isOriginal ? 'YOUR CODE' : 'AI OPTIMIZED';

  const lines = (code || '').split('\n');

  return (
    <div className="flex flex-col h-full bg-[#080d16] border border-[#162032] rounded-xl overflow-hidden shadow-xl">
      {/* Header bar matching Stitch */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0b111e] border-b border-[#162032]">
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <Icon className={`w-3.5 h-3.5 ${isOriginal ? 'text-[#94a3b8]' : 'text-[#38bdf8]'}`} />
          <span className={isOriginal ? 'text-[#cbd5e1]' : 'text-[#38bdf8]'}>
            {title}
          </span>
          {findingsCount !== undefined && (
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                findingsCount === 0
                  ? 'bg-[#0f2b1d] border-[#184e32] text-[#34d399]'
                  : 'bg-[#2a141b] border-[#521b27] text-[#f87171]'
              }`}
            >
              {findingsCount} finding{findingsCount === 1 ? '' : 's'}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-[#64748b]">
          {tag ? `Complexity: ${tag}` : isOriginal ? file : 'Complexity: Not determined'}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 p-4 bg-[#080d16] overflow-x-auto font-mono text-xs leading-relaxed select-text min-h-[380px]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#0c1322]">
                <td className="py-0.5 px-3 text-right text-[#334155] select-none w-8 text-[11px] align-top">
                  {idx + 1}
                </td>
                <td className="py-0.5 px-3 whitespace-pre text-[#cbd5e1]">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
