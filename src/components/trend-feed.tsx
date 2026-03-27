"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Trend {
  cat: "ai" | "sec" | "dev";
  title: string;
  desc: string;
  date: string;
}

const CAT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  ai: {
    bg: "bg-cyan/10 border-cyan/20",
    text: "text-cyan",
    label: "AI",
  },
  sec: {
    bg: "bg-danger/10 border-danger/20",
    text: "text-danger",
    label: "CYBERSEC",
  },
  dev: {
    bg: "bg-neon/10 border-neon/20",
    text: "text-neon",
    label: "DEVOPS",
  },
};

export default function TrendFeed() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Set<string>>(
    new Set(["ai", "sec", "dev"])
  );

  const loadTrends = useCallback(async () => {
    setLoading(true);
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
              content: `You are a tech intelligence feed. Return ONLY a valid JSON array (no markdown) of 6 current trends (2 AI, 2 cybersecurity, 2 DevOps/systems). Each item: { "cat": "ai"|"sec"|"dev", "title": "...", "desc": "2 sentence summary of the trend and why it matters for developers", "date": "March 2026" }. Focus on: AI agents, LLM security, zero-trust, container security, MLOps, platform engineering. Be specific and current.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "[]";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        setTrends(parsed);
      }
    } catch {
      setTrends([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTrends();
  }, [loadTrends]);

  const toggleFilter = (cat: string) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filtered = trends.filter((t) => filters.has(t.cat));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-mono text-neon tracking-wider neon-text">
          // LIVE INTEL FEED
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadTrends}
          disabled={loading}
          className="border-line text-dim font-mono text-[11px] hover:border-neon hover:text-neon"
        >
          {loading ? "⏳ LOADING..." : "↻ REFRESH"}
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(CAT_STYLES).map(([key, style]) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
              filters.has(key)
                ? `${style.bg} ${style.text} border-current`
                : "border-line text-dim bg-transparent hover:border-neon/30"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Trend list */}
      <div className="flex flex-col gap-2.5">
        {loading && trends.length === 0 && (
          <div className="text-dim text-xs font-mono py-3 animate-pulse">
            // Fetching latest intel...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-dim text-xs font-mono py-3">
            // No trends match filters.
          </div>
        )}
        {filtered.map((t, i) => {
          const style = CAT_STYLES[t.cat] || CAT_STYLES.dev;
          return (
            <div
              key={i}
              className="glass border border-line rounded-xl px-4 py-3.5 transition-all glow-border animate-fade-in"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
                <span className="text-[10px] text-dim font-mono">
                  {t.date}
                </span>
              </div>
              <div className="text-sm font-bold mb-1">{t.title}</div>
              <div className="text-xs text-dim leading-relaxed">{t.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
