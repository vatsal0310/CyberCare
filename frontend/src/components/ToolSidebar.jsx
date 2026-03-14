import { NavLink } from "react-router-dom";
import { KeyRound, Globe, ShieldAlert, AlertTriangle, Brain, Shield } from "lucide-react";
import { useState } from "react";

const tools = [
  {
    to: "/tools/password-analyzer",
    icon: KeyRound,
    label: "Password Analyzer",
    desc: "Check password strength",
    accent: "#38bdf8",
  },
  {
    to: "/tools/fake-website-detector",
    icon: Globe,
    label: "Website Detector",
    desc: "Spot fake or scam sites",
    accent: "#818cf8",
  },
  {
    to: "/tools/data-breach",
    icon: ShieldAlert,
    label: "Data Breach Checker",
    desc: "Was your data leaked?",
    accent: "#f472b6",
  },
  {
    to: "/tools/phishing-awareness",
    icon: AlertTriangle,
    label: "Phishing Awareness",
    desc: "Learn to spot scams",
    accent: "#fb923c",
  },
  {
    to: "/tools/quiz",
    icon: Brain,
    label: "Cyber Safety Quiz",
    desc: "Test your knowledge",
    accent: "#34d399",
  },
];

export default function ToolSidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <aside
      className="w-[260px] min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #040d1f 0%, #060f24 60%, #040d1f 100%)",
        borderRight: "1px solid rgba(56,189,248,0.1)",
      }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top glow orb */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Brand ── */}
      <div
        className="relative flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.08)" }}
      >
        {/* Shield icon with animated ring */}
        <div className="relative flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
              boxShadow: "0 0 18px rgba(14,165,233,0.45)",
            }}
          >
            <Shield size={17} className="text-white" />
          </div>
          {/* Ping ring */}
          <span
            className="absolute inset-0 rounded-xl animate-ping"
            style={{
              background: "rgba(14,165,233,0.2)",
              animationDuration: "2.5s",
            }}
          />
        </div>

        <div>
          <div
            className="text-sm font-bold tracking-[0.15em]"
            style={{
              background: "linear-gradient(90deg, #e0f2fe, #7dd3fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CYBERCARE
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "rgba(148,163,184,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            Security Toolkit
          </div>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="relative px-5 pt-6 pb-2">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            color: "rgba(56,189,248,0.45)",
            textTransform: "uppercase",
          }}
        >
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
                  background: isActive
                    ? `linear-gradient(135deg, ${accent}18, ${accent}08)`
                    : hoveredIndex === index
                    ? "rgba(255,255,255,0.03)"
                    : "transparent",
                  border: isActive
                    ? `1px solid ${accent}35`
                    : "1px solid transparent",
                  boxShadow: isActive ? `0 4px 20px ${accent}15` : "none",
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                )}

                {/* Icon box */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive
                      ? `${accent}22`
                      : hoveredIndex === index
                      ? `${accent}14`
                      : "rgba(255,255,255,0.04)",
                    color: isActive
                      ? accent
                      : hoveredIndex === index
                      ? accent
                      : "rgba(148,163,184,0.45)",
                    boxShadow: isActive ? `0 0 12px ${accent}30` : "none",
                  }}
                >
                  <Icon size={15} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <div
                    className="text-sm font-semibold leading-none mb-0.5 transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "#f0f9ff"
                        : hoveredIndex === index
                        ? "#cbd5e1"
                        : "rgba(148,163,184,0.6)",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-xs truncate transition-colors duration-200"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      color: isActive
                        ? `${accent}99`
                        : "rgba(100,116,139,0.5)",
                    }}
                  >
                    {desc}
                  </div>
                </div>

                {/* Arrow on hover */}
                {!isActive && hoveredIndex === index && (
                  <div
                    className="ml-auto text-xs"
                    style={{ color: `${accent}70` }}
                  >
                    →
                  </div>
                )}

                {/* Active pulsing dot */}
                {isActive && (
                  <div className="ml-auto flex-shrink-0 relative">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: accent }}
                    />
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: accent, opacity: 0.4, animationDuration: "2s" }}
                    />
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
        style={{
          background: "linear-gradient(135deg, rgba(14,165,233,0.07), rgba(29,78,216,0.05))",
          border: "1px solid rgba(56,189,248,0.12)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-2 h-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div
              className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"
              style={{ opacity: 0.35, animationDuration: "2s" }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "#34d399",
              letterSpacing: "0.08em",
            }}
          >
            ALL SYSTEMS ACTIVE
          </span>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(148,163,184,0.35)",
            lineHeight: 1.5,
          }}
        >
          5 tools · encrypted · no data stored
        </div>
      </div>
    </aside>
  );
}
