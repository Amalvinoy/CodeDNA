'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ReviewHeader,
  IssueExplorer,
  IssueDetailCard,
  CodeContextViewer,
} from '@/components/review';
import { ReviewService } from '@/services';
import { ReviewItem } from '@/types';
import { ArrowLeft, Loader2, AlertCircle, Wrench } from 'lucide-react';

export default function ReviewResultPage() {
  const params = useParams();
  const reviewId = (params?.reviewId as string) || '';

  const [review, setReview] = useState<ReviewItem | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reviewId) return;

    setIsLoading(true);
    ReviewService.getReviewById(reviewId)
      .then((data) => {
        if (data) {
          setReview(data);
          if (data.issues && data.issues.length > 0) {
            setSelectedIssueId(data.issues[0].id);
          }
        } else {
          setError('Review not found or unauthorized.');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load review.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reviewId]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-sm font-mono text-[#64748b]">
          <Loader2 className="w-6 h-6 animate-spin text-[#38bdf8]" />
          <span>Loading review analysis...</span>
        </div>
      </AppLayout>
    );
  }

  if (error || !review) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto mt-12 bg-[#0b101b] border border-[#162032] rounded-xl p-8 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-10 h-10 text-[#f87171] mx-auto" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            {error || 'Review Not Found'}
          </h2>
          <p className="text-xs font-mono text-[#64748b]">
            The requested review ID does not exist or belongs to another user account.
          </p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#131d2e] border border-[#1e3e60] text-xs font-mono text-[#38bdf8] rounded-lg hover:bg-[#1a2942] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Review History</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const activeIssue =
    review.issues.find((i) => i.id === selectedIssueId) || review.issues[0];

  const appliedCount = Object.values(appliedFixes).filter(Boolean).length;

  const handleFixApplied = (issueId: string) => {
    setAppliedFixes((prev) => ({ ...prev, [issueId]: true }));
  };

  const handleFixReverted = (issueId: string) => {
    setAppliedFixes((prev) => ({ ...prev, [issueId]: false }));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Summary & Score Header */}
        <div className="space-y-3">
          <ReviewHeader
            reviewId={`#${review.id}`}
            title={review.title}
            summary={review.aiSummary}
            qualityScore={review.qualityScore}
            scoreDelta={review.scoreDelta}
            issuesCount={review.issues.length}
            hasCritical={review.issues.some((i) => i.severity === 'critical')}
          />

          {/* Local Draft Indicator Banner */}
          {appliedCount > 0 && (
            <div className="p-3 bg-[#0a1812] border border-[#184e32] rounded-xl flex items-center justify-between text-xs font-mono text-[#34d399]">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#34d399]" />
                <span>
                  <strong>{appliedCount}</strong> local fix draft(s) active in current view. MongoDB review record remains immutable.
                </span>
              </div>
              <span className="text-[11px] text-[#6ee7b7] opacity-80">
                Refresh to reset view to original review
              </span>
            </div>
          )}
        </div>

        {/* Split View: Explorer + Issue Detail & Source Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Issue Explorer */}
          <div className="lg:col-span-4 h-full">
            <IssueExplorer
              issues={review.issues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={setSelectedIssueId}
            />
          </div>

          {/* Right Column: Active Issue Detail + Source Code Context */}
          <div className="lg:col-span-8 space-y-6">
            {activeIssue ? (
              <>
                <IssueDetailCard issue={activeIssue} />
                <CodeContextViewer
                  issue={activeIssue}
                  isApplied={Boolean(appliedFixes[activeIssue.id])}
                  onFixApplied={handleFixApplied}
                  onFixReverted={handleFixReverted}
                />
              </>
            ) : (
              <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-8 text-center text-[#64748b]">
                No issues detected in this review.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
