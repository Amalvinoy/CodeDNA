import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070a0f] text-[#f1f5f9] flex flex-col items-center justify-center gap-3 font-mono text-xs">
      <Loader2 className="w-8 h-8 animate-spin text-[#38bdf8]" />
      <span className="text-[#64748b]">Loading Code DNA...</span>
    </div>
  );
}
