'use client';

import React from 'react';
import Link from 'next/link';
import { ReviewItem } from '@/types';

interface RecentReviewsCardProps {
  reviews?: ReviewItem[];
}

export function RecentReviewsCard({
  reviews = [],
}: RecentReviewsCardProps) {
  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Recent Reviews
          </h3>
          <Link
            href="/history"
            className="text-[11px] font-mono text-[#38bdf8] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="mt-6 py-6 text-center text-xs font-mono text-[#64748b] bg-[#080d16] border border-[#172033] rounded-md">
            <span>No reviews completed yet.</span>
            <div className="mt-2">
              <Link
                href="/review/new"
                className="text-[#38bdf8] hover:underline text-[11px]"
              >
                + Start your first review
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {reviews.map((rev) => {
              const langBg =
                rev.language === 'TS'
                  ? 'bg-[#102438] text-[#38bdf8] border-[#1e4566]'
                  : rev.language === 'PY'
                  ? 'bg-[#292212] text-[#fbbf24] border-[#4a3a1f]'
                  : 'bg-[#0e2c2c] text-[#2dd4bf] border-[#164e4e]';

              const statusText =
                rev.status === 'Critical'
                  ? `${rev.criticalCount} Critical`
                  : rev.status === 'Warning'
                  ? `${rev.warningCount} Warning`
                  : 'Clean';

              const statusColor =
                rev.status === 'Critical'
                  ? 'text-[#f87171]'
                  : rev.status === 'Warning'
                  ? 'text-[#fbbf24]'
                  : 'text-[#34d399]';

              return (
                <Link
                  key={rev.id}
                  href={`/review/${rev.id}`}
                  className="flex items-center gap-3 px-3 py-2 bg-[#080d16] border border-[#172033] rounded-md transition-all hover:border-[#1e3456] hover:bg-[#0c1322] group"
                >
                  {/* Language Badge */}
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold border ${langBg}`}
                  >
                    {rev.language}
                  </div>

                  {/* File & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-[#e2e8f0] truncate group-hover:text-[#67e8f9] transition-colors">
                      {rev.file}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748b]">
                      <span className={`font-semibold ${statusColor}`}>
                        {statusText}
                      </span>
                      <span>•</span>
                      <span>{rev.qualityScore} Score</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
