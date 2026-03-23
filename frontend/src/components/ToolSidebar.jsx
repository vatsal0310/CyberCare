import { NavLink, useNavigate } from "react-router-dom";
import { KeyRound, Globe, ShieldAlert, AlertTriangle, Brain, Shield, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const tools = [
  { to: "/tools/password-analyzer",    icon: KeyRound,      label: "Password Analyzer",   desc: "Check password strength", accent: "#38bdf8" },
  { to: "/tools/fake-website-detector",icon: Globe,         label: "Website Detector",    desc: "Spot fake or scam sites", accent: "#818cf8" },
  { to: "/tools/data-breach",          icon: ShieldAlert,   label: "Data Breach Checker", desc: "Was your data leaked?",   accent: "#f472b6" },
  { to: "/tools/phishing-awareness",   icon: AlertTriangle, label: "Phishing Awareness",  desc: "Learn to spot scams",     accent: "#fb923c" },
  { to: "/tools/quiz",                 icon: Brain,         label: "Cyber Safety Quiz",   desc: "Test your knowledge",     accent: "#34d399" },
];

export default function ToolSidebar() {
  const [hoveredIndex,     setHoveredIndex]     = useState(null);
  const [dashboardHovered, setDashboardHovered] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  return (
    <aside
      className="w-[260px] min-h-screen flex flex-col relative overflow-hidden theme-sidebar"
      style={{ borderRight: "1px solid var(--border-sidebar)" }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none theme-grid-bg-sm" />

      {/* Top glow orb */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,var(--glow-a) 0%,transparent 70%)" }}
      />

      {/* ── Brand row ── */}
      <div
        className="relative flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid var(--border-sidebar)" }}
      >
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#1d4ed8)", boxShadow: "0 0 18px rgba(14,165,233,0.45)" }}
          >
            <Shield size={17} className="theme-text" />
          </div>
          <span
            className="absolute inset-0 rounded-xl animate-ping"
            style={{ background: "rgba(14,165,233,0.2)", animationDuration: "2.5s" }}
          />
        </div>

        {/* Brand text */}
        <div className="flex-1 min-w-0">
          <div className="sidebar-brand-text text-sm font-bold tracking-[0.15em]">
            CYBERCARE
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: "var(--sidebar-brand-text-sub)", letterSpacing: "0.08em" }}>
            Security Toolkit
          </div>
        </div>

        {/* ── Theme toggle ── */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="relative w-12 h-6 rounded-full transition-all duration-500 focus:outline-none flex-shrink-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg,#0f2044,#0e3a5c)"
              : "linear-gradient(135deg,#e0f2fe,#bae6fd)",
            border: isDark
              ? "1px solid rgba(34,211,238,0.3)"
              : "1px solid rgba(14,116,144,0.3)",
            boxShadow: isDark
              ? "0 0 10px rgba(34,211,238,0.15)"
              : "0 0 10px rgba(14,165,233,0.2)",
          }}
        >
          <span className="absolute left-1 top-1/2 -translate-y-1/2 transition-opacity duration-300" style={{ opacity: isDark ? 1 : 0 }}>
            <Moon size={10} color="#22d3ee" />
          </span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 transition-opacity duration-300" style={{ opacity: isDark ? 0 : 1 }}>
            <Sun size={10} color="#0369a1" />
          </span>
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              left: isDark ? "2px" : "calc(100% - 22px)",
              background: isDark ? "linear-gradient(135deg,#22d3ee,#0ea5e9)" : "linear-gradient(135deg,#fbbf24,#f59e0b)",
              boxShadow: isDark ? "0 0 8px rgba(34,211,238,0.6)" : "0 0 8px rgba(251,191,36,0.7)",
            }}
          >
            {isDark
              ? <Moon size={10} color="#0c4a6e" strokeWidth={2.5} />
              : <Sun  size={10} color="#78350f" strokeWidth={2.5} />
            }
          </span>
        </button>
      </div>

      {/* ── Dashboard link ── */}
      <div className="relative px-3 pt-5 pb-1">
        <div
          onClick={() => navigate("/regular-user")}
          onMouseEnter={() => setDashboardHovered(true)}
          onMouseLeave={() => setDashboardHovered(false)}
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
          style={{
            background: dashboardHovered ? "var(--sidebar-hover-bg)" : "transparent",
            border: dashboardHovered ? "1px solid var(--border)" : "1px solid transparent",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: dashboardHovered ? "rgba(56,189,248,0.14)" : "var(--bg-row)",
              color: dashboardHovered ? "#38bdf8" : "var(--sidebar-icon-inactive)",
            }}
          >
            <LayoutDashboard size={15} />
          </div>
          <span
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: dashboardHovered ? "var(--sidebar-nav-text-hover)" : "var(--sidebar-nav-text)" }}
          >
            Dashboard
          </span>
          {dashboardHovered && (
            <div className="ml-auto text-xs" style={{ color: "rgba(56,189,248,0.7)" }}>→</div>
          )}
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="relative px-5 pt-3 pb-2">
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "var(--sidebar-section-label)" }}>
          // tools
        </span>
      </div>

      {/* ── Nav Links ── */}
      <nav className="relative flex-1 px-3 space-y-1">
        {tools.map(({ to, icon: Icon, label, desc, accent }, index) => (
          <NavLink
            key={to}
            to={to}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {({ isActive }) => (
              <div
                className="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive ? `linear-gradient(135deg,${accent}18,${accent}08)` : hoveredIndex === index ? "var(--sidebar-hover-bg)" : "transparent",
                  border: isActive ? `1px solid ${accent}35` : "1px solid transparent",
                  boxShadow: isActive ? `0 4px 20px ${accent}15` : "none",
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive ? `${accent}22` : hoveredIndex === index ? `${accent}14` : "var(--bg-row)",
                    color: isActive || hoveredIndex === index ? accent : "var(--sidebar-icon-inactive)",
                    boxShadow: isActive ? `0 0 12px ${accent}30` : "none",
                  }}
                >
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-sm font-semibold leading-none mb-0.5 transition-colors duration-200"
                    style={{ color: isActive ? "var(--sidebar-nav-text-active)" : hoveredIndex === index ? "var(--sidebar-nav-text-hover)" : "var(--sidebar-nav-text)" }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-xs truncate transition-colors duration-200"
                    style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: isActive ? `${accent}99` : "var(--sidebar-desc-inactive)" }}
                  >
                    {desc}
                  </div>
                </div>
                {!isActive && hoveredIndex === index && (
                  <div className="ml-auto text-xs" style={{ color: `${accent}70` }}>→</div>
                )}
                {isActive && (
                  <div className="ml-auto flex-shrink-0 relative">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: accent, opacity: 0.4, animationDuration: "2s" }} />
                  </div>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer status card ── */}
      <div
        className="relative mx-3 mb-5 rounded-xl p-4"
        style={{ background: "var(--sidebar-status-bg)", border: "1px solid var(--sidebar-status-border)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-2 h-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ opacity: 0.35, animationDuration: "2s" }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#34d399", letterSpacing: "0.08em" }}>
            ALL SYSTEMS ACTIVE
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "var(--sidebar-status-text)", lineHeight: 1.5 }}>
          5 tools · encrypted · no data stored
        </div>
      </div>
    </aside>
  );
}