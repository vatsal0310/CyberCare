// ScoreCard.jsx — shows full score breakdown with penalty itemisation
// ✅ THEME: Now respects dark/light theme via useTheme().

import { useTheme } from "../../../../../context/ThemeContext";

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function ScoreCard({
  score,
  attempts,
  time,
  difficulty,
  mode,
  hintsUsed,
  baseScore,
  timePenalty,
  attemptPenalty,
  hintPenalty,
}) {
  const { isDark } = useTheme();

  const finalScore = score ?? 0;
  const maxScore   = { beginner: 50, intermediate: 100, advanced: 200 }[difficulty] || 50;
  const isPerfect  = finalScore === maxScore;
  const isLow      = finalScore <= 10;

  // Score quality color — same semantic meaning in both themes
  const scoreColor = isPerfect
    ? "#00c47a"
    : finalScore >= maxScore * 0.7
    ? "#0ea5e9"
    : finalScore >= maxScore * 0.4
    ? "#f59e0b"
    : "#ef4444";

  const difficultyLabel = {
    beginner:     "🟢 Beginner",
    intermediate: "🟡 Intermediate",
    advanced:     "🔴 Advanced",
  }[difficulty] || difficulty;

  const modeLabel = {
    guided: "Fully Guided",
    hints:  "Hints-Based",
    free:   "Free Mode",
  }[mode] || mode;

  const hasBreakdown = baseScore !== undefined;

  // Theme palette
  const c = isDark ? {
    panelBg:      "#0f172a",
    text:         "#e5e7eb",
    muted:        "#94a3b8",
    sub:          "#64748b",
    breakdownBg:  "#020617",
    divider:      "#1e293b",
    scoreBg:      "#020617",
    success:      "#00c47a",
    danger:       "#f87171",
  } : {
    panelBg:      "#f0f7ff",
    text:         "#0c1a2e",
    muted:        "#4b5563",
    sub:          "#94a3b8",
    breakdownBg:  "#e8f2fd",
    divider:      "#cbd5e1",
    scoreBg:      "#e0f2fe",
    success:      "#059669",
    danger:       "#dc2626",
  };

  return (
    <div style={{
      padding: "20px",
      background: c.panelBg,
      color: c.text,
      borderRadius: "12px",
      width: "280px",
      border: `1px solid ${scoreColor}`,
      boxShadow: `0 0 14px ${scoreColor}33`,
      transition: "background 0.3s",
    }}>
      <h3 style={{ color: scoreColor, marginBottom: "14px", fontSize: "16px" }}>
        {isPerfect ? "🏆 Perfect Score!" : "📊 Lab Results"}
      </h3>

      {/* Difficulty + Mode context */}
      {difficulty && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: c.sub,
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: `1px solid ${c.divider}`,
        }}>
          <span>{difficultyLabel}</span>
          {modeLabel && <span>{modeLabel}</span>}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
          <span style={{ color: c.muted }}>⏱ Time</span>
          <span>{formatTime(time)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
          <span style={{ color: c.muted }}>🔁 Attempts</span>
          <span>{attempts ?? 0}</span>
        </div>
        {hintsUsed !== undefined && hintsUsed !== null && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: c.muted }}>💡 Hints Used</span>
            <span>{hintsUsed}</span>
          </div>
        )}
      </div>

      {/* Score breakdown */}
      {hasBreakdown && (
        <div style={{
          background: c.breakdownBg,
          borderRadius: "8px",
          padding: "10px 12px",
          marginBottom: "12px",
          fontSize: "13px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          transition: "background 0.3s",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: c.muted }}>
            <span>Base score</span>
            <span style={{ color: c.success }}>+{baseScore}</span>
          </div>
          {timePenalty < 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", color: c.muted }}>
              <span>Time penalty</span>
              <span style={{ color: c.danger }}>{timePenalty}</span>
            </div>
          )}
          {attemptPenalty < 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", color: c.muted }}>
              <span>Attempt penalty</span>
              <span style={{ color: c.danger }}>{attemptPenalty}</span>
            </div>
          )}
          {hintPenalty < 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", color: c.muted }}>
              <span>Hint penalty</span>
              <span style={{ color: c.danger }}>{hintPenalty}</span>
            </div>
          )}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${c.divider}`,
            paddingTop: "6px",
            marginTop: "4px",
            fontWeight: "bold",
          }}>
            <span style={{ color: c.muted }}>Final</span>
            <span style={{ color: scoreColor }}>{finalScore}</span>
          </div>
        </div>
      )}

      {/* Final score display */}
      <div style={{
        textAlign: "center",
        padding: "12px",
        background: c.scoreBg,
        borderRadius: "8px",
        border: `1px solid ${scoreColor}`,
        transition: "background 0.3s",
      }}>
        <div style={{ fontSize: "12px", color: c.sub, marginBottom: "4px" }}>Final Score</div>
        <div style={{ fontSize: "32px", fontWeight: "bold", color: scoreColor }}>
          {finalScore}
        </div>
        <div style={{ fontSize: "12px", color: c.muted }}>/ {maxScore} pts</div>
      </div>

      {isLow && (
        <p style={{ fontSize: "11px", color: c.danger, marginTop: "10px", textAlign: "center" }}>
          Minimum score applied — keep practising!
        </p>
      )}
    </div>
  );
}
