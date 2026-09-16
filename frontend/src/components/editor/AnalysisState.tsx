'use client';

import React from 'react';
import { FlaskConical, SlidersHorizontal, Maximize2, Check, Loader2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export type AnalysisStatus = 'idle' | 'running' | 'completed' | 'failed';

interface AnalysisStateProps {
  status: AnalysisStatus;
  currentStep?: number;
  onRunAnalysis?: () => void;
}

const analysisSteps = [
  'Parsing code structure',
  'Running static analysis & AST inspection',
  'Searching historical team patterns',
  'AI reasoning & semantic vulnerability scan',
  'Building risk forecast & DNA delta',
];

export function AnalysisState({
  status = 'idle',
  currentStep = 0,
  onRunAnalysis,
}: AnalysisStateProps) {
  return (
    <div className="flex flex-col h-full bg-[#080d16] border border-[#162032] rounded-lg overflow-hidden">
      {/* Header matching Stitch */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b111e] border-b border-[#162032]">
        <span className="text-[11px] font-mono tracking-widest text-[#64748b] uppercase">
          ANALYSIS PREVIEW
        </span>
        <div className="flex items-center gap-2 text-[#64748b]">
          <SlidersHorizontal className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Maximize2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {status === 'idle' && (
          <div className="max-w-sm flex flex-col items-center space-y-4">
            {/* Flask Icon in dark rounded box matching Stitch */}
            <div className="w-14 h-14 rounded-xl bg-[#101827] border border-[#1e293b] flex items-center justify-center text-[#475569]">
              <FlaskConical className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Ready for Analysis
            </h3>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Select an environment and click &apos;Analyze Code&apos; to run static
              analysis, identify patterns, and calculate risk forecast.
            </p>
          </div>
        )}

        {status === 'running' && (
          <div className="w-full max-w-sm text-left space-y-5">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-[#38bdf8] animate-spin" />
              <h4 className="text-sm font-bold text-white font-mono">
                ANALYZING CODE SEQUENCE...
              </h4>
            </div>

            {/* Steps list */}
            <div className="space-y-3 pt-2">
              {analysisSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                    {isDone ? (
                      <div className="w-4 h-4 rounded-full bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#10b981]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-[#334155]" />
                    )}

                    <span
                      className={
                        isDone
                          ? 'text-[#94a3b8]'
                          : isCurrent
                          ? 'text-[#38bdf8] font-semibold'
                          : 'text-[#475569]'
                      }
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="max-w-sm flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-xl bg-[#102922] border border-[#164e40] flex items-center justify-center text-[#34d399]">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Analysis Completed
            </h3>

            <p className="text-xs text-[#64748b]">
              3 issues detected • 1 Critical Security Vulnerability • Code Quality 7.8/10
            </p>

            <Link
              href="/review/REV-8924A"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#030712] rounded-md font-semibold text-xs transition-colors"
            >
              <span>View Full Review Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
