import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SEV = {
  CRITICAL: { color: "#ff6480", bg: "rgba(255,56,96,0.12)",  border: "rgba(255,56,96,0.3)"  },
  HIGH:     { color: "#fb923c", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" },
  MEDIUM:   { color: "#fbbf24", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)" },
  LOW:      { color: "#34d399", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)" },
  PASS:     { color: "#34d399", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)"  },
};

function SeverityBadge({ level }) {
  const cfg = SEV[level] || SEV.MEDIUM;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />{level}
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score >= 70 ? "#ff6480" : score >= 45 ? "#fb923c" : score >= 20 ? "#fbbf24" : "#34d399";
  const label = score >= 70 ? "CRITICAL" : score >= 45 ? "HIGH" : score >= 20 ? "MEDIUM" : "LOW";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "var(--text-sub)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Overall Risk Score</span>
        <span style={{ color, fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
      </div>
      <div style={{ background: "var(--track-bg)", borderRadius: 8, height: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, borderRadius: 8, background: `linear-gradient(90deg, ${color}88, ${color})`, transition: "width 1s ease" }} />
      </div>
      <div style={{ textAlign: "right", marginTop: 4, color, fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
        {score}<span style={{ fontSize: 14, color: "var(--text-faint)" }}>/100</span>
      </div>
    </div>
  );
}

function StatPill({ count, label, color }) {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 70 }}>
      <div style={{ color, fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{count}</div>
      <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
    </div>
  );
}

function FindingCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const cfg = SEV[item.severity] || SEV.MEDIUM;
  const categoryIcon = { "Open Port": "🔌", "Missing Header": "🛡️", "Vulnerability": "⚠️" }[item.category] || "🔍";

  return (
    <div style={{ border: `1px solid ${cfg.border}`, borderRadius: 12, background: cfg.bg, marginBottom: 10, overflow: "hidden", transition: "all 0.2s" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", cursor: "pointer" }}>
        <span style={{ fontSize: 18 }}>{categoryIcon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.item}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{item.category} · MITRE {item.mitre}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SeverityBadge level={item.severity} />
          <span style={{ color: "var(--text-sub)", fontSize: 12, background: "var(--bg-card-faint)", padding: "3px 8px", borderRadius: 6, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{item.risk_score} pts</span>
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${cfg.border}` }}>
          <div style={{ marginTop: 14 }}>
            <div style={{ color: "var(--text-faint)", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>WHY IT MATTERS</div>
            <div style={{ background: "var(--bg-card-faint)", borderRadius: 8, padding: "10px 14px", color: "var(--text-sub)", fontSize: 13, lineHeight: 1.6 }}>{item.reason}</div>
          </div>
          {item.recommendation && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ color: "var(--text-faint)", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>HOW TO FIX</div>
                <button
                  onClick={() => { navigator.clipboard.writeText(item.recommendation); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {copied ? "✓ Copied" : "Copy Fix"}
                </button>
              </div>
              <pre style={{ background: "var(--bg-input)", borderRadius: 8, padding: "10px 14px", color: "#7dd3fc", fontSize: 12, lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid rgba(56,189,248,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>
                {item.recommendation}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SecurityScorecard({ data, target }) {
  const [activeTab,      setActiveTab]      = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  if (!data) return null;
  const { scorecard } = data;
  const breakdown = scorecard?.breakdown || [];

  const tabs = [
    { id: "all",      label: "All Findings", count: breakdown.length              },
    { id: "CRITICAL", label: "Critical",     count: scorecard.critical_count      },
    { id: "HIGH",     label: "High",         count: scorecard.high_count          },
    { id: "MEDIUM",   label: "Medium",       count: scorecard.medium_count        },
    { id: "LOW",      label: "Low",          count: scorecard.low_count           },
  ];
  const categories = ["all", "Open Port", "Missing Header", "Vulnerability"];
  const filtered = breakdown.filter(item => {
    const tabMatch = activeTab === "all" || item.severity === activeTab;
    const catMatch = activeCategory === "all" || item.category === activeCategory;
    return tabMatch && catMatch;
  });

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text)" }}>

      {/* Score header */}
      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 16, padding: "28px 28px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ color: "var(--accent)", opacity: 0.6, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>SECURITY SCORECARD</div>
            <div style={{ color: "var(--text)", fontSize: 20, fontWeight: 700 }}>{target}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => { const el = document.createElement("a"); el.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2)); el.download = `cybercare-scan-${target}.json`; el.click(); }}
              style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
            >↓ Export JSON</button>
            <button
              onClick={() => navigate("/technical-user/attack-graph")}
              style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.3)", color: "#818cf8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
            >Model in Attack Graph →</button>
          </div>
        </div>
        <ScoreBar score={scorecard.total_score} />
        {scorecard.summary && (
          <div style={{ marginTop: 16, background: "var(--bg-card-faint)", borderRadius: 10, padding: "12px 16px", color: "var(--text-sub)", fontSize: 13, lineHeight: 1.6, borderLeft: "3px solid #38bdf8" }}>
            {scorecard.summary}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <StatPill count={scorecard.critical_count} label="Critical" color="#ff6480" />
          <StatPill count={scorecard.high_count}     label="High"     color="#fb923c" />
          <StatPill count={scorecard.medium_count}   label="Medium"   color="#fbbf24" />
          <StatPill count={scorecard.low_count}      label="Low"      color="#34d399" />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? "rgba(56,189,248,0.15)" : "var(--bg-card-faint)", border: activeTab === tab.id ? "1px solid rgba(56,189,248,0.4)" : "1px solid var(--border)", color: activeTab === tab.id ? "#38bdf8" : "var(--text-muted)", fontFamily: "inherit" }}>
            {tab.label} {tab.count > 0 && tab.count}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: activeCategory === cat ? "rgba(34,197,94,0.12)" : "transparent", border: activeCategory === cat ? "1px solid rgba(34,197,94,0.35)" : "1px solid var(--border)", color: activeCategory === cat ? "#34d399" : "var(--text-muted)", fontFamily: "inherit" }}>
              {cat === "all" ? "All Types" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Findings */}
      <div>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", background: "var(--bg-card-faint)", borderRadius: 12, border: "1px dashed rgba(56,189,248,0.15)" }}>No findings in this category.</div>
          : filtered.map((item, i) => <FindingCard key={i} item={item} />)
        }
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 20, padding: "20px 24px", background: "var(--footer-card-bg)", border: "1px solid var(--footer-card-border)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ready to go deeper?</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Practice exploiting these vulnerabilities in Security Labs, then model the full attack chain.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/technical-user/security-labs")} style={{ background: "rgba(255,56,96,0.12)", border: "1px solid rgba(255,56,96,0.25)", color: "#ff6480", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Practice in SQLi Lab →</button>
          <button onClick={() => navigate("/technical-user/attack-graph")}  style={{ background: "rgba(56,189,248,0.1)",  border: "1px solid rgba(56,189,248,0.25)",  color: "#38bdf8", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Model in Attack Graph →</button>
        </div>
      </div>
    </div>
  );
}
