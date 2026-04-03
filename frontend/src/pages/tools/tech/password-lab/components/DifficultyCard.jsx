import { useState } from "react";
import { useTheme } from "../../../../../context/ThemeContext";

// ✅ THEME: Now respects dark/light theme via useTheme().
// Difficulty accent colors are semantic — they stay the same in both themes.
// Only background surfaces adapt.

const DIFFICULTY_THEME = {
  beginner: {
    color:  "#00c47a",
    border: "#00c47a",
    shadow: "rgba(0,196,122,0.28)",
    badgeBgDark:  "#052e16",
    badgeBgLight: "#d1fae5",
    label: "🟢 Beginner",
  },
  intermediate: {
    color:  "#f59e0b",
    border: "#f59e0b",
    shadow: "rgba(245,158,11,0.28)",
    badgeBgDark:  "#2d2004",
    badgeBgLight: "#fef9c3",
    label: "🟡 Intermediate",
  },
  advanced: {
    color:  "#ef4444",
    border: "#ef4444",
    shadow: "rgba(239,68,68,0.28)",
    badgeBgDark:  "#2a0a0a",
    badgeBgLight: "#fff1f2",
    label: "🔴 Advanced",
  },
};

export default function DifficultyCard({
  id,
  title,
  description,
  points,
  mode,
  algorithm,
  timer_seconds,
  expected_tool,
  onSelect,
  disabled = false,
}) {
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState(false);

  const theme = DIFFICULTY_THEME[id] || DIFFICULTY_THEME.beginner;

  const timerLabel = timer_seconds ? `${Math.floor(timer_seconds / 60)} min` : "10 min";

  const modeLabel = {
    guided: "Fully Guided",
    hints:  "Hints-Based",
    free:   "Free Mode",
  }[mode] || mode;

  const toolLabel = expected_tool
    ? expected_tool.charAt(0).toUpperCase() + expected_tool.slice(1)
    : "Your Choice";

  // Theme-aware surfaces
  const cardBg     = isDark ? "#0f172a"  : "#f0f7ff";
  const infoCellBg = isDark ? "#1e293b"  : "#dbeafe";
  const labelColor = isDark ? "#64748b"  : "#94a3b8";
  const descColor  = isDark ? "#94a3b8"  : "#4b5563";
  const badgeBg    = isDark ? theme.badgeBgDark : theme.badgeBgLight;

  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor:     disabled ? "not-allowed" : "pointer",
        padding:    "24px 20px",
        background: cardBg,
        color:      theme.color,
        borderRadius: "14px",
        border:     `1px solid ${hovered ? theme.color : theme.border}`,
        width:      "100%",
        height:     "100%",
        boxSizing:  "border-box",
        textAlign:  "center",
        display:    "flex",
        flexDirection: "column",
        boxShadow:  hovered
          ? `0 0 22px ${theme.shadow}`
          : `0 0 10px ${theme.shadow}`,
        opacity:    disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "transform 0.2s, box-shadow 0.2s, background 0.3s",
        transform:  hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Difficulty badge */}
      <div style={{
        display:      "inline-block",
        background:   badgeBg,
        color:        theme.color,
        fontSize:     "12px",
        fontWeight:   "bold",
        padding:      "3px 10px",
        borderRadius: "20px",
        marginBottom: "10px",
        border:       `1px solid ${theme.color}`,
        transition:   "background 0.3s",
      }}>
        {theme.label}
      </div>

      <h2 style={{ marginBottom: "8px", fontSize: "20px" }}>{title}</h2>

      <p style={{ fontSize: "13px", color: descColor, marginBottom: "14px", lineHeight: "1.5" }}>
        {description}
      </p>

      {/* Info grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        marginBottom: "14px",
        fontSize: "12px",
        textAlign: "left",
      }}>
        {[
          { label: "Algorithm", value: algorithm?.toUpperCase() },
          { label: "Mode",      value: modeLabel },
          { label: "Timer",     value: `⏱ ${timerLabel}` },
          { label: "Tool",      value: toolLabel },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: infoCellBg,
            padding: "6px 10px",
            borderRadius: "6px",
            transition: "background 0.3s",
          }}>
            <span style={{ color: labelColor }}>{label}</span>
            <div style={{ color: theme.color, fontWeight: "bold" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Points */}
      <div style={{
        background:   badgeBg,
        border:       `1px solid ${theme.color}`,
        borderRadius: "8px",
        padding:      "8px",
        fontWeight:   "bold",
        fontSize:     "16px",
        marginTop:    "auto",
        transition:   "background 0.3s",
      }}>
        🏆 {points} Points
      </div>

      {disabled && (
        <p style={{ marginTop: "10px", fontSize: "12px", color: labelColor }}>
          🔒 Accept disclaimer to unlock
        </p>
      )}
    </div>
  );
}
