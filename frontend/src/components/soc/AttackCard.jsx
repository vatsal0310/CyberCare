// frontend/src/components/soc/AttackCard.jsx
export default function AttackCard({ title, target, attackType, activeAttack, onLaunch, severity, successRate }) {
  const isSimulating = activeAttack === attackType;
  const isDisabled   = activeAttack !== null && !isSimulating;

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 13, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Target: <span style={{ color: "var(--text-sub)" }}>{target}</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: severity === "High" ? "rgba(255,100,128,0.12)" : "rgba(251,146,60,0.12)", color: severity === "High" ? "#ff6480" : "#fb923c", border: `1px solid ${severity === "High" ? "rgba(255,100,128,0.3)" : "rgba(251,146,60,0.3)"}`, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>
            {severity.toUpperCase()}
          </span>
          <button
            onClick={() => onLaunch(attackType, target)}
            disabled={isDisabled || isSimulating}
            style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: isDisabled || isSimulating ? "not-allowed" : "pointer", opacity: isDisabled ? 0.4 : 1, background: isSimulating ? "rgba(255,100,128,0.1)" : "transparent", color: isSimulating ? "#ff6480" : "var(--text-muted)", border: `1px solid ${isSimulating ? "rgba(255,100,128,0.3)" : "var(--border)"}`, fontFamily: "'JetBrains Mono',monospace", transition: "all 0.2s" }}
          >
            {isSimulating ? "Executing..." : "Launch →"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace", width: 90 }}>Success Rate:</span>
        <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: successRate, background: isSimulating ? "#ff6480" : "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <span style={{ fontSize: 10, color: "#34d399", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{successRate}</span>
      </div>
    </div>
  );
}