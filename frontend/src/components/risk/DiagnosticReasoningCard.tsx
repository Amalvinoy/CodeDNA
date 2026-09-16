'use client';

import React from 'react';
import { FileCode, AtSign } from 'lucide-react';
import { PredictiveRiskData } from '@/types';

interface DiagnosticReasoningCardProps {
  reasoning: PredictiveRiskData['diagnosticReasoning'];
}

export function DiagnosticReasoningCard({
  reasoning,
}: DiagnosticReasoningCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
      {/* Main Inner Content */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Diagnostic Reasoning
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Explain why we predict this trajectory.
          </p>
        </div>

        {/* 2-Column Split matching Stitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Semantic Explanation & Historical Evidence */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              {reasoning.summary || (
                <>
                  The prediction engine has analyzed structural patterns in{' '}
                  <span className="text-[#38bdf8] font-mono font-semibold">
                    {reasoning.affectedClass}
                  </span>{' '}
                  against established engineering memory rules.
                </>
              )}
            </p>

            {/* Historical Evidence Box matching Stitch */}
            <div className="p-4 bg-[#080e18] border-l-2 border-l-[#f87171] border-y border-r border-[#172235] rounded-r-lg space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f87171]">
                <AtSign className="w-3.5 h-3.5" />
                <span>Historical Evidence:</span>
              </div>
              {reasoning.historicalEvidence?.occurrences > 0 ? (
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  This pattern was encountered{' '}
                  <strong className="text-white">
                    {reasoning.historicalEvidence.occurrences} times in the last{' '}
                    {reasoning.historicalEvidence.sampleReviews} reviews
                  </strong>{' '}
                  within this repository. In {reasoning.historicalEvidence.productionAlerts}{' '}
                  of those instances, it correlated with elevated operational risk
                  within {reasoning.historicalEvidence.timeframe} of deployment.
                </p>
              ) : (
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  No historical recurring anomalies detected across{' '}
                  <strong className="text-white">
                    {reasoning.historicalEvidence?.sampleReviews || 0} reviews
                  </strong>
                  . Code aligns with repository baseline patterns.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Historical Incidents Timeline matching Stitch */}
          <div className="lg:col-span-5 space-y-3.5 border-l border-[#172235] pl-6">
            {!reasoning.incidentTimeline || reasoning.incidentTimeline.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs font-mono text-[#64748b]">
                  No historical incident regressions detected for this submission.
                </p>
              </div>
            ) : (
              reasoning.incidentTimeline.map((item) => {
                const dotColor =
                  item.severity === 'red'
                    ? 'bg-[#f87171]'
                    : item.severity === 'amber'
                    ? 'bg-[#fbbf24]'
                    : 'bg-[#34d399]';

                return (
                  <div key={item.id} className="relative pl-4 space-y-1">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[29px] top-1.5 w-2 h-2 rounded-full ${dotColor}`}
                    />

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-white">
                        {item.pr}: {item.title}
                      </span>
                      <span className="text-[10px] text-[#64748b]">
                        {item.timeAgo}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Target File Bar at Bottom matching Stitch */}
      <div className="px-6 py-3 bg-[#080d16] border-t border-[#172033] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#94a3b8]">
          <FileCode className="w-3.5 h-3.5 text-[#64748b]" />
          <span>{reasoning.targetFile}</span>
        </div>
        <span className="text-[#f87171] font-semibold text-[11px]">
          {reasoning.targetLines}
        </span>
      </div>
    </div>
  );
}
