"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import AgentChat from "@/components/agent-chat";
import JsonPrompter from "@/components/json-prompter";
import TrendFeed from "@/components/trend-feed";
import CodeArch from "@/components/code-arch";

export default function Home() {
  const [activeTab, setActiveTab] = useState("agent");
  const [injectedMessage, setInjectedMessage] = useState<string | null>(null);

  const handleAskArch = useCallback((question: string) => {
    setInjectedMessage(question);
    setActiveTab("agent");
  }, []);

  const handleInjectedConsumed = useCallback(() => {
    setInjectedMessage(null);
  }, []);

  return (
    <div className="relative z-[1] max-w-[1100px] mx-auto px-5 py-6 w-full">
      <Header />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 bg-surface border border-line rounded-xl p-1 mb-5 h-auto">
          <TabsTrigger
            value="agent"
            className="font-bold text-xs tracking-wider uppercase rounded-lg py-2.5 data-[state=active]:bg-neon data-[state=active]:text-black data-[state=active]:shadow-none text-dim hover:text-foreground hover:bg-line/50 transition-all cursor-pointer"
          >
            🤖 AI Agent
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="font-bold text-xs tracking-wider uppercase rounded-lg py-2.5 data-[state=active]:bg-neon data-[state=active]:text-black data-[state=active]:shadow-none text-dim hover:text-foreground hover:bg-line/50 transition-all cursor-pointer"
          >
            ⚙ JSON Prompter
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="font-bold text-xs tracking-wider uppercase rounded-lg py-2.5 data-[state=active]:bg-neon data-[state=active]:text-black data-[state=active]:shadow-none text-dim hover:text-foreground hover:bg-line/50 transition-all cursor-pointer"
          >
            📡 Trends
          </TabsTrigger>
          <TabsTrigger
            value="arch"
            className="font-bold text-xs tracking-wider uppercase rounded-lg py-2.5 data-[state=active]:bg-neon data-[state=active]:text-black data-[state=active]:shadow-none text-dim hover:text-foreground hover:bg-line/50 transition-all cursor-pointer"
          >
            🏗 Code Arch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent" className="mt-0">
          <AgentChat
            injectedMessage={injectedMessage}
            onInjectedConsumed={handleInjectedConsumed}
          />
        </TabsContent>

        <TabsContent value="json" className="mt-0">
          <JsonPrompter />
        </TabsContent>

        <TabsContent value="trends" className="mt-0">
          <TrendFeed />
        </TabsContent>

        <TabsContent value="arch" className="mt-0">
          <CodeArch onAskArch={handleAskArch} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
