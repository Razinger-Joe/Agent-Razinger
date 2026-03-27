"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const SYSTEM_PROMPT = `You are Razinger's personal AI agent. You know everything about him:
- Name: Josef Razinger (goes by Razinger), final-year Software Engineering student at Kisii University, Nairobi
- Email: razingerjosef@gmail.com, GitHub: Razinger-Joe
- Expertise: Cybersecurity, Ethical Hacking, Kali Linux, AI/ML, DevOps, Automation (Selenium, Playwright, Jest)
- Projects: Kivuli Command Center (team leader, security system), EpiPredict (epidemic prediction AI), Netfluenz (AI creator marketplace), Cyber Guard (community threat response)
- Background: 6-month cybersecurity bootcamp at FabLab Winam (offense, networking, defense, GRC), HORIZON AI hackathon participant
- Applied to Nairobi DevOps Community writing team
- Completed Malware Analysis Datasets group project (Head of Presentation)
Coding style: Security-first, modular, clean code. Favors Python, Linux tools, microservices, event-driven architecture.
Always give practical, specific advice relevant to Razinger's actual projects and goals. Be direct and technical.`;

const CONTEXT_TAGS = [
  "Josef Razinger",
  "Kisii Uni · SE Final Year",
  "Cybersecurity",
  "AI/ML",
  "Kali Linux",
  "Kivuli CMD",
];

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AgentChatProps {
  injectedMessage?: string | null;
  onInjectedConsumed?: () => void;
}

export default function AgentChat({ injectedMessage, onInjectedConsumed }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hey Razinger! I'm your personal AI agent — I know your stack, your projects, and your goals. Ask me anything about cybersecurity, AI, your projects like Kivuli, EpiPredict, or Netfluenz, or system development. Let's build.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = useCallback(async (msg: string) => {
    if (!msg.trim() || loading) return;

    const userMsg: Message = { role: "user", content: msg.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: msg.trim() }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "No response.";
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Connection error. Check your API setup." },
      ]);
    }
    setLoading(false);
  }, [loading]);

  // Handle injected messages from Code Arch tab
  useEffect(() => {
    if (injectedMessage) {
      sendMessage(injectedMessage);
      onInjectedConsumed?.();
    }
  }, [injectedMessage, onInjectedConsumed, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden border border-line">
      {/* Context bar */}
      <div className="bg-neon/5 border-b border-line px-4 py-2.5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-neon tracking-wider">
          CONTEXT LOADED:
        </span>
        {CONTEXT_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="bg-neon/10 border-neon/20 text-neon text-[10px] font-mono"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="h-[420px]" ref={scrollRef}>
        <div className="p-5 flex flex-col gap-3.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 items-start animate-fade-in ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                  msg.role === "ai"
                    ? "bg-neon/15 border border-neon/30 text-neon"
                    : "bg-cyan/15 border border-cyan/30 text-cyan"
                }`}
              >
                {msg.role === "ai" ? "AI" : "RZ"}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed border border-line ${
                  msg.role === "ai"
                    ? "bg-white/[0.03] rounded-tl-sm"
                    : "bg-cyan/[0.08] rounded-tr-sm text-right"
                }`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 items-start animate-fade-in">
              <div className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono font-bold bg-neon/15 border border-neon/30 text-neon shrink-0">
                AI
              </div>
              <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-white/[0.03] border border-line">
                <div className="flex gap-1 items-center py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon animate-typing-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-neon animate-typing-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-neon animate-typing-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex border-t border-line">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your projects, cybersec, code structure..."
          className="flex-1 border-0 rounded-none bg-transparent px-4 py-3.5 text-sm focus-visible:ring-0 placeholder:text-dim"
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="rounded-none px-5 bg-neon text-black font-mono text-xs font-bold tracking-wider hover:bg-neon/85 disabled:opacity-40"
        >
          SEND
        </Button>
      </div>
    </div>
  );
}
