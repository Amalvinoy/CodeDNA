'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  BattleScoreWidget,
  BattleMetricBar,
  BattleEditorPanel,
  ChallengeAiCard,
} from '@/components/battle';
import { BattleService } from '@/services';
import { CodeBattleData } from '@/types';
import { Swords, Play, RefreshCw, FileCode, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] bg-[#080d16] border border-[#162032] rounded-lg flex items-center justify-center font-mono text-xs text-[#64748b]">
        Loading Monaco Code Editor...
      </div>
    ),
  }
);

const defaultBattleSamples: Record<string, string> = {
  TypeScript: `export async function getAccounts(db: any, userIds: string[]) {
  // Anti-pattern: N+1 database round-trips
  const accounts = [];
  for (const id of userIds) {
    const account = await db.query("SELECT * FROM accounts WHERE id = '" + id + "'");
    accounts.push(account);
  }
  return accounts;
}`,
  JavaScript: `function parseQuery(raw) {
  // Vulnerable regex exponential backtracking and eval execution
  const result = eval("(" + raw + ")");
  return result;
}`,
  Python: `import sqlite3

def fetch_records(cursor, user_input, cache=[]):
    # Mutable default argument + SQL injection
    cache.append(user_input)
    query = f"SELECT * FROM items WHERE owner = '{user_input}'"
    cursor.execute(query)
    return cursor.fetchall()
`,
  Go: `package main

import (
    "database/sql"
    "fmt"
)

func queryProfile(db *sql.DB, uid string) error {
    q := fmt.Sprintf("SELECT * FROM users WHERE id = '%s'", uid)
    _, err := db.Query(q)
    return err
}
`,
  Rust: `pub fn extract_count(raw: &str) -> i32 {
    let parsed: i32 = raw.parse().unwrap();
    parsed * 2
}
`,
  Java: `import java.sql.*;

public class UserService {
    public ResultSet findUser(Connection conn, String name) throws SQLException {
        Statement stmt = conn.createStatement();
        return stmt.executeQuery("SELECT * FROM users WHERE username = '" + name + "'");
    }
}
`,
  'C++': `#include <iostream>
#include <cstring>

void copyInput(char* src) {
    char dest[16];
    strcpy(dest, src);
    std::cout << dest << std::endl;
}
`,
  C: `#include <stdio.h>

void readBuffer() {
    char buffer[32];
    gets(buffer);
    printf(buffer);
}
`,
  PHP: `<?php
function getUser($conn, $id) {
    $res = $conn->query("SELECT * FROM users WHERE id = '$id'");
    return $res;
}
?>
`,
  SQL: `SELECT * FROM high_throughput_transactions
WHERE customer_name LIKE '%enterprise%'
ORDER BY created_at DESC;
`,
};

const languages = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'C',
  'PHP',
  'SQL',
];

const extMap: Record<string, string> = {
  TypeScript: 'ts',
  JavaScript: 'js',
  Python: 'py',
  Go: 'go',
  Rust: 'rs',
  Java: 'java',
  'C++': 'cpp',
  C: 'c',
  PHP: 'php',
  SQL: 'sql',
};

