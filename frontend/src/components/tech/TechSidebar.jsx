import { useState } from "react";
import { Shield, Search, GitBranch, FlaskConical, FileText, LogOut, LayoutDashboard } from "lucide-react";

export const techTools = [
  { id: "vuln",   icon: Search,       label: "Vulnerability Analyzer", desc: "Port scan & CVE detection",  accent: "#38bdf8" },
  { id: "attack", icon: GitBranch,    label: "Attack Graph Engine",    desc: "MITRE ATT&CK mapping",       accent: "#818cf8" },
  { id: "soc",    icon: Shield,       label: "SOC / Red-Blue Lab",     desc: "Live attack simulation",     accent: "#f472b6" },
  { id: "labs",   icon: FlaskConical, label: "Security Labs",          desc: "SQLi & password cracking",   accent: "#a78bfa" },
];

export default function TechSidebar({ active, onSelect, onLogout }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <aside
      className="w-[260px] min-h-screen flex flex-col relative overflow-hidden flex-shrink-0 theme-sidebar"
      style={{ borderRight: "1px solid var(--border-sidebar)" }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none theme-grid-bg-sm" />

      {/* Top glow */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-a) 0%, transparent 70%)" }}
      />

      {/* Brand */}
      <div
        className="relative flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid var(--border-sidebar)" }}
      >
        <div className="relative flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)", boxShadow: "0 0 18px rgba(14,165,233,0.45)" }}
          >
            <Shield size={17} style={{ color: "#fff" }} />
          </div>
          <span
            className="absolute inset-0 rounded-xl animate-ping"
            style={{ background: "rgba(14,165,233,0.2)", animationDuration: "2.5s" }}
          />
        </div>
        <div>
          <div className="sidebar-brand-text text-sm font-bold tracking-[0.15em]">
            CYBERCARE
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--sidebar-brand-text-sub)", letterSpacing: "0.08em" }}>
            Tech Portal
          </div>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="relative px-3 pt-5 pb-1">
        <div
          onClick={() => onSelect(null)}
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
          style={{
            background: active === null ? "rgba(56,189,248,0.08)" : "transparent",
            border: active === null ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: active === null ? "rgba(56,189,248,0.15)" : "var(--bg-row)",
              color: active === null ? "#38bdf8" : "var(--sidebar-icon-inactive)",
            }}
          >
            <LayoutDashboard size={15} />
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: active === null ? "var(--sidebar-nav-text-active)" : "var(--sidebar-nav-text)" }}
          >
            Dashboard
          </span>
          {active === null && (
            <div className="ml-auto relative">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#38bdf8" }} />
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "#38bdf8", opacity: 0.4, animationDuration: "2s" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Section label */}
      <div className="relative px-5 pt-4 pb-2">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "var(--sidebar-section-label)", textTransform: "uppercase" }}>
          // tools
        </span>
      </div>

      {/* Nav links */}
      <nav className="relative flex-1 px-3 space-y-1">
        {techTools.map(({ id, icon: Icon, label, desc, accent }, index) => {
          const isActive = active === id;
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: isActive ? `linear-gradient(135deg, ${accent}18, ${accent}08)` : isHovered ? "var(--sidebar-hover-bg)" : "transparent",
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
                  background: isActive ? `${accent}22` : isHovered ? `${accent}14` : "var(--bg-row)",
                  color: isActive || isHovered ? accent : "var(--sidebar-icon-inactive)",
                  boxShadow: isActive ? `0 0 12px ${accent}30` : "none",
                }}
              >
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <div
                  className="text-sm font-semibold leading-none mb-0.5 transition-colors duration-200"
                  style={{ color: isActive ? "var(--sidebar-nav-text-active)" : isHovered ? "var(--sidebar-nav-text-hover)" : "var(--sidebar-nav-text)" }}
                >
                  {label}
                </div>
                <div
                  className="truncate"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: isActive ? `${accent}99` : "var(--sidebar-desc-inactive)" }}
                >
                  {desc}
                </div>
              </div>
              {!isActive && isHovered && <div className="ml-auto text-xs" style={{ color: `${accent}70` }}>→</div>}
              {isActive && (
                <div className="ml-auto flex-shrink-0 relative">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: accent, opacity: 0.4, animationDuration: "2s" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Reports */}
      <div className="relative px-3 pb-2">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover-bg)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--bg-row)", color: "var(--sidebar-icon-inactive)" }}
          >
            <FileText size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-none mb-0.5" style={{ color: "var(--sidebar-nav-text)" }}>Professional Reports</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--sidebar-desc-inactive)" }}>Export findings as PDF</div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", background: "rgba(29,78,216,0.2)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)", padding: "2px 6px", borderRadius: 3, flexShrink: 0 }}>
            PRO
          </span>
        </div>
      </div>

      {/* Footer status */}
      <div
        className="relative mx-3 mb-5 rounded-xl p-4"
        style={{ background: "var(--sidebar-status-bg)", border: "1px solid var(--sidebar-status-border)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-2 h-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" style={{ opacity: 0.35, animationDuration: "2s" }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#34d399", letterSpacing: "0.08em" }}>
            ALL SYSTEMS ACTIVE
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--sidebar-status-text)", lineHeight: 1.5 }}>
          5 tools · postgres 15 · containers running
        </div>
        <button
          onClick={onLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200"
          style={{ background: "rgba(255,56,96,0.08)", border: "1px solid rgba(255,56,96,0.2)", color: "rgba(255,100,120,0.8)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,56,96,0.15)"; e.currentTarget.style.color = "#ff6480"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,56,96,0.08)"; e.currentTarget.style.color = "rgba(255,100,120,0.8)"; }}
        >
          <LogOut size={12} /> LOGOUT
        </button>
      </div>
    </aside>
  );
}
