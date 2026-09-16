'use client';

import React from 'react';
import { CodeIssue } from '@/types';

interface IssueExplorerProps {
  issues: CodeIssue[];
  selectedIssueId: string;
  onSelectIssue: (id: string) => void;
}

export function IssueExplorer({
  issues,
  selectedIssueId,
  onSelectIssue,
}: IssueExplorerProps) {
  // Group issues by backend categories
  const categories: Array<{ id: string; label: string; dotColor: string }> = [
    { id: 'security', label: 'SECURITY', dotColor: 'bg-[#f87171]' },
    { id: 'correctness', label: 'CORRECTNESS', dotColor: 'bg-[#f43f5e]' },
    { id: 'performance', label: 'PERFORMANCE', dotColor: 'bg-[#fbbf24]' },
    { id: 'architecture', label: 'ARCHITECTURE', dotColor: 'bg-[#a855f7]' },
    { id: 'maintainability', label: 'MAINTAINABILITY', dotColor: 'bg-[#38bdf8]' },
    { id: 'style', label: 'STYLE', dotColor: 'bg-[#94a3b8]' },
  ];

  return (
    <div className="bg-[#0b101b] border border-[#162032] rounded-lg p-5 flex flex-col h-full">
      <h3 className="text-sm font-bold text-white tracking-tight mb-4">
        Issue Explorer
      </h3>

      <div className="space-y-5 flex-1 overflow-y-auto">
        {categories.map((cat) => {
          const categoryIssues = issues.filter(
            (i) => i.category.toLowerCase() === cat.id
          );
          if (categoryIssues.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-2">
              {/* Category Heading with Dot Indicator */}
              <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-[#64748b] font-semibold">
                <span>
                  {cat.label} ({categoryIssues.length})
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`} />
              </div>

              {/* Issue Items */}
              <div className="space-y-1.5">
                {categoryIssues.map((issue) => {
                  const isSelected = issue.id === selectedIssueId;

                  return (
                    <button
                      key={issue.id}
                      onClick={() => onSelectIssue(issue.id)}
                      className={`w-full text-left p-2.5 rounded transition-all border ${
                        isSelected
                          ? 'bg-[#102438] border-[#38bdf8] text-white shadow-sm'
                          : 'bg-[#080d16] border-[#172033] text-[#94a3b8] hover:text-white hover:border-[#1e2e4a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {issue.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#64748b]">
                          Line {issue.line}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#64748b] mt-0.5 truncate">
                        {issue.file}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
