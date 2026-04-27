"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

// Lucide icons
import { Trash2 } from "lucide-react";
import { useUIContext } from "@/lib/ui-context";

const SYSTEM_PROMPT = `You are Razinger's personal AI agent. You know everything about him:
- Name: Josef Razinger (goes by Razinger), final-year Software Engineering student at Kisii University, Nairobi
- Email: razingerjosef@gmail.com, GitHub: Razinger-Joe
- Expertise: Cybersecurity, Ethical Hacking, Kali Linux, AI/ML, DevOps, Automation (Selenium, Playwright, Jest)
- Projects: Kivuli Command Center (team leader, security system), EpiPredict (epidemic prediction AI), Netfluenz (AI creator marketplace), Cyber Guard (community threat response)
- Background: 6-month cybersecurity bootcamp at FabLab Winam (offense, networking, defense, GRC), HORIZON AI hackathon participant
Coding style: Security-first, modular, clean code. Favors Python, Linux tools, microservices, event-driven architecture.
Always give practical, specific advice relevant to Razinger's actual projects and goals. Be direct and technical.`;

const CONTEXT_TAGS = [
  "Josef Razinger",
  "Cybersecurity",
  "AI/ML",
  "Kali Linux",
  "Kivuli CMD",
];

interface Message {
  role: "user" | "ai";
  content: string;
}



const INITIAL_MSG: Message = {
  role: "ai",
  content:
    "Hey Razinger! I'm your personal AI agent — I know your stack, your projects, and your goals. Ask me anything about cybersecurity, AI, your projects like Kivuli or EpiPredict, or system development.",
};

export default function AgentChat() {
  const { injectedMessage, consumeInjectedMessage } = useUIContext();

  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages, loading]);

  const clearChat = () => {
    setMessages([INITIAL_MSG]);
  };

  const sendMessage = useCallback(
    async (msg: string) => {
      if (!msg.trim() || loading) return;

      const userMsg: Message = { role: "user", content: msg.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        // Build conversation history (exclude initial agent greeting if we want strict multi-turn, 
        // but including it is fine as it establishes persona)
        const apiMessages = newMessages
          .filter((m) => m.content !== INITIAL_MSG.content || m.role === "user")
          .map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.content,
          }));

        const currentApiKey = localStorage.getItem("gemini_api_key");

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(currentApiKey ? { "x-custom-api-key": currentApiKey } : {}),
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: apiMessages,
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
    },
    [loading, messages]
  );

  // Handle injected messages from Code Arch tab
  useEffect(() => {
    if (injectedMessage) {
      sendMessage(injectedMessage);
      consumeInjectedMessage();
    }
  }, [injectedMessage, consumeInjectedMessage, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden border border-line flex flex-col h-[520px]">
      {/* Context bar with Actions */}
      <div className="bg-neon/5 border-b border-line px-4 py-2.5 flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-neon tracking-wider">
            CONTEXT LOADED:
          </span>
          {CONTEXT_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-neon/10 border-neon/20 text-neon text-[10px] font-mono whitespace-nowrap"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-7 w-7 text-dim hover:text-danger hover:bg-danger/10"
            title="Clear Chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-5 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 items-start animate-fade-in ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center text-[10px] font-mono font-bold mt-1 ${
                  msg.role === "ai"
                    ? "bg-neon/15 border border-neon/30 text-neon"
                    : "bg-cyan/15 border border-cyan/30 text-cyan"
                }`}
              >
                {msg.role === "ai" ? "AI" : "RZ"}
              </div>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed border border-line overflow-hidden ${
                  msg.role === "ai"
                    ? "bg-white/[0.03] rounded-tl-sm text-foreground prose-invert prose-p:my-1 prose-pre:bg-deep prose-pre:border prose-pre:border-line prose-pre:p-3 prose-pre:rounded-md prose-code:text-neon prose-code:font-mono prose-code:text-[13px] prose-a:text-cyan hover:prose-a:text-neon"
                    : "bg-cyan/[0.08] rounded-tr-sm text-right text-foreground"
                }`}
              >
                {msg.role === "ai" ? (
                  <div className="whitespace-pre-wrap breakdown-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-[10px] font-mono font-bold bg-neon/15 border border-neon/30 text-neon mt-1">
                AI
              </div>
              <div className="px-4 py-4 rounded-xl rounded-tl-sm bg-white/[0.03] border border-line">
                <div className="flex gap-1 items-center">
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
          {/* Scroll Sentinel */}
          <div ref={scrollEndRef} className="h-1" />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex border-t border-line shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your projects, cybersec, code structure..."
          className="flex-1 border-0 rounded-none bg-deep px-4 py-4 text-sm focus-visible:ring-0 placeholder:text-dim h-auto"
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="rounded-none px-6 h-auto bg-neon text-black font-mono text-xs font-bold tracking-wider hover:bg-neon/85 disabled:opacity-40"
        >
          SEND
        </Button>
      </div>
    </div>
  );
}
