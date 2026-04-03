import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechLayout from "../../../../layouts/TechLayout";
import { getLeaderboard, getLeaderboardByDifficulty, getMyLeaderboardPosition } from "../../../../api/pcl";

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const TABS = [
  { key: "all",          label: "🌐 All" },
  { key: "beginner",     label: "🟢 Beginner" },
  { key: "intermediate", label: "🟡 Intermediate" },
  { key: "advanced",     label: "🔴 Advanced" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LabLeaderboard() {
  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState("all");
  const [users,      setUsers]      = useState([]);
  const [myPosition, setMyPosition] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  let currentUsername = null;
  try {
    const stored = localStorage.getItem("cybercare_user");
    if (stored) currentUsername = JSON.parse(stored)?.username;
  } catch { /* ignore */ }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = activeTab === "all"
          ? await getLeaderboard(20)
          : await getLeaderboardByDifficulty(activeTab, 20);
        // Backend returns { leaderboard: [...], total_shown, difficulty_filter }
        // Guard against any unexpected shape — always store an array
        let entries = [];
        if (Array.isArray(raw)) {
          entries = raw;
        } else if (raw && Array.isArray(raw.leaderboard)) {
          entries = raw.leaderboard;
        }
        setUsers(entries);
      } catch {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    getMyLeaderboardPosition()
      .then(setMyPosition)
      .catch(() => {});
  }, []);

  return (
    <TechLayout breadcrumb="Password Cracking Lab / Leaderboard">
      <h2 style={{ marginBottom: 6 }}>🏆 Leaderboard</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 13 }}>
        Top scores across all difficulty levels
      </p>

      {/* My position banner */}
      {myPosition && (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid #00bfff33",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          maxWidth: 720,
        }}>
          <span style={{ color: "var(--text-muted)" }}>Your rank</span>
          <span>
            <strong style={{ color: "#00bfff", fontSize: 18 }}>#{myPosition.rank}</strong>
            <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>of {myPosition.total_players ?? myPosition.total_entries ?? "?"}</span>
          </span>
          <span style={{ color: "#00ff88", fontWeight: "bold" }}>{myPosition.total_score ?? myPosition.score ?? 0} pts</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab.key ? "#00bfff" : "transparent",
              color: activeTab === tab.key ? "#000" : "var(--text-muted)",
              border: `1px solid ${activeTab === tab.key ? "#00bfff" : "var(--border)"}`,
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: activeTab === tab.key ? "bold" : "normal",
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "50px 1fr 90px 80px 80px",
        gap: 10,
        padding: "8px 14px",
        fontSize: 11,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid var(--border)",
        maxWidth: 720,
      }}>
        <span>Rank</span>
        <span>Player</span>
        <span style={{ textAlign: "right" }}>Score</span>
        <span style={{ textAlign: "right" }}>Time</span>
        <span style={{ textAlign: "right" }}>Mode</span>
      </div>

      {loading && <p style={{ color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>Loading...</p>}
      {error   && <p style={{ color: "#f87171", padding: "20px 0" }}>{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p style={{ color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>
          No scores yet for this category.
        </p>
      )}

      {!loading && !error && Array.isArray(users) && users.map((entry, index) => {
        const isMe     = entry.username && entry.username === currentUsername;
        const isTop3   = index < 3;
        const rankLabel = isTop3 ? MEDALS[index] : `#${entry.rank ?? index + 1}`;

        return (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr 90px 80px 80px",
              gap: 10,
              padding: "12px 14px",
              borderBottom: "1px solid var(--border)",
              borderRadius: 6,
              background: isMe ? "rgba(0,191,255,0.05)" : "transparent",
              border: isMe ? "1px solid #00bfff44" : "1px solid transparent",
              fontSize: 14,
              alignItems: "center",
              maxWidth: 720,
              transition: "background 0.1s",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: isTop3 ? 18 : 14, textAlign: "center" }}>
              {rankLabel}
            </span>
            <span style={{ fontWeight: isMe ? "bold" : "normal", color: isMe ? "#00bfff" : "var(--text)" }}>
              {entry.username || `User #${entry.user_id}`}
              {isMe && <span style={{ fontSize: 11, color: "#00bfff", marginLeft: 6 }}>(you)</span>}
            </span>
            <span style={{ textAlign: "right", color: isTop3 ? "#facc15" : "var(--text)", fontWeight: isTop3 ? "bold" : "normal" }}>
              {entry.score} pts
            </span>
            <span style={{ textAlign: "right", color: "var(--text-muted)", fontSize: 13 }}>
              {formatTime(entry.time_seconds)}
            </span>
            <span style={{ textAlign: "right", color: "var(--text-muted)", fontSize: 12, textTransform: "capitalize" }}>
              {entry.mode || "—"}
            </span>
          </div>
        );
      })}

      <div style={{ marginTop: 28 }}>
        <button
          onClick={() => navigate("/technical-user/password-lab")}
          style={{ padding: "11px 24px", background: "#00bfff", color: "#000", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", fontSize: 14 }}
        >
          Start a Lab →
        </button>
      </div>
    </TechLayout>
  );
}