export default function CodeBattlePage() {
  const [battle, setBattle] = useState<CodeBattleData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Battle input fields
  const [language, setLanguage] = useState('TypeScript');
  const [fileName, setFileName] = useState('query_service.ts');
  const [sourceCode, setSourceCode] = useState(defaultBattleSamples['TypeScript']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBattle = () => {
    setIsRefreshing(true);
    BattleService.getCodeBattleData()
      .then((data) => {
        if (data) {
          setBattle(data);
        }
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchBattle();
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const ext = extMap[newLang] || 'txt';
    setFileName(`service.${ext}`);
    setSourceCode(defaultBattleSamples[newLang] || '');
  };

  const handleStartBattle = async () => {
    setErrorMessage(null);

    if (!sourceCode || !sourceCode.trim()) {
      setErrorMessage('Source code cannot be empty.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await BattleService.generateBattle({
        file: fileName.trim() || `service.${extMap[language] || 'txt'}`,
        language: language.toLowerCase(),
        originalCode: sourceCode.trim(),
      });
      setBattle(result);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate code battle.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Code Battle Arena</span>
              <Swords className="w-6 h-6 text-[#38bdf8]" />
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Submit source code to test against real-time AI optimization and defense challenge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {battle && (
              <BattleScoreWidget
                originalScore={battle.originalScore}
                optimizedScore={battle.optimizedScore}
                scoreDelta={battle.scoreDelta}
                winner={battle.winner}
              />
            )}

            <button
              onClick={fetchBattle}
              title="Refresh battle data"
              className={`p-2 rounded bg-[#0b101b] border border-[#162032] hover:border-[#253550] text-[#94a3b8] hover:text-white transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real Code Input Section: Battle Arena Input */}
        <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#162032] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                <span>Submit Code to Battle</span>
              </h2>
              <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
                Head-to-head evaluation evaluated across AST safety, historical memory, and developer DNA.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setSourceCode(defaultBattleSamples[language] || '')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080d16] border border-[#162032] hover:border-[#253550] text-[11px] font-mono text-[#cbd5e1] transition-colors"
              >
                <FileCode className="w-3 h-3 text-[#94a3b8]" />
                <span>Load Sample</span>
              </button>

              <button
                type="button"
                onClick={handleStartBattle}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] disabled:opacity-50 text-[#030712] font-mono font-bold text-xs transition-all shadow-md active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing Code...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Code Battle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#64748b] text-[11px]">Language:</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#080d16] border border-[#172235] text-[#38bdf8] text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-[#38bdf8]"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-[#64748b] text-[11px]">File Name:</span>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. query_service.ts"
                className="bg-[#080d16] border border-[#172235] text-white text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-[#38bdf8] w-full max-w-xs"
              />
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="h-[260px] rounded-lg overflow-hidden border border-[#162032]">
            <CodeEditor
              value={sourceCode}
              onChange={(val) => setSourceCode(val || '')}
              language={language.toLowerCase()}
              filename={fileName}
              minHeight="220px"
            />
          </div>

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="p-3 bg-[#2a141b] border border-[#521b27] rounded-lg text-xs font-mono text-[#f87171] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#f87171]" />
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartBattle}
                  className="px-2 py-0.5 rounded bg-[#38161f] border border-[#6b1e2e] text-white hover:bg-[#501c28] text-[11px]"
                >
                  Retry
                </button>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-[#94a3b8] hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic State: Empty vs Active Battle Arena */}
        {!battle ? (
          <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-10 text-center space-y-3 shadow-xl">
            <h2 className="text-base font-bold text-white tracking-tight">
              No active code battles available
            </h2>
            <p className="text-xs font-mono text-[#64748b] max-w-md mx-auto">
              Submit code above to run a head-to-head AI optimization battle. The AI refactors your code while identical AST scoring judges the winner.
            </p>
          </div>
        ) : (
          <>
            {/* Winner Explanation Banner */}
            <div className="p-4 bg-[#080d16] border border-[#172235] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-[#64748b] uppercase">Judged Winner:</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-mono font-bold ${
                      battle.winner === 'AI Optimization'
                        ? 'text-[#38bdf8] bg-[#0c2236] border-[#1b3d5e]'
                        : battle.winner === 'Original'
                        ? 'text-[#34d399] bg-[#0f2b1d] border-[#184e32]'
                        : 'text-[#cbd5e1] bg-[#162032] border-[#223049]'
                    }`}
                  >
                    {battle.winner || 'Evaluation Complete'}
                  </span>
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  {battle.winnerExplanation}
                </p>
              </div>

              {battle.scoreDelta !== undefined && (
                <div className="flex-shrink-0 text-right font-mono text-xs">
                  <span className="text-[#64748b]">Score Delta: </span>
                  <span
                    className={`font-bold ${
                      battle.scoreDelta > 0
                        ? 'text-[#38bdf8]'
                        : battle.scoreDelta < 0
                        ? 'text-[#f87171]'
                        : 'text-[#94a3b8]'
                    }`}
                  >
                    {battle.scoreDelta > 0 ? `+${battle.scoreDelta.toFixed(1)}` : battle.scoreDelta.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Side-by-Side Arena Layout matching Stitch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Left Column: Your Code */}
              <div className="lg:col-span-5">
                <BattleEditorPanel
                  type="original"
                  file={battle.file}
                  code={battle.originalCode}
                  tag={battle.complexityOriginal}
                  findingsCount={battle.originalFindings?.length}
                />
              </div>

              {/* Middle Column: Comparison Metrics */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <BattleMetricBar metrics={battle.metrics} />
              </div>

              {/* Right Column: AI Optimized */}
              <div className="lg:col-span-5">
                <BattleEditorPanel
                  type="optimized"
                  file={battle.file}
                  code={battle.optimizedCode}
                  tag={battle.complexityOptimized}
                  findingsCount={battle.optimizedFindings?.length}
                />
              </div>
            </div>

            {/* AI Optimization Changes & Summary */}
            {battle.changes && battle.changes.length > 0 && (
              <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                  <span>AI Refactoring Optimizations Applied</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {battle.changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#080d16] border border-[#172235] rounded-lg space-y-1 text-xs font-mono"
                    >
                      <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider">
                        {change.category}
                      </span>
                      <p className="text-[#94a3b8] leading-relaxed">
                        {change.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge the AI Section */}
            <div>
              <ChallengeAiCard />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
