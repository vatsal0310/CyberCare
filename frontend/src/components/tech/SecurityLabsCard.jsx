import { useState } from "react";
import { FlaskConical, ArrowRight } from "lucide-react";

const ACCENT = "#a78bfa";

export default function SecurityLabsCard({ onLaunch }) {
  const [hovered, setHovered] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      onLaunch("/technical-user/security-labs");
    }, 600);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 overflow-hidden theme-card"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${ACCENT}10, var(--bg-card))`
          : "var(--bg-card)",
        border: hovered
          ? `1px solid ${ACCENT}40`
          : "1px solid var(--border)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 50px ${ACCENT}15` : "none",
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          opacity: hovered ? 0.6 : 0,
        }}
      />

      {/* Header Row */}
      <div className="flex justify-between items-start">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: `${ACCENT}20`,
            color: ACCENT,
            boxShadow: hovered ? `0 0 20px ${ACCENT}30` : "none",
          }}
        >
          <FlaskConical size={20} />
        </div>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            padding: "3px 8px",
            borderRadius: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: `${ACCENT}14`,
            color: ACCENT,
            border: `1px solid ${ACCENT}30`,
            whiteSpace: "nowrap",
          }}
        >
          HANDS-ON
        </span>
      </div>

      {/* Title BELOW icon */}
      <div>
        <h3 className="font-bold text-lg theme-text">
          Security Labs
        </h3>
        <p className="text-sm theme-muted">
          Practice real-world exploitation & defense scenarios
        </p>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed theme-muted">
        Perform SQL injections and exploit simulations in a controlled lab
        environment.
      </p>

      {/* Details */}
      <div
        className="flex gap-4 text-xs"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "var(--text-faint)",
        }}
      >
        <div>
          Labs: <span style={{ color: "var(--text-muted)" }}>1</span>
        </div>
        <div>
          Mode: <span style={{ color: "var(--text-muted)" }}>Interactive</span>
        </div>
      </div>

      {/* Launch button (SOC style) */}
      <button
        onClick={handleLaunch}
        className="mt-auto self-end flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}30, ${ACCENT}15)`,
          border: `1px solid ${ACCENT}40`,
          color: ACCENT,
        }}
      >
        {launching ? (
          <div
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{
              borderColor: `${ACCENT}40`,
              borderTopColor: ACCENT,
            }}
          />
        ) : (
          <>
            Launch <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}