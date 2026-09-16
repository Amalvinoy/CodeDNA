'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AchievementService, AchievementsData, ReviewService } from '@/services';
import { ReviewItem } from '@/types';
import {
  Filter,
  Download,
  Shield,
  AlertTriangle,
  Award,
  Database,
  Bug,
  Gauge,
  Cloud,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [revs, achs] = await Promise.all([
        ReviewService.getReviews(1, 20),
        AchievementService.getAchievements(),
      ]);
      setReviews(revs || []);
      setAchievements(achs);
    } catch (err: any) {
      console.warn('History load error:', err);
      setError(err?.message || 'Failed to load code review history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete review #${id}?`)) {
      const success = await ReviewService.deleteReview(id);
      if (success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    }
  };

  const xp = achievements?.xp || {
    level: 1,
    levelTitle: 'Junior Developer',
    currentXp: 0,
    targetXp: 1000,
    nextLevel: 2,
  };

  const badges = achievements?.badges || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header Bar matching Stitch Image 3 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Review History
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Timeline of past reviews, diagnostic trends, and architectural logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b101b] border border-[#162032] hover:border-[#253550] text-xs font-mono text-[#cbd5e1] transition-colors">
              <Filter className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b101b] border border-[#162032] hover:border-[#253550] text-xs font-mono text-[#cbd5e1] transition-colors">
              <Download className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout matching Stitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Diagnostic Logs (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
              <span>Diagnostic Logs</span>
              <span className="text-xs font-mono text-[#64748b]">
                {reviews.length} total reviews
              </span>
            </h2>

            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isLoading ? (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#38bdf8]" />
                <span className="text-xs font-mono text-[#64748b]">Loading review diagnostic telemetry...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-8 text-center space-y-3">
                <p className="text-xs font-mono text-[#64748b]">No reviews submitted yet.</p>
                <Link
                  href="/review/new"
                  className="inline-block px-4 py-2 bg-[#56b6f7] text-[#030712] font-mono font-bold text-xs rounded-lg hover:bg-[#38bdf8]"
                >
                  Start First Review
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => {
                  const score = rev.qualityScore <= 10 ? Math.round(rev.qualityScore * 10) : rev.qualityScore;
                  const isHigh = score >= 80;
                  const scoreColor = isHigh ? 'text-[#38bdf8]' : 'text-[#f87171]';
                  const ScoreIcon = isHigh ? Shield : AlertTriangle;
                  const borderAccent = isHigh
                    ? 'border-l-2 border-l-[#38bdf8]'
                    : 'border-l-2 border-l-[#f87171]';

                  return (
                    <div
                      key={rev.id}
                      className={`bg-[#0b101b] border border-[#162032] ${borderAccent} rounded-r-xl p-5 space-y-3.5 shadow-lg relative group`}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-[#38bdf8] font-bold">
                            #{rev.id}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#101827] border border-[#1e2d42] text-[10px] font-mono text-[#94a3b8]">
                            {rev.file}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#0f2438] border border-[#1e4566] text-[10px] font-mono text-[#38bdf8]">
                            {rev.language}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-[#64748b]">
                            {rev.timestamp}
                          </span>
                          <div className={`flex items-center gap-1 font-mono font-bold text-sm ${scoreColor}`}>
                            <ScoreIcon className="w-3.5 h-3.5" />
                            <span>{score}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {rev.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-[#cbd5e1] leading-relaxed">
                        {rev.aiSummary}
                      </p>

                      {/* Footer Actions & Badges */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#172033]/60 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              rev.status === 'Critical'
                                ? 'bg-[#2a141b] border-[#521b27] text-[#f87171]'
                                : rev.status === 'Warning'
                                ? 'bg-[#291e12] border-[#4a341b] text-[#fbbf24]'
                                : 'bg-[#0f2438] border-[#1e4566] text-[#38bdf8]'
                            }`}
                          >
                            {rev.status === 'Critical'
                              ? 'Critical Risk'
                              : rev.status === 'Warning'
                              ? 'Optimization Alert'
                              : 'Clean Pass'}
                          </span>
                          <span className="text-[10px] font-mono text-[#64748b]">
                            {rev.issues.length} {rev.issues.length === 1 ? 'issue' : 'issues'} found
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/review/${rev.id}`}
                            className="flex items-center gap-1 text-xs font-mono text-[#38bdf8] hover:underline"
                          >
                            <span>Open Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={(e) => handleDelete(rev.id, e)}
                            title="Delete Review"
                            className="text-[#64748b] hover:text-[#f87171] p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Developer XP & Technical Badges (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Developer XP Card */}
            <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Developer XP
                </h3>
                <Award className="w-4 h-4 text-[#fbbf24]" />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#67e8f9] font-mono">
                    Lvl.{xp.level}
                  </span>
                  <span className="text-xs font-mono text-[#94a3b8]">
                    {xp.levelTitle}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#56b6f7] rounded-full shadow-[0_0_8px_rgba(86,182,247,0.4)]"
                    style={{
                      width: `${(xp.currentXp / xp.targetXp) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b] mt-2">
                  <span>{xp.currentXp.toLocaleString()} XP</span>
                  <span>{xp.targetXp.toLocaleString()} XP (Lvl.{xp.nextLevel})</span>
                </div>
              </div>
            </div>

            {/* Technical Badges Grid */}
            <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Technical Badges
                </h3>
                <Link
                  href="/achievements"
                  className="text-[11px] font-mono text-[#38bdf8] hover:underline"
                >
                  View All
                </Link>
              </div>

              {badges.length === 0 ? (
                <p className="text-xs font-mono text-[#64748b] py-4 text-center">
                  No mastery badges unlocked yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => {
                    const Icon =
                      badge.icon === 'database'
                        ? Database
                        : badge.icon === 'bug'
                        ? Bug
                        : badge.icon === 'speed'
                        ? Gauge
                        : Cloud;

                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-lg border flex flex-col items-center text-center justify-between gap-2 min-h-[110px] transition-all ${
                          badge.isUnlocked
                            ? 'bg-[#080d16] border-[#172235] hover:border-[#1e3456]'
                            : 'bg-[#06090e] border-[#101726] opacity-50'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            badge.isUnlocked
                              ? 'bg-[#0f2438] text-[#38bdf8]'
                              : 'bg-[#101827] text-[#475569]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white font-mono">
                            {badge.title}
                          </div>
                          <div className="text-[9px] font-mono text-[#64748b]">
                            {badge.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
