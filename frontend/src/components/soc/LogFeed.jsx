// frontend/src/components/soc/LogFeed.jsx
import { useState } from "react";

const FONT = "'JetBrains Mono', monospace";

const SEV_STYLE = {
  High:   { background: "rgba(255,100,128,0.1)", color: "#ff6480",  border: "1px solid rgba(255,100,128,0.3)" },
  Medium: { background: "rgba(251,146,60,0.1)",  color: "#fb923c",  border: "1px solid rgba(251,146,60,0.3)"  },
  Low:    { background: "rgba(52,211,153,0.1)",  color: "#34d399",  border: "1px solid rgba(52,211,153,0.3)"  },
};

export default function LogFeed({ logs, onRespondClick }) {
  const [filterSev,  setFilterSev]  = useState("All");
  const [showMissed, setShowMissed] = useState(false);
  const [sortOrder,  setSortOrder]  = useState("latest");

  if (!Array.isArray(logs)) return null;

  const active   = logs.filter(l => l.status === "active");
  const resolved = logs.filter(l => l.status === "resolved");
  const missed   = logs.filter(l => l.status === "missed");

  const exportCSV = () => {
    const rows = [...resolved, ...missed];
    if (!rows.length) return alert("No closed incidents to export yet.");
    const header = ["ID","Timestamp","Attack Type","Source IP","Target","Severity","Status"];
    const csv    = [header, ...rows.map(l => [l.id, new Date(l.timestamp).toLocaleString(), l.attack_type, l.source_ip, l.target, l.severity, l.status.toUpperCase()])].map(r => r.join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `SOC_Report_${Date.now()}.csv` });
    a.click();
  };

  const displayed = (showMissed ? missed : active)
    .filter(l => filterSev === "All" || l.severity === filterSev)
    .sort((a, b) => sortOrder === "severity"
      ? ({ High: 3, Medium: 2, Low: 1 }[b.severity] - { High: 3, Medium: 2, Low: 1 }[a.severity])
      : new Date(b.timestamp) - new Date(a.timestamp));

  const kpis = [
    { label: "Detected",  value: active.length,   color: "#ff6480"  },
    { label: "Missed",    value: missed.length,    color: "#fb923c"  },
    { label: "Resolved",  value: resolved.length,  color: "#34d399"  },
    { label: "Total",     value: logs.length,      color: "var(--accent)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 0", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: FONT }}>{k.value}</div>
            <div style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: 2, fontFamily: FONT, marginTop: 3 }}>{k.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
        <span style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 2, fontFamily: FONT }}>LIVE SIEM ALERT FEED</span>
        <button onClick={exportCSV} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 5, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontFamily: FONT }}>↓ Export CSV</button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px" }}>
        <span style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 1 }}>FILTER:</span>
        {["All","High","Medium","Low"].map(s => (
          <button key={s} onClick={() => { setFilterSev(s); setShowMissed(false); }} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, background: filterSev === s && !showMissed ? "rgba(var(--accent-rgb),0.15)" : "transparent", color: filterSev === s && !showMissed ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${filterSev === s && !showMissed ? "rgba(var(--accent-rgb),0.4)" : "var(--border)"}` }}>
            {s}
          </button>
        ))}
        <button onClick={() => setShowMissed(true)} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, background: showMissed ? "rgba(255,100,128,0.1)" : "transparent", color: showMissed ? "#ff6480" : "var(--text-muted)", border: `1px solid ${showMissed ? "rgba(255,100,128,0.3)" : "var(--border)"}` }}>
          Breaches
        </button>
        <div style={{ marginLeft: "auto" }}>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: FONT, outline: "none" }}>
            <option value="latest">Newest First</option>
            <option value="severity">Critical First</option>
          </select>
        </div>
      </div>

      {/* Log list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-faint)", fontSize: 11, fontFamily: FONT }}>
            {showMissed ? "No breaches recorded. Excellent defense." : "Network secure. Awaiting threat telemetry..."}
          </div>
        ) : displayed.map(log => (
          <div key={log.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT }}>{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "—"}</span>
                <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 8, fontFamily: FONT, letterSpacing: 1, ...SEV_STYLE[log.severity] }}>{log.severity?.toUpperCase()}</span>
                {log.status === "missed" && <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 8, background: "rgba(255,100,128,0.1)", color: "#ff6480", border: "1px solid rgba(255,100,128,0.3)", fontFamily: FONT }}>BREACHED</span>}
              </div>
              <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 12, marginBottom: 2 }}>{log.attack_type}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: FONT }}>{log.source_ip} → {log.target}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2, fontFamily: FONT }}>Payload: <span style={{ color: "#38bdf8" }}>{log.payload}</span></div>
            </div>
            {log.status === "active" && (
              <button onClick={() => onRespondClick(log)} style={{ fontSize: 10, padding: "6px 14px", borderRadius: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>
                Inspect →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}