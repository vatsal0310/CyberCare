import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../../../context/ThemeContext";

// ─────────────────────────────────────────────────────────────
// Timer.jsx
//
// Two modes:
// 1. expires_at prop (ISO string from backend) — server-synced ✅
//    Calculates remaining time from server timestamp.
//    Survives page refresh — always shows accurate time.
//
// 2. duration prop (seconds fallback) — local countdown
//
// ✅ THEME: Now respects dark/light theme via useTheme().
// ─────────────────────────────────────────────────────────────

export default function Timer({ duration = 600, expires_at = null, onExpire }) {
  const { isDark } = useTheme();

  const [timeLeft, setTimeLeft] = useState(() => {
    if (expires_at) {
      const remaining = Math.floor((new Date(expires_at) - Date.now()) / 1000);
      return Math.max(remaining, 0);
    }
    return duration;
  });

  const expiredRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
      return;
    }

    const interval = setInterval(() => {
      let remaining;
      if (expires_at) {
        remaining = Math.floor((new Date(expires_at) - Date.now()) / 1000);
      } else {
        remaining = timeLeft - 1;
      }

      const clamped = Math.max(remaining, 0);
      setTimeLeft(clamped);

      if (clamped <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, expires_at]);

  const minutes   = Math.floor(timeLeft / 60);
  const seconds   = timeLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const isWarning = timeLeft <= 120 && timeLeft > 30;
  const isDanger  = timeLeft <= 30;

  // Semantic accent colors stay the same across themes (they're status signals)
  const accentColor  = isDanger ? "#ef4444" : isWarning ? "#f59e0b" : "#00bfff";
  const borderColor  = accentColor;

  // Background adapts to theme
  const bgColor = isDark
    ? isDanger ? "#2a0a0a" : isWarning ? "#2d2004" : "#0f172a"
    : isDanger ? "#fff1f2" : isWarning ? "#fefce8" : "#e0f2fe";

  const labelColor = isDark ? "#64748b" : "#94a3b8";

  return (
    <div style={{
      padding: "10px 16px",
      background: bgColor,
      color: accentColor,
      borderRadius: "8px",
      minWidth: "120px",
      border: `1px solid ${borderColor}`,
      boxShadow: isDanger ? `0 0 12px ${accentColor}44` : "none",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "18px",
      animation: isDanger ? "pulse 0.8s ease-in-out infinite alternate" : "none",
      transition: "background 0.5s, border-color 0.5s, color 0.5s",
    }}>
      <div style={{ fontSize: "11px", color: labelColor, marginBottom: "2px" }}>
        TIME LEFT
      </div>
      {timeLeft <= 0 ? "⏰ Expired" : `⏳ ${formatted}`}
    </div>
  );
}
