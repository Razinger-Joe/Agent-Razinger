"use client";

interface CodeArchProps {
  onAskArch: (question: string) => void;
}

const PROJECTS = [
  {
    icon: "🛡",
    title: "Kivuli CMD",
    desc: "Security-first command center. Microservices, event-driven, real-time threat response.",
    query: "Kivuli Command Center architecture",
  },
  {
    icon: "🧬",
    title: "EpiPredict",
    desc: "ML pipeline for epidemic prediction. Data ingestion → model → API → dashboard.",
    query: "EpiPredict AI system architecture",
  },
  {
    icon: "📡",
    title: "Netfluenz",
    desc: "AI-driven creator marketplace. Matching engine, brand APIs, creator analytics.",
    query: "Netfluenz marketplace architecture",
  },
  {
    icon: "🔐",
    title: "Cyber Guard",
    desc: "Community threat detection. Event streams, alert engine, incident playbooks.",
    query: "Cyber Guard threat response system architecture",
  },
];

const PATTERNS = [
  {
    icon: "🐍",
    title: "Python Modules",
    desc: "Clean, modular Python for security tools. Type hints, logging, error handling.",
    tag: "→ Get code template",
    query:
      "best practices for clean modular Python code in cybersecurity tools",
  },
  {
    icon: "🔗",
    title: "Secure APIs",
    desc: "JWT, rate limiting, input validation, OWASP top 10 mitigation patterns.",
    tag: "→ Get code template",
    query: "REST API design best practices with security in mind",
  },
  {
    icon: "⚙",
    title: "DevOps Pipeline",
    desc: "GitHub Actions + Docker + security scanning. SAST/DAST integrated CI/CD.",
    tag: "→ Get pipeline config",
    query: "CI/CD pipeline setup for a security-conscious DevOps team",
  },
  {
    icon: "🤖",
    title: "ML Structure",
    desc: "Project layout, experiment tracking, model versioning, deployment patterns.",
    tag: "→ Get project scaffold",
    query:
      "how to structure a machine learning project for AI system development",
  },
];

export default function CodeArch({ onAskArch }: CodeArchProps) {
  return (
    <div className="space-y-6">
      {/* Projects section */}
      <div>
        <h3 className="text-xs font-mono text-neon tracking-widest mb-3 uppercase neon-text">
          // Razinger&apos;s Stack Patterns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PROJECTS.map((p) => (
            <button
              key={p.title}
              onClick={() => onAskArch(p.query)}
              className="glass border border-line rounded-xl p-4 text-left transition-all glow-border cursor-pointer group"
            >
              <h4 className="text-sm font-bold mb-1.5">
                {p.icon} {p.title}
              </h4>
              <p className="text-xs text-dim leading-relaxed mb-2">{p.desc}</p>
              <span className="text-[10px] font-mono text-neon group-hover:neon-text transition-all">
                → Ask AI to expand
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Code style guide */}
      <div>
        <h3 className="text-xs font-mono text-neon tracking-widest mb-3 uppercase neon-text">
          // Code Style Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PATTERNS.map((p) => (
            <button
              key={p.title}
              onClick={() => onAskArch(p.query)}
              className="glass border border-line rounded-xl p-4 text-left transition-all glow-border cursor-pointer group"
            >
              <h4 className="text-sm font-bold mb-1.5">
                {p.icon} {p.title}
              </h4>
              <p className="text-xs text-dim leading-relaxed mb-2">{p.desc}</p>
              <span className="text-[10px] font-mono text-neon group-hover:neon-text transition-all">
                {p.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
