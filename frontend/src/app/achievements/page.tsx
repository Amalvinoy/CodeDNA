'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AchievementService, AchievementsData } from '@/services';
import {
  Award,
  Flame,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    AchievementService.getAchievements()
      .then((data) => {
        if (data) {
          setAchievements(data);
        }
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load achievements.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const xp = achievements?.xp || {
    level: 1,
    levelTitle: 'Junior Developer',
    currentXp: 0,
    targetXp: 1000,
    nextLevel: 2,
  };
  const milestones = achievements?.milestones || [];
  const badges = achievements?.badges || [];
  const streak = achievements?.improvementStreak ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Engineering Progress</span>
              <Award className="w-6 h-6 text-[#fbbf24]" />
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Measurable skill progression, milestones, and architectural mastery.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#291e12] border border-[#4a341b] text-[#fbbf24] text-xs font-mono font-bold">
            <Flame className="w-4 h-4 text-[#fbbf24]" />
            <span>{streak} Day Improvement Streak</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs font-mono">
            <Award className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#64748b]">Loading engineering progress telemetry...</span>
          </div>
        ) : (
          <>
            {/* Top XP Progression Hero */}
            <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#64748b] uppercase">
              CURRENT STATUS
            </span>
            <div className="text-4xl font-black text-[#67e8f9] font-mono">
              Lvl.{xp.level}
            </div>
            <div className="text-sm font-semibold text-white">
              {xp.levelTitle}
            </div>
          </div>

          <div className="md:col-span-8 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#cbd5e1]">Level Progression</span>
              <span className="text-[#38bdf8] font-bold">
                {xp.currentXp.toLocaleString()} / {xp.targetXp.toLocaleString()} XP
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#172033] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#56b6f7] rounded-full shadow-[0_0_12px_rgba(86,182,247,0.5)]"
                style={{
                  width: `${(xp.currentXp / xp.targetXp) * 100}%`,
                }}
              />
            </div>

            <p className="text-[11px] font-mono text-[#64748b]">
              Earn {Math.max(0, xp.targetXp - xp.currentXp).toLocaleString()} more XP to unlock Level {xp.nextLevel || xp.level + 1}.
            </p>
          </div>
        </div>

        {/* Milestones & Badges Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Engineering Milestones */}
          <div className="lg:col-span-7 bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-[#38bdf8]" />
              <span>Engineering Milestones</span>
            </h2>

            {milestones.length === 0 ? (
              <p className="text-xs font-mono text-[#64748b] py-6 text-center">
                No engineering milestones unlocked yet.
              </p>
            ) : (
              <div className="space-y-3">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-[#080d16] border border-[#172033] rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399] mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#475569] mt-0.5" />
                      )}

                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white">
                          {m.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748b]">
                          {m.category} {m.date ? `• ${m.date}` : `• ${m.progress}`}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#38bdf8] flex-shrink-0">
                      {m.xpReward}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Badges */}
          <div className="lg:col-span-5 bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
              <span>Mastery Badges</span>
            </h2>

            {badges.length === 0 ? (
              <p className="text-xs font-mono text-[#64748b] py-6 text-center">
                No mastery badges unlocked yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${
                      badge.isUnlocked
                        ? 'bg-[#080d16] border-[#172235]'
                        : 'bg-[#06090e] border-[#101726] opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded bg-[#0f2438] flex items-center justify-center text-[#38bdf8]">
                        {badge.isUnlocked ? (
                          <Zap className="w-4 h-4 text-[#38bdf8]" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#475569]" />
                        )}
                      </div>
                      {badge.isUnlocked && (
                        <span className="text-[9px] font-mono text-[#34d399] font-bold">
                          UNLOCKED
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        {badge.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#64748b]">
                        {badge.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </AppLayout>
  );
}
