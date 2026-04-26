"use client";

import Header from "@/components/header";
import AgentChat from "@/components/agent-chat";
import JsonPrompter from "@/components/json-prompter";
import TrendFeed from "@/components/trend-feed";
import CodeArch from "@/components/code-arch";
import Sidebar from "@/components/sidebar";
import { useUIContext } from "@/lib/ui-context";

export default function Home() {
  const {
    showAgent,
    showJson,
    showTrends,
    showArch,
    setShowAgent,
    setShowJson,
    setShowTrends,
    setShowArch,
  } = useUIContext();

  const handleAskArch = (question: string) => {
    // Ensure Agent pane is visible and inject message via context (could use a global state, but for now we just toggle)
    setShowAgent(true);
    // TODO: inject message handling (requires additional context) – placeholder
  };

  return (
    <div className="relative z-[1] max-w-[1100px] mx-auto px-5 py-6 w-full flex gap-4">
      <Sidebar />
      <div className="grid-dashboard flex-1 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {showAgent && (
          <AgentChat injectedMessage={null} onInjectedConsumed={() => {}} />
        )}
        {showJson && <JsonPrompter />
        }
        {showTrends && <TrendFeed />}
        {showArch && <CodeArch onAskArch={handleAskArch} />}
      </div>
    </div>
  );
}


