"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const TEMPLATES: Record<string, { system: string; user: string }> = {
  pentest: {
    system:
      "You are an expert penetration tester. Provide detailed, ethical security assessments following OWASP and PTES methodologies.",
    user: "Perform a penetration test assessment on the following target: [describe scope, IP range, or app]",
  },
  malware: {
    system:
      "You are a malware analyst specializing in static and dynamic analysis. Use industry-standard tools and safe analysis procedures.",
    user: "Analyze this malware sample and provide: behavior summary, IOCs, MITRE ATT&CK mapping, and remediation steps.",
  },
  ai_agent: {
    system:
      "You are a helpful AI agent with access to tools. Always reason step-by-step before acting.",
    user: "Complete the following task using available tools: [describe the task and available tools]",
  },
  code_review: {
    system:
      "You are a senior security-focused software engineer. Review code for bugs, security vulnerabilities, and best practice violations.",
    user: "Review this code and provide: security issues (CVSS scored), code quality issues, and specific fixes.\n\n```\n[paste code here]\n```",
  },
  api_design: {
    system:
      "You are an API architect specializing in RESTful and secure API design following OpenAPI 3.0 standards.",
    user: "Design a secure REST API for: [describe your system]. Include endpoints, auth, rate limiting, and error handling.",
  },
  devops: {
    system:
      "You are a DevOps engineer expert in CI/CD, Docker, Kubernetes, and security scanning integration.",
    user: "Create a CI/CD pipeline for: [describe your project, tech stack, and deployment target]",
  },
};

const MODELS = [
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
  "gpt-4o",
  "gemini-2.0-flash",
];

const selectCls =
  "w-full bg-[#080c10] border border-[#1c2a3a] text-[#e2e8f0] px-3 py-2 rounded-lg font-mono text-xs outline-none focus:border-[#00f5a0] transition-colors cursor-pointer";

export default function JsonPrompter() {
  const [model, setModel] = useState(MODELS[0]);
  const [taskType, setTaskType] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [maxTokens, setMaxTokens] = useState("1000");
  const [jsonOutput, setJsonOutput] = useState(
    "// Your structured prompt JSON will appear here..."
  );
  const [enhancing, setEnhancing] = useState(false);

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTaskType(value);
    if (TEMPLATES[value]) {
      setSystemPrompt(TEMPLATES[value].system);
      setUserMessage(TEMPLATES[value].user);
    }
  };

  const buildJSON = () => {
    const obj = {
      model,
      max_tokens: parseInt(maxTokens) || 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    };
    setJsonOutput(JSON.stringify(obj, null, 2));
  };

  const enhancePrompt = async () => {
    if (!systemPrompt && !userMessage) {
      alert("Fill in at least one field first.");
      return;
    }
    setEnhancing(true);
    setJsonOutput("// Enhancing prompt with AI...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a prompt engineering expert. Improve this system prompt and user message to be more precise, effective, and structured for AI agents. Return ONLY valid JSON with keys: "system" and "user".\n\nCurrent system: ${systemPrompt}\nCurrent user: ${userMessage}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.system) setSystemPrompt(parsed.system);
      if (parsed.user) setUserMessage(parsed.user);
      // rebuild after state updates settle
      setTimeout(() => {
        const obj = {
          model,
          max_tokens: parseInt(maxTokens) || 1000,
          system: parsed.system || systemPrompt,
          messages: [{ role: "user", content: parsed.user || userMessage }],
        };
        setJsonOutput(JSON.stringify(obj, null, 2));
      }, 50);
    } catch {
      setJsonOutput("// Error enhancing prompt. Try again.");
    }
    setEnhancing(false);
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      alert("JSON copied!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = jsonOutput;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("JSON copied!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Builder */}
      <Card className="glass border-line">
        <CardHeader className="border-b border-line px-4 py-3">
          <CardTitle className="text-xs font-mono text-neon tracking-widest uppercase">
            ⚙ Prompt Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-dim font-mono mb-1.5">MODEL</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={selectCls}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-dim font-mono mb-1.5">TASK TYPE</label>
            <select value={taskType} onChange={handleTaskChange} className={selectCls}>
              <option value="">-- Select --</option>
              <option value="pentest">Penetration Testing</option>
              <option value="malware">Malware Analysis</option>
              <option value="ai_agent">AI Agent System Prompt</option>
              <option value="code_review">Code Review</option>
              <option value="api_design">API Design</option>
              <option value="devops">DevOps Pipeline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-dim font-mono mb-1.5">SYSTEM PROMPT</label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are an expert in..."
              className="bg-deep border-line font-mono text-xs min-h-[80px] resize-y focus:border-neon"
            />
          </div>

          <div>
            <label className="block text-xs text-dim font-mono mb-1.5">USER MESSAGE</label>
            <Textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Describe what you want..."
              className="bg-deep border-line font-mono text-xs min-h-[80px] resize-y focus:border-neon"
            />
          </div>

          <div>
            <label className="block text-xs text-dim font-mono mb-1.5">MAX TOKENS</label>
            <Input
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              className="bg-deep border-line font-mono text-xs focus:border-neon"
            />
          </div>

          <Button
            onClick={buildJSON}
            className="w-full bg-neon text-black font-mono text-xs font-bold tracking-wider hover:bg-neon/85"
          >
            GENERATE JSON
          </Button>
          <Button
            onClick={enhancePrompt}
            disabled={enhancing}
            variant="outline"
            className="w-full border-neon text-neon font-mono text-xs font-bold tracking-wider hover:bg-neon/10 disabled:opacity-40"
          >
            {enhancing ? "ENHANCING..." : "✦ AI ENHANCE PROMPT"}
          </Button>
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="glass border-line">
        <CardHeader className="border-b border-line px-4 py-3">
          <CardTitle className="text-xs font-mono text-neon tracking-widest uppercase">
            📋 Output JSON
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <pre className="bg-deep border border-line rounded-lg p-4 font-mono text-xs text-[#7ee787] overflow-auto whitespace-pre-wrap min-h-[200px] max-h-[400px]">
            {jsonOutput}
          </pre>
          <Button
            onClick={copyJSON}
            variant="outline"
            className="w-full mt-3 border-neon text-neon font-mono text-xs font-bold tracking-wider hover:bg-neon/10"
          >
            COPY JSON
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
