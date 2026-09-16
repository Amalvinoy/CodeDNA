'use client';

import React, { useState } from 'react';
import { Send, Sparkles, AlertCircle, Award } from 'lucide-react';
import { BattleService } from '@/services';

export function ChallengeAiCard() {
  const [defenseText, setDefenseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defenseText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await BattleService.submitDefense(defenseText.trim());
      setAiFeedback(response.evaluation);
      if (response.pointsAwarded) {
        setPointsAwarded(response.pointsAwarded);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit defense reasoning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121926] border border-[#1e2d42] rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <span>Challenge the AI Optimization</span>
          </h3>
          <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
            Submit architectural defense reasoning to dispute the AI refactoring. Evaluated by backend engineering heuristics.
          </p>
        </div>

        {isSubmitting && (
          <span className="text-xs font-mono text-[#38bdf8] animate-pulse">
            Evaluating your defense arguments...
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={defenseText}
          onChange={(e) => setDefenseText(e.target.value)}
          placeholder="Explain why your original code is superior (e.g. memory constraints, throughput, simplicity)..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#090e18] border border-[#1c293e] text-xs font-mono text-[#cbd5e1] placeholder-[#475569] focus:outline-none focus:border-[#38bdf8] transition-colors"
        />

        <button
          type="submit"
          disabled={!defenseText.trim() || isSubmitting}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a2538] hover:bg-[#253550] border border-[#2a3a54] text-white text-xs font-mono font-bold transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Evaluating...' : 'Submit Defense'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-3 bg-[#2a141b] border border-[#521b27] rounded-lg text-xs font-mono text-[#f87171] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real backend AI evaluation response */}
      {aiFeedback && (
        <div className="mt-3 p-4 bg-[#0a1220] border border-[#16304c] rounded-lg space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#38bdf8] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Defense Evaluation</span>
            </div>
            {pointsAwarded !== null && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#34d399] bg-[#0f2b1d] border border-[#184e32] px-2 py-0.5 rounded">
                <Award className="w-3 h-3" />
                <span>+{pointsAwarded} XP Awarded</span>
              </span>
            )}
          </div>
          <p className="text-[#cbd5e1] leading-relaxed">
            {aiFeedback}
          </p>
        </div>
      )}
    </div>
  );
}
