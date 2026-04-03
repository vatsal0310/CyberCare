// frontend/src/components/soc/DebriefModal.jsx
const FONT = "'JetBrains Mono', monospace";

export default function DebriefModal({ logs, onClose, onReset }) {
  const total    = logs.length;
  const resolved = logs.filter(l => l.status === "resolved").length;
  const missed   = logs.filter(l => l.status === "missed").length;
  const rate     = total === 0 ? 0 : Math.round((resolved / total) * 100);

  let grade, gradeColor, feedback;
  if      (total === 0)    { grade = "—";  gradeColor = "var(--text-faint)"; feedback = "No threats detected during this shift."; }
  else if (rate === 100)   { grade = "A+"; gradeColor = "#34d399";           feedback = "Flawless defense. All threats were intercepted and neutralized."; }
  else if (rate >= 80)     { grade = "B";  gradeColor = "#38bdf8";           feedback = "Solid performance. You stopped the vast majority of threats."; }
  else if (rate >= 60)     { grade = "C";  gradeColor = "#fbbf24";           feedback = "Average performance. Too many threats slipped through the network."; }
  else                     { grade = "F";  gradeColor = "#ff6480";           feedback = "Sub-optimal triage. The network suffered multiple critical breaches."; }

  const stats = [
    { label: "Total Threats", value: total,    color: "var(--text)"  },
    { label: "Neutralized",   value: resolved, color: "#34d399"      },
    { label: "Breaches",      value: missed,   color: "#ff6480"      },
    { label: "Success Rate",  value: `${rate}%`, color: "#38bdf8"    },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, backdropFilter: "blur(6px)", padding: 16 }}>
      <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: 14, width: "100%", maxWidth: 580, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "var(--bg-deep)", padding: "18px 24px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", letterSpacing: 2, fontFamily: FONT }}>POST-INCIDENT DEBRIEF</div>
          <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: FONT, marginTop: 4 }}>Simulation Complete — Automated Performance Review</div>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Grade card */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 2, marginBottom: 6 }}>SOC GRADE</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: gradeColor, lineHeight: 1, fontFamily: FONT }}>{grade}</div>
            </div>
            <div style={{ width: 1, height: 64, background: "var(--border)" }} />
            <div>
              <div style={{ fontSize: 11, color: "var(--text-sub)", fontFamily: FONT, marginBottom: 6, letterSpacing: 1 }}>COMMANDER'S ASSESSMENT</div>
              <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>{feedback}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 0", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: FONT }}>{s.value}</div>
                <div style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: 2, fontFamily: FONT, marginTop: 4 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "var(--bg-deep)", padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{ fontSize: 10, padding: "8px 20px", borderRadius: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontFamily: FONT }}>Review Logs</button>
          <button onClick={() => { onReset(); onClose(); }} style={{ fontSize: 10, padding: "8px 20px", borderRadius: 6, background: "linear-gradient(135deg,#1d4ed8,#0369a1)", border: "none", color: "#fff", cursor: "pointer", fontFamily: FONT, fontWeight: 700 }}>Start New Shift</button>
        </div>
      </div>
    </div>
  );
}