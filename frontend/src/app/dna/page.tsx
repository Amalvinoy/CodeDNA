'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  DnaHeroVisual,
  StrengthsCard,
  OptimizationsCard,
  EvolutionTrajectoryChart,
  PatternHistoryChart,
} from '@/components/dna';
import { DnaService } from '@/services';
import { DeveloperDnaProfile } from '@/types';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function CodeDnaPage() {
  const [profile, setProfile] = useState<DeveloperDnaProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDna = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await DnaService.getCodeDnaProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Failed to load Code DNA profile:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to retrieve Code DNA profile. Please verify your connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDna();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Your Code DNA
            </h1>
            <p className="text-xs font-mono text-[#64748b]">
              <span className="text-[#38bdf8]">|</span> A profile of how you engineer.
            </p>
          </div>

          <button
            onClick={fetchDna}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b101b] border border-[#162032] hover:border-[#253550] text-xs font-mono text-[#94a3b8] hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync DNA</span>
          </button>
        </div>

        {/* Error State if GET /api/dna fails */}
        {error ? (
          <div className="bg-[#180d12] border border-[#4a1c26] rounded-xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#2a141b] border border-[#5a1c28] flex items-center justify-center text-[#f87171] mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                Unable to Load Code DNA Profile
              </h2>
              <p className="text-xs font-mono text-[#f87171] max-w-md mx-auto">
                {error}
              </p>
            </div>
            <button
              onClick={fetchDna}
              className="px-4 py-2 bg-[#56b6f7] hover:bg-[#38bdf8] text-[#030712] font-mono font-bold text-xs rounded-lg transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* Top Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left / Main Cognitive & Structural Footprint Visual */}
              <div className="lg:col-span-8">
                <DnaHeroVisual
                  metrics={profile?.metrics}
                  languages={profile?.languages}
                  reviewCount={profile?.reviewCount ?? 0}
                />
              </div>

              {/* Right Column: Strengths & Optimization Cards */}
              <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
                <StrengthsCard strengths={profile?.strengths} />
                <OptimizationsCard optimizations={profile?.areasForOptimization} />
              </div>
            </div>

            {/* Bottom Row: Evolution Trajectory & Pattern History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div>
                <EvolutionTrajectoryChart
                  data={profile?.evolutionTrajectory}
                  ptsDelta={profile?.improvementMonthPercent ?? 0}
                />
              </div>

              <div>
                <PatternHistoryChart patterns={profile?.patternHistory} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
