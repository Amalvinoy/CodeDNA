'use client';

import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (val: string | undefined) => void;
  language?: string;
  filename?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'python',
  filename = 'model_inference.py',
  readOnly = false,
  minHeight = '480px',
}: CodeEditorProps) {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Define custom dark theme matching Stitch
    monaco.editor.defineTheme('codeDnaDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f59e0b' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: '38bdf8' },
        { token: 'type', foreground: '67e8f9' },
        { token: 'function', foreground: '60a5fa' },
      ],
      colors: {
        'editor.background': '#080d16',
        'editor.foreground': '#e2e8f0',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editor.selectionBackground': '#1e3a5f',
        'editor.inactiveSelectionBackground': '#13253b',
        'editorCursor.foreground': '#38bdf8',
        'editorGutter.background': '#080d16',
      },
    });
    monaco.editor.setTheme('codeDnaDark');
  };

  return (
    <div className="flex flex-col h-full bg-[#080d16] border border-[#162032] rounded-lg overflow-hidden">
      {/* Editor Tab Bar matching Stitch */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b111e] border-b border-[#162032]">
        {/* Mac OS Window Dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/60" />
        </div>

        {/* Tab Item */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#080d16] border-t border-x border-[#172235] rounded-t text-xs font-mono text-[#cbd5e1]">
          <span className="text-[#38bdf8] font-bold">{'{ }'}</span>
          <span>{filename}</span>
          <span className="text-[#64748b] hover:text-white cursor-pointer ml-1">×</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Monaco Container */}
      <div className="flex-1 w-full relative" style={{ minHeight }}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
          }}
        />
      </div>
    </div>
  );
}
