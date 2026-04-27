"use client";

import { useState, useEffect } from "react";
import { useUIContext } from "@/lib/ui-context";
import { X, Key, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsModal() {
  const { showSettings, setShowSettings } = useUIContext();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (showSettings) {
      const stored = localStorage.getItem("gemini_api_key") || "";
      setApiKey(stored);
      setSaved(false);
    }
  }, [showSettings]);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setSaved(true);
    setTimeout(() => {
      setShowSettings(false);
      setSaved(false);
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setSaved(false);
  };

  if (!showSettings) return null;

  const hasKey = apiKey.length > 0;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={() => setShowSettings(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="glass-strong rounded-2xl border border-neon/15 shadow-[0_0_60px_rgba(0,245,160,0.08)] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-neon" />
              </div>
              <div>
                <h2 className="text-sm font-mono text-foreground font-bold tracking-wide">
                  SETTINGS
                </h2>
                <p className="text-[10px] font-mono text-dim">
                  API configuration & preferences
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-dim hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* API Key Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-mono text-dim tracking-wider uppercase">
                  Google Gemini API Key
                </label>
                {hasKey && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-neon/70">
                    <CheckCircle2 className="w-3 h-3" />
                    configured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-deep border border-line rounded-lg px-3 py-2.5 text-xs font-mono text-foreground placeholder:text-dim/50 outline-none focus:border-neon/40 transition-colors"
                />
              </div>
              <p className="text-[10px] font-mono text-dim/50 mt-2 leading-relaxed">
                Your key is stored in your browser&apos;s localStorage only. It never leaves your device or touches any server.
              </p>
            </div>

            {/* Status Indicator */}
            <div className="glass rounded-xl border border-line p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {hasKey ? (
                    <CheckCircle2 className="w-4 h-4 text-neon" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-danger" />
                  )}
                  <div>
                    <div className="text-xs font-mono text-foreground">
                      {hasKey ? "API Key Active" : "No API Key"}
                    </div>
                    <div className="text-[10px] font-mono text-dim">
                      {hasKey
                        ? `Key: ${apiKey.slice(0, 8)}${"•".repeat(12)}`
                        : "Set a key to enable AI features"}
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${hasKey ? "bg-neon animate-pulse-dot" : "bg-danger"}`} />
              </div>
            </div>

            {/* Model Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-lg border border-line p-3">
                <div className="text-[10px] font-mono text-dim uppercase mb-1">Model</div>
                <div className="text-xs font-mono text-neon">gemini-2.5-flash</div>
              </div>
              <div className="glass rounded-lg border border-line p-3">
                <div className="text-[10px] font-mono text-dim uppercase mb-1">Version</div>
                <div className="text-xs font-mono text-neon">v0.4.0</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-deep/50">
            <button
              onClick={handleClear}
              disabled={!hasKey}
              className="text-[11px] font-mono text-danger/70 hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Clear Key
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-xs font-mono text-dim border border-line rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`px-5 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  saved
                    ? "bg-neon/20 text-neon border border-neon/30"
                    : "bg-neon text-black hover:bg-neon/85"
                }`}
              >
                {saved ? "✓ SAVED" : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
