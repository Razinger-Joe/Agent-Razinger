"use client";

export default function Header() {
  return (
    <header className="glass-strong flex items-center justify-between px-6 py-4 rounded-xl mb-6">
      <div className="font-mono text-sm tracking-widest text-neon neon-text">
        RAZINGER<span className="text-dim">//</span>CMD
      </div>
      <div className="flex items-center gap-2 text-xs text-dim font-mono">
        <div className="w-2 h-2 rounded-full bg-neon animate-pulse-dot" />
        SYSTEM ONLINE
      </div>
    </header>
  );
}
