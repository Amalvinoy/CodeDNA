'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  RiskScoreCard,
  PrimaryFactorsCard,
  DiagnosticReasoningCard,
} from '@/components/risk';
import { RiskService } from '@/services';
import { PredictiveRiskData } from '@/types';
import { RefreshCw, Play, FileCode, AlertCircle, Sparkles } from 'lucide-react';

const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] bg-[#080d16] border border-[#162032] rounded-lg flex items-center justify-center font-mono text-xs text-[#64748b]">
        Loading Monaco Code Editor...
      </div>
    ),
  }
);

const defaultCodeSamples: Record<string, string> = {
  TypeScript: `export async function getUserTransactions(userId: string, filter: any) {
  // Vulnerable SQL concatenation
  const query = \`SELECT * FROM transactions WHERE user_id = '\${userId}' AND status = '\${filter.status}'\`;
  const result = await db.query(query);
  return result.rows;
}`,
  JavaScript: `function executeCommand(userInput) {
  const { exec } = require('child_process');
  // Insecure command execution
  exec('ping -c 1 ' + userInput, (err, stdout) => {
    console.log(stdout);
  });
}`,
  Python: `import sqlite3

def find_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # SQL injection vulnerability
    query = f"SELECT * FROM accounts WHERE name = '{username}'"
    cursor.execute(query)
    return cursor.fetchall()
`,
  Go: `package main

import (
    "database/sql"
    "fmt"
)

func queryAccount(db *sql.DB, accountId string) error {
    query := fmt.Sprintf("SELECT balance FROM accounts WHERE id = '%s'", accountId)
    _, err := db.Query(query)
    return err
}
`,
  Rust: `pub fn parse_input(raw: &str) -> i32 {
    // Direct unwrap hazard
    let val: i32 = raw.parse().unwrap();
    val * 2
}
`,
  Java: `import java.sql.*;

public class AccountManager {
    public ResultSet getAccount(Connection conn, String id) throws SQLException {
        Statement stmt = conn.createStatement();
        return stmt.executeQuery("SELECT * FROM accounts WHERE id = '" + id + "'");
    }
}
`,
  'C++': `#include <iostream>
#include <cstring>

void copyBuffer(char* src) {
    char dest[32];
    strcpy(dest, src); // Buffer overflow vulnerability
    std::cout << dest << std::endl;
}
`,
  C: `#include <stdio.h>

void readInput() {
    char buffer[64];
    gets(buffer); // Deprecated unsafe function
    printf(buffer); // Format string vulnerability
}
`,
  PHP: `<?php
function getOrder($conn, $orderId) {
    $sql = "SELECT * FROM orders WHERE id = '$orderId'";
    return $conn->query($sql);
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

export default function RiskForecastPage() {
  const [riskData, setRiskData] = useState<PredictiveRiskData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Scan input fields
  const [language, setLanguage] = useState('TypeScript');
  const [fileName, setFileName] = useState('query_service.ts');
  const [sourceCode, setSourceCode] = useState(defaultCodeSamples['TypeScript']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRisk = () => {
    setIsRefreshing(true);
    RiskService.getPredictiveRisk()
      .then((data) => {
        setRiskData(data);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchRisk();
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const ext = extMap[newLang] || 'txt';
    setFileName(`service.${ext}`);
    setSourceCode(defaultCodeSamples[newLang] || '');
  };

  const handleForecastSubmit = async () => {
    setErrorMessage(null);

    if (!sourceCode || !sourceCode.trim()) {
      setErrorMessage('Source code cannot be empty.');
      return;
    }

    setIsScanning(true);
    try {
      const forecast = await RiskService.forecastRisk({
        language: language.toLowerCase(),
        fileName: fileName.trim() || `code.${extMap[language] || 'txt'}`,
        sourceCode: sourceCode.trim(),
      });
      setRiskData(forecast);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to compute risk forecast.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[#64748b] tracking-wider uppercase">
              REPOSITORY:{' '}
              <span className="text-[#cbd5e1] font-semibold">
                {riskData?.repository || 'WORKSPACE'}
              </span>{' '}
              {riskData?.prNumber && (
                <>
                  &gt;{' '}
                  <span className="text-[#38bdf8] font-bold">
                    {riskData.prNumber}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Predictive Analysis
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748b]">
            <span>Last scanned {riskData?.lastScanned || 'Never'}</span>
            <button
              onClick={fetchRisk}
              title="Refresh forecast from database"
              className={`p-1 rounded hover:bg-[#101827] text-[#94a3b8] hover:text-white transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real Code Input Section: Compact Risk Scan Workflow */}
        <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#162032] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                <span>Predictive Risk Scanner</span>
              </h2>
              <p className="text-[11px] font-mono text-[#64748b] mt-0.5">
                Submit source code to calculate deterministic AST risk, historical rule compliance, and DNA correlation.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setSourceCode(defaultCodeSamples[language] || '')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080d16] border border-[#162032] hover:border-[#253550] text-[11px] font-mono text-[#cbd5e1] transition-colors"
              >
                <FileCode className="w-3 h-3 text-[#94a3b8]" />
                <span>Load Sample</span>
              </button>

              <button
                type="button"
                onClick={handleForecastSubmit}
                disabled={isScanning}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#0284c7] disabled:opacity-50 text-[#030712] font-mono font-bold text-xs transition-all shadow-md active:scale-[0.98]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Risk...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Risk Forecast</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Controls: Language & File Name */}
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
                placeholder="e.g. auth_controller.ts"
                className="bg-[#080d16] border border-[#172235] text-white text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-[#38bdf8] w-full max-w-xs"
              />
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="h-[280px] rounded-lg overflow-hidden border border-[#162032]">
            <CodeEditor
              value={sourceCode}
              onChange={(val) => setSourceCode(val || '')}
              language={language.toLowerCase()}
              filename={fileName}
              minHeight="240px"
            />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-[#2a141b] border border-[#521b27] rounded-lg text-xs font-mono text-[#f87171] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#f87171]" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-[#94a3b8] hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Prediction Results or Empty State */}
        {!riskData ? (
          <div className="bg-[#0b101b] border border-[#162032] rounded-xl p-10 text-center space-y-3 shadow-xl">
            <h2 className="text-base font-bold text-white tracking-tight">
              No risk forecast available yet.
            </h2>
            <p className="text-xs font-mono text-[#64748b] max-w-md mx-auto">
              Submit code above to run real-time predictive risk analysis powered by AST inspection, historical engineering memory, and developer Code DNA.
            </p>
          </div>
        ) : (
          <>
            {/* Top 2 Cards: Score + Primary Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
                <RiskScoreCard
                  category={riskData.overallCategory || 'Performance Risk'}
                  riskPercent={riskData.riskPercent}
                  riskLevel={riskData.riskLevel || 'LOW'}
                  recommendation={
                    riskData.recommendation || 'Review analysis complete.'
                  }
                />
              </div>

              <div className="lg:col-span-7">
                <PrimaryFactorsCard
                  confidencePercent={riskData.confidencePercent}
                  factors={riskData.primaryFactors}
                />
              </div>
            </div>

            {/* Diagnostic Reasoning & Historical Evidence */}
            {riskData.diagnosticReasoning && (
              <div>
                <DiagnosticReasoningCard
                  reasoning={riskData.diagnosticReasoning}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
