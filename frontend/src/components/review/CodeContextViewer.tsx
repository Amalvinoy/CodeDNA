'use client';

import React, { useState } from 'react';
import { Sparkles, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { CodeIssue } from '@/types';

interface CodeContextViewerProps {
  issue: CodeIssue;
  isApplied?: boolean;
  onFixApplied?: (issueId: string) => void;
  onFixReverted?: (issueId: string) => void;
}

export function CodeContextViewer({
  issue,
  isApplied: externalApplied,
  onFixApplied,
  onFixReverted,
}: CodeContextViewerProps) {
  const [internalApplied, setInternalApplied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isApplied = externalApplied !== undefined ? externalApplied : internalApplied;

  const handleOpenPreview = () => {
    if (!issue.suggestedFix || !issue.suggestedFix.trim()) return;
    setShowPreview(true);
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
  };

  const handleConfirmApply = () => {
    // Modify local view state only - never mutate persisted review
    setInternalApplied(true);
    setShowPreview(false);
    if (onFixApplied) {
      onFixApplied(issue.id);
    }
  };

  const handleRevert = () => {
    setInternalApplied(false);
    if (onFixReverted) {
      onFixReverted(issue.id);
    }
  };

  const baseLines = issue.codeContextSnippet?.lines || [
    { lineNumber: issue.line, code: issue.codeSnippet, isHighlighted: true },
  ];

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg overflow-hidden flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3.5 bg-[#0b111e] border-b border-[#162032] gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#94a3b8] font-semibold">
            Source Code Context
          </span>
          {isApplied && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0f2b1d] border border-[#184e32] text-[#34d399] font-bold">
              Local Draft
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isApplied ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0f2b1d] border border-[#184e32] text-xs font-mono text-[#34d399]">
                <Check className="w-3.5 h-3.5" />
                <span>Fix Applied</span>
              </div>
              <button
                type="button"
                onClick={handleRevert}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#101827] border border-[#1e2d42] hover:bg-[#182338] text-xs font-mono text-[#94a3b8] hover:text-white transition-colors"
                title="Revert local view to original code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenPreview}
              disabled={!issue.suggestedFix || !issue.suggestedFix.trim()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#080d16] border border-[#1e293b] hover:border-[#38bdf8] hover:text-[#38bdf8] disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-[#cbd5e1] text-xs font-mono text-[#cbd5e1] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>
                {issue.suggestedFix ? 'Preview & Apply Fix' : 'No Fix Suggestion Available'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Safe Fix Preview Comparison (Before & After) */}
      {showPreview && (
        <div className="p-5 bg-[#080d16] border-b border-[#162032] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span>Safe Fix Preview (Before & After)</span>
            </div>
            <span className="text-[10px] font-mono text-[#64748b]">
              Local state change only • MongoDB review remains immutable
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BEFORE */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#f87171] uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" />
                <span>BEFORE (Original Lines)</span>
              </div>
              <div className="p-3 bg-[#180a0e] border border-[#521b27] rounded-lg text-xs font-mono text-[#fca5a5] whitespace-pre-wrap overflow-x-auto min-h-[70px]">
                {issue.codeSnippet || '// Original line block'}
              </div>
            </div>

            {/* AFTER */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#34d399] uppercase tracking-wider">
                <Check className="w-3 h-3" />
                <span>AFTER (Proposed Replacement)</span>
              </div>
              <div className="p-3 bg-[#0a1812] border border-[#184e32] rounded-lg text-xs font-mono text-[#6ee7b7] whitespace-pre-wrap overflow-x-auto min-h-[70px]">
                {issue.suggestedFix}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelPreview}
              className="px-4 py-1.5 rounded-lg bg-[#101827] border border-[#1e2d42] text-xs font-mono text-[#94a3b8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmApply}
              className="px-5 py-1.5 rounded-lg bg-[#0f3824] hover:bg-[#154d32] border border-[#1c6643] text-xs font-mono font-bold text-[#34d399] transition-all shadow-md active:scale-[0.98]"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Code Viewer: displays original or local draft replacement */}
      <div className="p-4 bg-[#080d16] overflow-x-auto font-mono text-xs leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {baseLines.map((line) => {
              const isTargetLine = line.lineNumber === issue.line || line.isHighlighted;

              if (isTargetLine && isApplied) {
                // Render the applied draft replacement
                return (
                  <tr
                    key={`draft-${line.lineNumber}`}
                    className="bg-[#0a2016] border-l-2 border-[#34d399]"
                  >
                    <td className="py-1 px-3 text-right text-[#34d399] select-none w-10 text-[11px] align-top font-bold">
                      {line.lineNumber}*
                    </td>
                    <td className="py-1 px-3 whitespace-pre text-[#6ee7b7] font-medium">
                      {issue.suggestedFix}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={line.lineNumber}
                  className={
                    isTargetLine
                      ? 'bg-[#291419] border-l-2 border-[#f87171]'
                      : 'hover:bg-[#0c1322]'
                  }
                >
                  <td className="py-1 px-3 text-right text-[#475569] select-none w-10 text-[11px] align-top">
                    {line.lineNumber}
                  </td>
                  <td
                    className={`py-1 px-3 whitespace-pre ${
                      isTargetLine ? 'text-[#fca5a5] font-medium' : 'text-[#cbd5e1]'
                    }`}
                  >
                    {line.code}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
