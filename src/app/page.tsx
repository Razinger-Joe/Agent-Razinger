"use client";

import Header from "@/components/header";
import AgentChat from "@/components/agent-chat";
import JsonPrompter from "@/components/json-prompter";
import TrendFeed from "@/components/trend-feed";
import CodeArch from "@/components/code-arch";
import Sidebar from "@/components/sidebar";
import SettingsModal from "@/components/settings-modal";
import { useUIContext } from "@/lib/ui-context";

export default function Home() {
  const {
    showAgent,
    showJson,
    showTrends,
    showArch,
    setShowAgent,
  } = useUIContext();

  // Count visible panes for dynamic grid
  const visibleCount = [showAgent, showJson, showTrends, showArch].filter(Boolean).length;
  const gridCols = visibleCount <= 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2";

  return (
    <div className="relative z-[1] max-w-[1440px] mx-auto px-4 sm:px-6 py-5 w-full flex flex-col min-h-screen">
      <Header />
      <SettingsModal />
      <div className="flex gap-4 flex-1">
        <Sidebar />
        <main className={`grid-dashboard flex-1 grid ${gridCols} gap-4 auto-rows-min`}>
          {showAgent && (
            <AgentChat />
          )}
          {showJson && <JsonPrompter />}
          {showTrends && (
            <div className="glass rounded-xl border border-line p-5">
              <TrendFeed />
            </div>
          )}
          {showArch && (
            <div className="glass rounded-xl border border-line p-5">
              <CodeArch />
            </div>
          )}
          {visibleCount === 0 && (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-dim font-mono text-sm mb-2">// NO PANES ACTIVE</p>
                <p className="text-dim/60 font-mono text-xs">Toggle panes from the sidebar to get started.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
