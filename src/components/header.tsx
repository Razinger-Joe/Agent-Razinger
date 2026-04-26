"use client";

import { ExternalLink, Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="glass-strong flex items-center justify-between px-5 sm:px-6 py-3.5 rounded-xl mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-neon" />
        </div>
        <div>
          <div className="font-mono text-sm tracking-widest text-neon neon-text leading-tight">
            RAZINGER<span className="text-dim">//</span>CMD
          </div>
          <div className="text-[9px] font-mono text-dim tracking-wider">
            PERSONAL AI COMMAND CENTER
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/Razinger-Joe/Agent-Razinger"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim hover:text-neon transition-colors"
          aria-label="GitHub Repository"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <div className="flex items-center gap-2 text-xs text-dim font-mono">
          <div className="w-2 h-2 rounded-full bg-neon animate-pulse-dot" />
          <span className="hidden sm:inline">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
