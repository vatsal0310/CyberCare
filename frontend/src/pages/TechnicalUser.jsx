import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Search, GitBranch, FlaskConical, Activity, Bug, Zap } from "lucide-react";
import TechLayout from "../layouts/TechLayout";
import TechToolCard from "../components/tech/TechToolCard";
import SecurityLabsCard from "../components/tech/SecurityLabsCard";
import ActivityFeed from "../components/tech/ActivityFeed";
import AlertsPanel from "../components/tech/AlertsPanel";

const TOOL_CARDS = [
  { id: "vuln",   icon: Search,    label: "Smart Vulnerability Analyzer", desc: "Scan domains for open ports, header misconfigs, and known CVEs using a real Kali Linux container. Get an AI-powered security scorecard.", accent: "#38bdf8", tags: ["Port Scan", "Headers", "CVE"],        detail: [{ k: "Engine", v: "Kali Linux" }, { k: "Avg scan", v: "~30s"      }] },
  { id: "attack", icon: GitBranch, label: "Attack Graph Engine",           desc: "Visually design your system architecture, auto-discover every attack path via BFS/DFS. Maps threats to MITRE ATT&CK and scores risk via STRIDE.", accent: "#818cf8", tags: ["MITRE", "STRIDE", "Graph"],    detail: [{ k: "DB",     v: "Postgres"   }, { k: "Export",  v: "PDF / JSON" }] },
  { id: "soc",    icon: Shield,    label: "SOC / Red-Blue Team Lab",       desc: "Launch SQL injections, XSS payloads and brute force as Red Team — detect and neutralise them as a Blue Team SOC analyst with live SIEM feed.", accent: "#f472b6", tags: ["Red Team", "Blue Team", "SIEM"], detail: [{ k: "Mode",   v: "Live Sim"   }, { k: "Feed",    v: "Real-time"  }] },
];

const STATS = [
  { label: "Tools Available", value: 5,   icon: FlaskConical, color: "#38bdf8" },
  { label: "Scans Run",       value: 142, icon: Activity,     color: "#818cf8" },
  { label: "Vulns Found",     value: 31,  icon: Bug,          color: "#fb923c" },
  { label: "Lab Sessions",    value: 8,   icon: Zap,          color: "#34d399" },
];

function Counter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(t); } else setCount(n); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{count}</>;
}

export default function TechDashboard() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState(null);

  const handleLaunch = (id) => {
    const internalRoutes = {
      vuln:     "/technical-user/vulnerability-analyzer",
      attack:   "/technical-user/attack-graph",
      soc:      "/technical-user/soc-lab",
      sqli:     "/technical-user/sqli-lab",
      pwdcrack: "/technical-user/password-lab",
    };
    if (internalRoutes[id]) navigate(internalRoutes[id]);
  };

  return (
    <TechLayout activeTool={activeTool} onSelect={setActiveTool} onLogout={() => navigate("/")}>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.5), transparent)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-blue)", opacity: 0.7 }}>
              CYBERCARE // TECH DASHBOARD
            </span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight theme-heading">
            Command Center.
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl theme-card"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "#fff" }}
            >TC</div>
            <div>
              <div className="text-sm font-semibold leading-none theme-text">Tech User</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", opacity: 0.6 }}>// Security Researcher</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
            style={{ background: "rgba(255,56,96,0.08)", border: "1px solid rgba(255,56,96,0.25)", color: "rgba(255,100,120,0.85)", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,56,96,0.15)"; e.currentTarget.style.color = "#ff6480"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,56,96,0.08)"; e.currentTarget.style.color = "rgba(255,100,120,0.85)"; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-5 transition-all duration-300 theme-stat-card"
            style={{ border: "1px solid var(--border)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Icon size={16} style={{ color: `${color}80`, marginBottom: 8 }} />
            <div className="text-2xl font-extrabold mb-0.5 theme-text" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <Counter target={value} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-4 mb-6">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--text-faint)" }}>// SELECT A TOOL</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="cyber-tag" style={{ fontSize: "0.6rem" }}>4 TOOLS</span>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
        {TOOL_CARDS.map((tool) => (
          <TechToolCard key={tool.id} {...tool} onLaunch={handleLaunch} />
        ))}
        <SecurityLabsCard onLaunch={handleLaunch} />
      </div>

      {/* Activity + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--text-faint)" }}>// RECENT ACTIVITY</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>
          <ActivityFeed />
        </div>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--text-faint)" }}>// SECURITY ALERTS</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(255,100,120,0.6)" }}>5 ACTIVE</span>
          </div>
          <AlertsPanel />
        </div>
      </div>

      {/* Footer note */}
      <div
        className="mt-10 rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "var(--footer-card-bg)", border: "1px solid var(--footer-card-border)" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
          <Shield size={18} />
        </div>
        <div>
          <div className="text-sm font-semibold mb-0.5 theme-text">Isolated & secure environment</div>
          <div className="text-xs theme-muted">
            All tool sessions run in isolated containers. No real credentials are used. Activity is logged for your session only.
          </div>
        </div>
      </div>

    </TechLayout>
  );
}
