import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TechLayout from "../../../../layouts/TechLayout";
import { useTheme } from "../../../../context/ThemeContext";
import ScoreCard from "./components/ScoreCard";

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes confettiPop {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.2); }
    100% { transform: scale(1);   opacity: 1; }
  }
  .result-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    animation: fadeUp 0.4s ease both;
  }
  .result-stat {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
    text-align: center;
  }
  .action-btn {
    flex: 1;
    padding: 14px 0;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: filter 0.15s, transform 0.15s;
  }
  .action-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
`;

function formatTime(s) {
  if (!s && s !== 0) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function LabResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isDark } = useTheme();
  const [showDetail, setShowDetail] = useState(false);
  const tagBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(14,116,144,0.06)";

  // Redirect if no state
  useEffect(() => {
    if (!state) {
      navigate("/technical-user/password-lab", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    success, score, attempts, time_taken_seconds, difficulty, mode, algorithm,
    hints_used, base_score, time_penalty, attempt_penalty, hint_penalty,
  } = state;

  const maxScore  = { beginner: 50, intermediate: 100, advanced: 200 }[difficulty] || 50;
  const diffColor = { beginner: "#00ffcc", intermediate: "#fbbf24", advanced: "#f87171" }[difficulty] || "#00bfff";

  const STATS = [
    { label: "Outcome",     value: success ? "✅ Cracked" : "⏱ Timed Out", color: success ? "#00ffcc" : "#f87171" },
    { label: "Final Score", value: `${score ?? 0} / ${maxScore}`,           color: "#00bfff" },
    { label: "Time Taken",  value: formatTime(time_taken_seconds),           color: "#a78bfa" },
    { label: "Attempts",    value: attempts ?? "—",                          color: "#fbbf24" },
  ];

  return (
    <>
      <style>{styles}</style>
      <TechLayout breadcrumb="Password Cracking Lab / Result">

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeUp 0.5s ease both" }}>
          <div style={{ fontSize: 64, marginBottom: 16, display: "inline-block", animation: "confettiPop 0.6s ease both" }}>
            {success ? "🏆" : "⏱️"}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px" }}>
            {success ? "Lab Completed!" : "Time's Up!"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: 0, lineHeight: 1.7 }}>
            Thank you for attempting the{" "}
            <strong style={{ color: diffColor, textTransform: "capitalize" }}>{difficulty}</strong> lab.
            {success
              ? " You successfully cracked the password."
              : " The timer expired before the password was cracked."}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, maxWidth: 560 }}>
          <button
            className="action-btn"
            onClick={() => setShowDetail(true)}
            style={{ background: "linear-gradient(135deg,#00bfff,#00e5ff)", color: "#000" }}
          >
            📊 View Result
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/technical-user/password-lab/leaderboard")}
            style={{ background: "transparent", border: "1px solid #00bfff", color: "#00bfff" }}
          >
            🏆 Go to Leaderboard
          </button>
        </div>

        {/* Detail */}
        {showDetail && (
          <div style={{ maxWidth: 720 }}>
            <div className="result-card" style={{ marginBottom: 20, animationDelay: "0.05s" }}>
              <h2 style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>
                Session Summary
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {STATS.map((s) => (
                  <div key={s.label} className="result-stat">
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-card" style={{ marginBottom: 20, animationDelay: "0.1s" }}>
              <h2 style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: "1px" }}>
                Session Details
              </h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Difficulty", value: difficulty, color: diffColor },
                  { label: "Mode",       value: mode,       color: "#a78bfa" },
                  { label: "Algorithm",  value: algorithm,  color: "#00bfff" },
                  hints_used != null && { label: "Hints Used", value: hints_used, color: "#fbbf24" },
                ].filter(Boolean).map((tag) => (
                  <div key={tag.label} style={{
                    padding: "6px 14px",
                    background: tagBg,
                    border: `1px solid ${tag.color}44`,
                    borderRadius: 8,
                    fontSize: 13,
                  }}>
                    <span style={{ color: "var(--text-muted)" }}>{tag.label}: </span>
                    <span style={{ color: tag.color, fontWeight: 600, textTransform: "capitalize" }}>{tag.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {base_score != null && (
              <div className="result-card" style={{ animationDelay: "0.15s" }}>
                <h2 style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Score Breakdown
                </h2>
                <ScoreCard
                  score={score}
                  maxScore={maxScore}
                  base={base_score}
                  timePenalty={time_penalty}
                  attemptPenalty={attempt_penalty}
                  hintPenalty={hint_penalty}
                />
              </div>
            )}
          </div>
        )}

        {/* Try again */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => { localStorage.removeItem("lab_progress"); navigate("/technical-user/password-lab"); }}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              padding: "10px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            🔄 Try Another Lab
          </button>
        </div>

      </TechLayout>
    </>
  );
}
