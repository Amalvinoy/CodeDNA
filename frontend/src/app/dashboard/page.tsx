'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  DnaScoreCard,
  AttributeMatrix,
  RecurringPatternsCard,
  RiskForecastCard,
  RecentReviewsCard,
} from '@/components/dashboard';
import { DnaService, RiskService, ReviewService, HealthService } from '@/services';
import { DeveloperDnaProfile, ReviewItem, RecurringPattern, RiskForecastItem } from '@/types';
import { Activity } from 'lucide-react';

export default function DashboardPage() {
  const [dna, setDna] = useState<DeveloperDnaProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [risks, setRisks] = useState<{ category: string; level: 'HIGH' | 'MEDIUM' | 'LOW'; percent: number }[]>([]);
  const [patterns, setPatterns] = useState<RecurringPattern[]>([]);
  const [dbStatus, setDbStatus] = useState<string>('checking');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      // 1. Check health & MongoDB status
      HealthService.checkHealth()
        .then((h) => {
          setDbStatus(h.database?.status || 'disconnected');
        })
        .catch(() => {
          setDbStatus('disconnected');
        }),

      // 2. Fetch Code DNA Profile
      DnaService.getCodeDnaProfile().then((data) => {
        if (data) {
          setDna(data);
          if (data.areasForOptimization && data.areasForOptimization.length > 0) {
            setPatterns(
              data.areasForOptimization.map((opt, idx) => ({
                id: opt.id || `opt-${idx}`,
                name: opt.title,
                instances: opt.occurrenceCount || 2,
                severity:
                  opt.priority === 'High Priority'
                    ? 'high'
                    : opt.priority === 'Medium Priority'
                    ? 'medium'
                    : 'low',
              }))
            );
          }
        }
      }),

      // 3. Fetch Reviews
      ReviewService.getReviews().then((revs) => {
        if (revs && revs.length > 0) {
          setReviews(revs);
        }
      }),

      // 4. Fetch Predictive Risk
      RiskService.getPredictiveRisk().then((riskData) => {
        if (riskData && typeof riskData.riskPercent === 'number') {
          const primaryCat = riskData.overallCategory || 'Risk Surface';
          const primaryLevel =
            riskData.riskLevel ||
            (riskData.riskPercent >= 65
              ? 'HIGH'
              : riskData.riskPercent >= 35
              ? 'MEDIUM'
              : 'LOW');

          const derivedRisks: {
            category: string;
            level: 'HIGH' | 'MEDIUM' | 'LOW';
            percent: number;
          }[] = [
            {
              category: primaryCat,
              level: primaryLevel,
              percent: riskData.riskPercent,
            },
          ];

          if (riskData.primaryFactors && riskData.primaryFactors.length > 0) {
            riskData.primaryFactors.slice(0, 2).forEach((factor) => {
              const factorLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
                factor.impactPercent >= 50
                  ? 'HIGH'
                  : factor.impactPercent >= 25
                  ? 'MEDIUM'
                  : 'LOW';
              derivedRisks.push({
                category: factor.label,
                level: factorLevel,
                percent: factor.impactPercent,
              });
            });
          }

          setRisks(derivedRisks);
        } else {
          setRisks([]);
        }
      }),
    ])
      .catch((err: any) => {
        setError(err?.message || 'Failed to load telemetry data.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const defaultAttributeScores = [
    { name: 'Security', label: 'Security', score: dna?.attributes?.security ?? 0, fullMark: 100 },
    { name: 'Correctness', label: 'Correctness', score: dna?.attributes?.correctness ?? 0, fullMark: 100 },
    { name: 'Maintainability', label: 'Maintainability', score: dna?.attributes?.maintainability ?? 0, fullMark: 100 },
    { name: 'Architecture', label: 'Architecture', score: dna?.attributes?.architecture ?? 0, fullMark: 100 },
    { name: 'Performance', label: 'Performance', score: dna?.attributes?.performance ?? 0, fullMark: 100 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header matching Stitch */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Developer Dashboard
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Real-time engineering intelligence, Code DNA synthesis, and predictive risk indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b101b] border border-[#162032] text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
            <span className="text-[#94a3b8]">Database:</span>
            <span
              className={`font-bold ${
                dbStatus === 'connected' ? 'text-[#4ade80]' : 'text-[#fbbf24]'
              }`}
            >
              {dbStatus === 'connected' ? 'MongoDB Active' : dbStatus}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs font-mono">
            <Activity className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top Row: DNA Score Hero + Attribute Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <DnaScoreCard
              score={dna?.overallScore ?? 0}
              maxScore={100}
              improvementPercent={dna?.improvementMonthPercent ?? 0}
              level={dna?.level ?? 1}
              levelTitle={dna?.levelTitle ?? 'NEW DEVELOPER'}
              progressPercent={dna?.progressToNextLevel ?? 0}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <AttributeMatrix attributes={dna?.attributes} />
          </div>
        </div>

        {/* Bottom Row: 3-column Grid matching Stitch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <div className="flex flex-col">
            <RecurringPatternsCard patterns={patterns} />
          </div>

          <div className="flex flex-col">
            <RiskForecastCard risks={risks} />
          </div>

          <div className="flex flex-col">
            <RecentReviewsCard reviews={reviews} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
