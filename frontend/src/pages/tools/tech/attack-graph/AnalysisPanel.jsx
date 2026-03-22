import { useState } from "react";
import { SEVERITY_COLORS } from "./constants";

const FONT = "'JetBrains Mono', monospace";

function SevBadge({ sev }) {
  const c = SEVERITY_COLORS[sev] || "#38bdf8";
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${c}18`, border: `1px solid ${c}44`, color: c, fontFamily: FONT, letterSpacing: 1 }}>
      {sev?.toUpperCase()}
    </span>
  );
}

function PathCard({ path, i }) {
  const [open, setOpen] = useState(false);
  const c = SEVERITY_COLORS[path.severity] || "#38bdf8";
  return (
    <div style={{ border: `1px solid ${c}33`, borderRadius: 8, background: `${c}08`, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer" }}>
        <span style={{ color: "var(--text-faint)", fontSize: 10, fontFamily: FONT, minWidth: 24 }}>P{i + 1}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "var(--text)", fontSize: 11, fontFamily: FONT, marginBottom: 3 }}>{path.path_sequence?.join(" → ")}</div>
          <SevBadge sev={path.severity} />
        </div>
        <span style={{ color: c, fontFamily: FONT, fontSize: 12, fontWeight: 700 }}>{path.risk_score?.toFixed(1)}</span>
        <span style={{ color: "var(--text-faint)", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${c}22` }}>
          {path.stride_threats?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ color: "var(--text-faint)", fontSize: 9, letterSpacing: 2, fontFamily: FONT, marginBottom: 4 }}>STRIDE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {path.stride_threats.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.25)", color: "#fb923c", fontFamily: FONT }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {path.mitre_techniques?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ color: "var(--text-faint)", fontSize: 9, letterSpacing: 2, fontFamily: FONT, marginBottom: 4 }}>MITRE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {path.mitre_techniques.map(t => (
                  <span key={t} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8", fontFamily: FONT }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalysisPanel({ analysis, loading, scenario }) {
  const exportJSON = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${scenario?.name || "attack-graph"}_report.json`;
    a.click();
  };

  return (
    <div
      className="theme-card"
      style={{ width: 300, border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}
    >
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-deep)" }}>
        <span style={{ color: "var(--accent)", fontSize: 11, letterSpacing: 2, fontFamily: FONT }}>THREAT ANALYSIS</span>
        {analysis && (
          <button
            onClick={exportJSON}
            style={{ background: "transparent", border: "1px solid var(--border-hover)", color: "var(--accent)", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: FONT, fontSize: 10 }}
          >↓ JSON</button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 24, height: 24, border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ color: "var(--text-muted)", fontSize: 11, fontFamily: FONT }}>ANALYZING...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && !analysis && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-faint)", fontSize: 11, fontFamily: FONT, lineHeight: 1.8 }}>
            Add assets and connections,<br />then run analysis.
          </div>
        )}

        {!loading && analysis && (
          <>
            {/* Summary pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ background: "rgba(var(--accent-rgb),0.08)", border: "1px solid rgba(var(--accent-rgb),0.15)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: "var(--accent)", fontSize: 24, fontWeight: 800, fontFamily: FONT }}>{analysis.total_paths}</div>
                <div style={{ color: "var(--text-faint)", fontSize: 9, letterSpacing: 2, fontFamily: FONT }}>PATHS</div>
              </div>
              <div style={{ background: `${SEVERITY_COLORS[analysis.attack_paths?.[0]?.severity] || "var(--accent)"}12`, border: `1px solid ${SEVERITY_COLORS[analysis.attack_paths?.[0]?.severity] || "var(--accent)"}25`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ color: SEVERITY_COLORS[analysis.attack_paths?.[0]?.severity] || "var(--accent)", fontSize: 24, fontWeight: 800, fontFamily: FONT }}>{analysis.highest_risk?.toFixed(1)}</div>
                <div style={{ color: "var(--text-faint)", fontSize: 9, letterSpacing: 2, fontFamily: FONT }}>RISK</div>
              </div>
            </div>

            <div style={{ color: "var(--text-faint)", fontSize: 9, letterSpacing: 2, fontFamily: FONT, marginBottom: 10 }}>ATTACK PATHS</div>
            {analysis.attack_paths?.map((p, i) => <PathCard key={p.id} path={p} i={i} />)}
          </>
        )}
      </div>
    </div>
  );
}
