'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalysisState, AnalysisStatus } from '@/components/editor';
import { Play, Sparkles, Upload, FileCode, AlertCircle } from 'lucide-react';
import { ReviewService } from '@/services';

const CodeEditor = dynamic(
  () => import('@/components/editor/CodeEditor').then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[480px] bg-[#080d16] border border-[#162032] rounded-lg flex items-center justify-center font-mono text-xs text-[#64748b]">
        Loading Monaco Code Editor...
      </div>
    ),
  }
);

const defaultCodeSamples: Record<string, string> = {
  Python: `class TransformerBlock:
    def __init__(self, d_model=512, n_heads=8):
        self.d_model = d_model
        self.n_heads = n_heads
        
    def generate_tokens(self, prompt, max_tokens=100):
        # Attention calculation loop
        tokens = []
        for i in range(max_tokens):
            token = self._sample_next_token(prompt)
            tokens.append(token)
        return tokens
        
    def _sample_next_token(self, context):
        # Insecure random sampling
        import random
        return random.randint(0, 1000)
`,
  TypeScript: `export async function loginUser(req: any, res: any) {
  const { username, password } = req.body;
  // Raw direct database interpolation hazard
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  try {
    const result = await db.raw(query);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
`,
  JavaScript: `function processPayment(user, amount) {
  // Loose equality and unhandled promise
  if (amount == 0) {
    return false;
  }
  fetch('/api/pay', { method: 'POST', body: JSON.stringify({ user, amount }) });
  return true;
}
`,
  Java: `public class UserService {
    public User findUser(String username) throws Exception {
        String query = "SELECT * FROM users WHERE username = '" + username + "'";
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs.next() ? new User(rs.getString("username")) : null;
    }
}
`,
  Go: `package main

import (
    "database/sql"
    "fmt"
)

func GetUser(db *sql.DB, username string) error {
    query := fmt.Sprintf("SELECT id FROM users WHERE username = '%s'", username)
    _, _ = db.Query(query) // Unhandled error & SQL injection
    return nil
}
`,
  Rust: `pub fn parse_data(raw: &str) -> i32 {
    let parsed: i32 = raw.parse().unwrap(); // Direct unwrap trigger hazard
    parsed * 2
}
`,
  'C++': `#include <iostream>
#include <cstring>

void processBuffer(char* input) {
    char dest[32];
    strcpy(dest, input); // Unchecked buffer copy
    std::cout << dest << std::endl;
}
`,
  C: `#include <stdio.h>

void readUser() {
    char name[64];
    gets(name); // Dangerous gets usage
    printf(name); // Format string hazard
}
`,
  PHP: `<?php
function authenticate($conn) {
    $user = $_POST['username'];
    $pass = $_POST['password'];
    $sql = "SELECT * FROM users WHERE username = '$user' AND pass = '$pass'";
    return $conn->query($sql);
}
?>
`,
  SQL: `SELECT * FROM high_throughput_transactions 
WHERE customer_name LIKE '%corp%'
ORDER BY created_at DESC;
`,
};

const languages = [
  'Python',
  'TypeScript',
  'JavaScript',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C',
  'PHP',
  'SQL',
];

export default function NewReviewPage() {
  const router = useRouter();

  const [language, setLanguage] = useState('Python');
  const [fileName, setFileName] = useState('transformer.py');
  const [code, setCode] = useState<string>(defaultCodeSamples['Python']);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(defaultCodeSamples[newLang] || '');
    const extMap: Record<string, string> = {
      Python: 'py',
      TypeScript: 'ts',
      JavaScript: 'js',
      Java: 'java',
      Go: 'go',
      Rust: 'rs',
      'C++': 'cpp',
      C: 'c',
      PHP: 'php',
      SQL: 'sql',
    };
    setFileName(`example.${extMap[newLang] || 'txt'}`);
  };

  const handleStartAnalysis = async () => {
    if (!code || !code.trim()) {
      setErrorMessage('Please enter source code to review.');
      return;
    }

    setErrorMessage(null);
    setStatus('running');
    setCurrentStep(0);

    // Progress animation state timer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await ReviewService.submitReview({
        language: language.toLowerCase(),
        fileName,
        sourceCode: code,
      });

      clearInterval(stepInterval);

      if (result.success && result.data) {
        setCurrentStep(4);
        setStatus('completed');
        setTimeout(() => {
          router.push(`/review/${result.data?.id}`);
        }, 600);
      } else {
        setStatus('failed');
        setErrorMessage(result.message || 'Code review analysis failed.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setStatus('failed');
      setErrorMessage(err.message || 'An unexpected error occurred during review.');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header matching Stitch */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>New Code Review</span>
              <Sparkles className="w-6 h-6 text-[#38bdf8]" />
            </h1>
            <p className="text-xs font-mono text-[#64748b] mt-1">
              Submit source code for real-time AST, static anti-pattern, and AI multi-dimensional review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const sample = defaultCodeSamples[language] || '';
                setCode(sample);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0b101b] border border-[#162032] hover:border-[#253550] text-xs font-mono text-[#cbd5e1] transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Load Template</span>
            </button>

            <button
              onClick={handleStartAnalysis}
              disabled={status === 'running'}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#56b6f7] hover:bg-[#38bdf8] disabled:opacity-50 text-[#030712] font-mono font-bold text-xs transition-all shadow-md active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{status === 'running' ? 'Analyzing Code...' : 'Analyze Code'}</span>
            </button>
          </div>
        </div>

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="p-4 bg-[#2a141b] border border-[#521b27] rounded-xl text-xs font-mono text-[#f87171] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#94a3b8] hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Grid: Code Editor + Analysis State Machine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Toolbar: Language & Filename */}
            <div className="p-3.5 bg-[#0b101b] border border-[#162032] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-mono text-[#64748b]">Language:</span>
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

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-mono text-[#64748b]">File:</span>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. auth.service.ts"
                  className="bg-[#080d16] border border-[#172235] text-white text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="h-[520px] rounded-xl overflow-hidden border border-[#162032] shadow-xl">
              <CodeEditor
                value={code}
                onChange={(val) => setCode(val || '')}
                language={language.toLowerCase()}
              />
            </div>
          </div>

          {/* Right Column: Real-time Multi-step Analysis State (5 cols) */}
          <div className="lg:col-span-5">
            <AnalysisState status={status} currentStep={currentStep} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
