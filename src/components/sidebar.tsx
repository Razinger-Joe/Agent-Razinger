"use client";

import { useUIContext } from "@/lib/ui-context";

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

  const toggle = (setter: (v: boolean) => void, current: boolean) => {
    setter(!current);
  };

  return (
    <aside className="hidden lg:block w-48 bg-deep border-line rounded-xl p-4 glass">
      <h3 className="text-xs font-mono text-neon mb-3 uppercase">Navigation</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => toggle(setShowAgent, showAgent)}
            className={`w-full text-left text-xs font-mono px-2 py-1 rounded ${showAgent ? "bg-neon text-black" : "bg-deep text-dim"}`}
          >
            🤖 AI Agent {showAgent ? "✓" : ""}
          </button>
        </li>
        <li>
          <button
            onClick={() => toggle(setShowJson, showJson)}
            className={`w-full text-left text-xs font-mono px-2 py-1 rounded ${showJson ? "bg-neon text-black" : "bg-deep text-dim"}`}
          >
            ⚙ JSON Prompter {showJson ? "✓" : ""}
          </button>
        </li>
        <li>
          <button
            onClick={() => toggle(setShowTrends, showTrends)}
            className={`w-full text-left text-xs font-mono px-2 py-1 rounded ${showTrends ? "bg-neon text-black" : "bg-deep text-dim"}`}
          >
            📡 Trends {showTrends ? "✓" : ""}
          </button>
        </li>
        <li>
          <button
            onClick={() => toggle(setShowArch, showArch)}
            className={`w-full text-left text-xs font-mono px-2 py-1 rounded ${showArch ? "bg-neon text-black" : "bg-deep text-dim"}`}
          >
            🏗 Code Arch {showArch ? "✓" : ""}
          </button>
        </li>
      </ul>
    </aside>
  );
}
