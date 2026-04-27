# 🌐 Agent Razinger // Command Center

![Deploy to Vercel](https://vercelbutton.com/api/button?project=Agent-Razinger)

**Live Demo**: [https://agent-razinger.vercel.app](https://agent-razinger.vercel.app)

*Agent Razinger* is a secure, personalized AI Command Center tailored strictly for Razinger's operational needs (Cybersecurity, Ethical Hacking, AI/ML, and Systems DevOps). It features real-time dynamic context ingestion, automated API handling, and a cutting-edge glassmorphism UI overlay built natively in Next.js.

## ✨ Features

- **Personalized AI Core**: Deeply tuned with contextual awareness regarding *Kivuli CMD*, *EpiPredict*, and advanced Kali Linux setups.
- **Google Gemini 2.5 Integration**: Uses `gemini-2.5-flash` natively to ensure completely rapid, high-context intelligence.
- **Secure Key Management**: BYOK (Bring Your Own Key) architecture. The Gemini API keys are processed and saved securely inside local browser storage, absolutely ensuring no server-side token leakage.
- **Markdown & Code UI Parsing**: Renders comprehensive markdown elements inside the Command Center's view seamlessly, syntax highlighting included.
- **Vercel native & Docker-ready**: Ships with an optimized multi-stage `Dockerfile` and `output: "standalone"` framework for hybrid deployment (Monolithic containerized local/cloud deployment OR purely serverless Vercel edge functions).

## 🧰 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **AI/LLM**: Google Gemini REST API (`gemini-2.5-flash`)
- **Deployment Strategy**: Vercel Serverless / Docker Containers

---

## 🚀 Getting Started

### 1. Local Configuration
Clone the repository, install dependencies, and setup your `.env.local` to securely pass testing parameters:

```bash
git clone https://github.com/Razinger-Joe/Agent-Razinger.git
cd Agent-Razinger
npm install
```

Create a `.env.local` file in the root folder and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the development instance:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### 2. Docker / Containerized Node 
If you prefer to deploy Agent Razinger via Docker (for EC2, DigitalOcean, or private servers), an optimized container is already configured for standalone caching:

```bash
# Build the optimized multi-stage image
docker build -t agent-razinger .

# Run passing the API Key into the environment
docker run -p 3000:3000 -e GEMINI_API_KEY="your_real_key" agent-razinger
```

---

## ☁️ Vercel Deployment

Agent Razinger natively integrates with Vercel. 
1. Link the repository to your Vercel Dashboard.
2. Under "Environment Variables", set `GEMINI_API_KEY` to your production Google Gemini key.
3. Deploy! Next.js and Vercel will automatically build the standalone node output traces and cache your routes.

## 🤝 Contributing

Contributions, feature additions, or security patches to Agent Razinger are strongly encouraged. 

1. Fork the project.
2. Create your `feature/amazing-tool` branch.
3. Commit your changes (`git commit -m 'Add some AmazingTool'`)
4. Push to the branch.
5. Open a Pull Request!

---

## 📝 Changelog

### v0.2.0 - Core UI Strategy Overhaul
- **UI Architecture Transition**: Refactored the legacy `Tabs` paradigm into a natively responsive, modern, multi-pane CSS Grid interface. 
- **Centralized UI Context**: Added `UIContextProvider` globally wrapping the entire monolithic structure to properly track pane visibilities.
- **Dynamic Sidebar Control Panel**: Replaced tab navigation with a persistent sidebar menu system to dynamically control layout components (AI Agent, JSON Prompter, Trends, Code Arch).

### v0.3.0 - API Consistency & UI Polish
- **Gemini API Unification**: Fixed JSON Prompter and Trend Feed components that were still referencing Anthropic/Claude — now fully use `gemini-2.5-flash` and `gemini_api_key`.
- **Header Restoration**: Restored the `RAZINGER // CMD` header bar with Shield icon branding, GitHub repo link, and system status indicator.
- **Sidebar Upgrade**: Rewrote sidebar with Lucide icons, active pane indicators with glow effects, panel count, version badge, and mobile hamburger menu support.
- **Layout Improvements**: Dynamic 2-column grid layout, glass-wrapped pane containers, empty-state messaging when all panes are hidden.
- **Hydration Fix**: Resolved Next.js hydration mismatch from browser extension attribute injection.

### v0.4.0 - Global State & Cross-Pane Intelligence
- **Centralized Settings Modal**: Migrated API key management from an inline Agent Chat panel to a globally accessible `SettingsModal` via the header, establishing a single source of truth for user preferences.
- **Cross-Pane Communication**: Implemented `injectedMessage` in the global `UIContext`. The "Code Arch" and "Stack Patterns" components can now dynamically inject context queries directly into the "Agent Chat", bridging formerly disjointed components into a cohesive system.
- **State Cleanup**: Removed redundant prop drilling (`onAskArch`, `injectedMessage` as props) in favor of the unified Context layer.
