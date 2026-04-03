import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechLayout from "../../../../layouts/TechLayout";
import { getDifficulties } from "../../../../api/pcl";

const DIFF_COLORS = {
  beginner:     { accent: "#34d399", label: "Beginner" },
  intermediate: { accent: "#f59e0b", label: "Intermediate" },
  advanced:     { accent: "#f87171", label: "Advanced" },
};

export default function LabDashboard() {
  const navigate = useNavigate();
  const [difficulties, setDifficulties] = useState([]);
  const [selected, setSelected]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [starting, setStarting]         = useState(false);

  useEffect(() => {
    getDifficulties()
      .then((data) => setDifficulties(Array.isArray(data) ? data : data?.levels || []))
      .catch(() => setError("Failed to load difficulties. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = () => {
    if (!selected || starting) return;
    setStarting(true);
    navigate("/technical-user/password-lab/lab", { state: { difficulty: selected } });
  };

  return (
    <TechLayout breadcrumb="Password Cracking Lab">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Password Cracking Lab
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
        Choose your difficulty level to start the lab. You have 10 minutes per session.
      </p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading difficulties...</p>}
      {error   && <p style={{ color: "#f87171" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
          {difficulties.map((diff) => {
            const color = DIFF_COLORS[diff.id]?.accent || "#00bfff";
            const isSelected = selected === diff.id;
            return (
              <div
                key={diff.id}
                onClick={() => setSelected(diff.id)}
                style={{
                  background: isSelected ? `${color}14` : "var(--bg-card)",
                  border: `2px solid ${isSelected ? color : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{diff.title}</span>
                  <span style={{ fontSize: 11, color, fontFamily: "monospace" }}>
                    {diff.points} pts
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                  {diff.description}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${color}14`, border: `1px solid ${color}30`, color }}>
                    {diff.hash_algorithm?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${color}14`, border: `1px solid ${color}30`, color }}>
                    {diff.mode_label || diff.mode}
                  </span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${color}14`, border: `1px solid ${color}30`, color }}>
                    10 min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={!selected || starting}
        style={{
          padding: "14px 40px",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          cursor: selected ? "pointer" : "not-allowed",
          background: selected ? "linear-gradient(135deg,#00bfff,#00e5ff)" : "var(--bg-card)",
          color: selected ? "#000" : "var(--text-muted)",
          transition: "all 0.2s",
        }}
      >
        {starting ? "Starting..." : selected ? `🚀 Start ${selected} Lab` : "Select a difficulty"}
      </button>
    </TechLayout>
  );
}
