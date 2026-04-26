"use client";

import { useState } from "react";
import { useUIContext } from "@/lib/ui-context";
import { Bot, Braces, Radio, LayoutGrid, Menu, X } from "lucide-react";

const PANES = [
  { key: "agent", icon: Bot, label: "AI Agent" },
  { key: "json", icon: Braces, label: "JSON Prompter" },
  { key: "trends", icon: Radio, label: "Intel Feed" },
  { key: "arch", icon: LayoutGrid, label: "Code Arch" },
] as const;

type PaneKey = (typeof PANES)[number]["key"];

export default function Sidebar() {
  const {
    showAgent,
    setShowAgent,
    showJson,
    setShowJson,
    showTrends,
    setShowTrends,
    showArch,
    setShowArch,
  } = useUIContext();

  const [mobileOpen, setMobileOpen] = useState(false);

  const stateMap: Record<PaneKey, boolean> = {
    agent: showAgent,
    json: showJson,
    trends: showTrends,
    arch: showArch,
  };

  const setterMap: Record<PaneKey, (v: boolean) => void> = {
    agent: setShowAgent,
    json: setShowJson,
    trends: setShowTrends,
    arch: setShowArch,
  };

  const toggle = (key: PaneKey) => {
    setterMap[key](!stateMap[key]);
  };

  const activeCount = Object.values(stateMap).filter(Boolean).length;

  const sidebarContent = (
    <>
      <div className="mb-5">
        <h3 className="text-[10px] font-mono text-dim tracking-[0.2em] uppercase mb-1">
          Panels
        </h3>
        <div className="text-[10px] font-mono text-neon/60">
          {activeCount}/4 active
        </div>
      </div>

      <ul className="space-y-1.5">
        {PANES.map(({ key, icon: Icon, label }) => {
          const active = stateMap[key];
          return (
            <li key={key}>
              <button
                onClick={() => toggle(key)}
                className={`sidebar-toggle w-full flex items-center gap-2.5 text-xs font-mono px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-neon/10 text-neon border border-neon/20 shadow-[0_0_12px_rgba(0,245,160,0.08)]"
                    : "text-dim hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-dot" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-6">
        <div className="border-t border-line pt-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-dot" />
            SYS ONLINE
          </div>
          <div className="text-[9px] font-mono text-dim/50 mt-1">
            v0.3.0 · Gemini 2.5
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass p-2.5 rounded-lg border border-line text-neon hover:bg-neon/10 transition-colors"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-44 shrink-0 glass rounded-xl border border-line p-4 flex-col sticky top-5 self-start h-fit max-h-[calc(100vh-60px)]">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-45 w-56 h-full glass-strong border-r border-line p-5 pt-16 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
