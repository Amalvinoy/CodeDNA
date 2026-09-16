'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MemoryService } from '@/services';
import { MemoryRuleItem } from '@/types';
import {
  BrainCircuit,
  Search,
  Sparkles,
  Shield,
  Zap,
  Layers,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export default function MemoryPage() {
  const [rules, setRules] = useState<MemoryRuleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MemoryService.getMemoryRules({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        limit: 50,
      });
      setRules(data || []);
    } catch (err: any) {
      console.warn('Failed to load memory rules:', err);
      setError(err?.message || 'Failed to load institutional memory rules.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRules();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadRules]);

  const categories = [
    'ALL',
    'Security',
    'Performance',
    'Architecture',
    'Correctness',
    'Maintainability',
    'Formatting',
    'Style',
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header matching Stitch */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Review Memory</span>
              <BrainCircuit className="w-6 h-6 text-[#38bdf8]" />
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Living institutional memory and accumulated engineering anti-pattern intelligence.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0f2438] border border-[#1e4566] text-[#67e8f9] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{rules.length} Grounded Policies Active</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical rules, vulnerabilities, or patterns..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b101b] border border-[#162032] rounded-lg text-xs font-mono text-[#cbd5e1] placeholder-[#475569] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#131d2e] text-[#38bdf8] border border-[#1e3e60] font-bold'
                    : 'bg-[#0b101b] text-[#94a3b8] border border-[#162032] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs font-mono">
            <Sliders className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 bg-[#0b101b] border border-[#162032] rounded-xl p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#64748b]">Loading institutional memory rules...</span>
            </div>
          ) : rules.length === 0 ? (
            <div className="col-span-2 bg-[#0b101b] border border-[#162032] rounded-xl p-8 text-center text-xs font-mono text-[#64748b]">
              No historical rules match the search criteria.
            </div>
          ) : (
            rules.map((rule) => {
              const isSec = rule.category === 'SECURITY';
              const isPerf = rule.category === 'PERFORMANCE';
              const isArch = rule.category === 'ARCHITECTURE';

              const categoryColor = isSec
                ? 'text-[#f87171] border-[#521b27] bg-[#2a141b]'
                : isPerf
                ? 'text-[#fbbf24] border-[#4a341b] bg-[#291e12]'
                : isArch
                ? 'text-[#a78bfa] border-[#3b2a5c] bg-[#1a122e]'
                : 'text-[#38bdf8] border-[#1e4566] bg-[#0f2438]';

              return (
                <div
                  key={rule.id}
                  className="bg-[#0b101b] border border-[#162032] rounded-xl p-6 space-y-4 shadow-lg hover:border-[#1e2e4a] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#38bdf8]">
                          #{rule.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${categoryColor}`}
                        >
                          {rule.category}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-[#38bdf8] font-semibold">
                        Match Accuracy: {rule.matchPercent}%
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {rule.title}
                    </h3>

                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  {/* Footer Telemetry */}
                  <div className="border-t border-[#172033] pt-4 space-y-2 text-[10px] font-mono text-[#64748b]">
                    <div className="flex items-center justify-between">
                      <span>Source repository:</span>
                      <span className="text-[#cbd5e1]">{rule.learnedFrom}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prevention rate:</span>
                      <span className="text-[#38bdf8] font-bold">
                        {rule.preventionRate}% Effective
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last enforced:</span>
                      <span className="text-[#94a3b8]">{rule.lastEnforced}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
