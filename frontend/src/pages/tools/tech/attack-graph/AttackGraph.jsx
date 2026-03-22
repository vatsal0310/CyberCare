import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechLayout from "../../../../layouts/TechLayout";
import { useAttackGraph } from "./useAttackGraph";
import GraphCanvas from "./GraphCanvas";
import AttackSidebar from "./AttackSidebar";
import AnalysisPanel from "./AnalysisPanel";

const FONT = "'JetBrains Mono', monospace";

export default function AttackGraph() {
  const navigate = useNavigate();
  const {
    scenario, scenarios, assets, connections, analysis, loading, error, setError,
    fetchScenarios, createScenario, loadScenario, deleteScenario,
    addAsset, removeAsset, addConnection, runAnalysis,
  } = useAttackGraph();

  const [scenarioName,  setScenarioName]  = useState("");
  const [view,          setView]          = useState("landing");
  const [showScenarios, setShowScenarios] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (error) { alert(`Error: ${error}`); setError(null); }
  }, [error, setError]);

  const handleCreate = async () => {
    if (!scenarioName.trim()) return;
    await createScenario(scenarioName);
    setView("canvas");
  };

  const handleLoad = async (s) => {
    await loadScenario(s);
    setShowScenarios(false);
    setView("canvas");
  };

  const handleOpenScenarios = async () => {
    await fetchScenarios();
    setShowScenarios(true);
  };

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // ── Modals ──────────────────────────────────────────────────────────────────
  const ScenariosModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, width: 520, maxHeight: "80vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--accent)", fontSize: 13, letterSpacing: 2, fontFamily: FONT }}>MY SCENARIOS</span>
          <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }} onClick={() => setShowScenarios(false)}>✕</button>
        </div>
        {scenarios.length === 0
          ? <div style={{ color: "var(--text-faint)", textAlign: "center", padding: "24px 0", fontFamily: FONT, fontSize: 12 }}>No scenarios yet.</div>
          : scenarios.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--bg-row)", borderRadius: 8, border: "1px solid var(--border-row)" }}>
              <div>
                <div style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: "var(--text-faint)", fontSize: 11, fontFamily: FONT }}>{formatDate(s.created_at)}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "linear-gradient(135deg, #1d4ed8, #0369a1)", color: "#fff", border: "none", padding: "7px 18px", borderRadius: 5, cursor: "pointer", fontFamily: FONT, fontSize: 12 }} onClick={() => handleLoad(s)}>Load</button>
                <button style={{ background: "transparent", color: "#ff6480", border: "1px solid rgba(255,100,128,0.3)", padding: "7px 14px", borderRadius: 5, cursor: "pointer", fontFamily: FONT, fontSize: 12 }} onClick={() => setConfirmDelete(s)}>Delete</button>
              </div>
            </div>
          ))
        }
        <button
          style={{ background: "linear-gradient(135deg, #1d4ed8, #0369a1)", color: "#fff", border: "none", padding: "12px 0", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 13 }}
          onClick={() => { setShowScenarios(false); setView("create"); }}
        >
          + Create New Scenario
        </button>
      </div>
    </div>
  );

  const ConfirmModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, width: 380, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ color: "#ff6480", fontSize: 13, letterSpacing: 2, fontFamily: FONT, marginBottom: 4 }}>DELETE SCENARIO</div>
        <p style={{ color: "var(--text-sub)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Delete <span style={{ color: "var(--accent)" }}>"{confirmDelete?.name}"</span>? This removes all assets, connections and analysis.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "10px 0", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12 }}
            onClick={() => setConfirmDelete(null)}
          >Cancel</button>
          <button
            style={{ flex: 1, background: "linear-gradient(135deg, #8a0d1a, #cf1a2a)", border: "none", color: "#fff", padding: "10px 0", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12 }}
            onClick={async () => { await deleteScenario(confirmDelete.id); setConfirmDelete(null); }}
          >Yes, Delete</button>
        </div>
      </div>
    </div>
  );

  // ── Landing / Create ────────────────────────────────────────────────────────
  if (view === "landing" || view === "create") return (
    <TechLayout activeTool="attack" onSelect={(id) => id ? navigate(`/technical-user/${id}`) : navigate("/technical-user")} onLogout={() => navigate("/")}>
      {showScenarios && <ScenariosModal />}
      {confirmDelete  && <ConfirmModal />}

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header badge */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, fontFamily: FONT }}>SECURITY ARCHITECTURE TOOL</span>
          </div>

          {/* Heading — uses theme-heading class so it works in both themes */}
          <h1 className="theme-heading" style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.2 }}>
            Design Your System.
          </h1>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", lineHeight: 1.2, color: "var(--accent)" }}>
            See How It Breaks.
          </h1>

          <p style={{ color: "var(--text-sub)", fontSize: 14, maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Build your architecture visually, auto-discover every attack path, map threats to MITRE ATT&CK, score risks using STRIDE, and generate a full threat report.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setView("create")} style={btn.primary}>▶ Start Threat Modeling</button>
            <button onClick={handleOpenScenarios} style={btn.outline}>📂 Load Existing Scenario</button>
          </div>
        </div>

        {/* Create form */}
        {view === "create" && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            <div style={{ color: "var(--accent)", fontSize: 13, letterSpacing: 2, fontFamily: FONT, marginBottom: 16 }}>NEW SCENARIO</div>
            <input
              value={scenarioName}
              onChange={e => setScenarioName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="e.g. E-Commerce Platform"
              autoFocus
              className="theme-input"
              style={{ width: "100%", boxSizing: "border-box", borderRadius: 8, padding: "12px 16px", fontFamily: FONT, fontSize: 13, outline: "none", marginBottom: 12 }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--input-border)"}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setView("landing")} style={btn.ghost}>Cancel</button>
              <button onClick={handleCreate} disabled={loading || !scenarioName.trim()} style={{ ...btn.primary, flex: 1 }}>
                {loading ? "Creating..." : "▶ Start Modeling"}
              </button>
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="theme-card"
              style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </TechLayout>
  );

  // ── Canvas View ─────────────────────────────────────────────────────────────
  return (
    <TechLayout activeTool="attack" onSelect={(id) => id ? navigate(`/technical-user/${id}`) : navigate("/technical-user")} onLogout={() => navigate("/")}>
      {showScenarios && <ScenariosModal />}
      {confirmDelete  && <ConfirmModal />}

      {/* Scenario topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => setView("landing")} style={btn.ghost}>← Back</button>
        <span style={{ color: "var(--accent)", fontFamily: FONT, fontSize: 12 }}>🔷 {scenario?.name}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={handleOpenScenarios} style={btn.ghost}>📂 Scenarios</button>
          <button onClick={() => scenario && runAnalysis(scenario.id)} disabled={loading || !scenario} style={btn.primary}>
            {loading ? "Analyzing..." : "▶ RUN ANALYSIS"}
          </button>
        </div>
      </div>

      {/* Canvas layout */}
      <div style={{ display: "flex", gap: 16, height: "calc(100vh - 220px)" }}>
        <AttackSidebar
          scenario={scenario}
          assets={assets}
          loading={loading}
          onAddAsset={(d) => scenario && addAsset(scenario.id, d)}
          onAddConnection={(d) => scenario && addConnection(scenario.id, d)}
        />
        <GraphCanvas
          assets={assets}
          connections={connections}
          analysisResults={analysis}
          onDeleteAsset={removeAsset}
          onConnect={(src, tgt) => scenario && addConnection(scenario.id, { source_id: src, target_id: tgt, protocol: "HTTPS" })}
        />
        <AnalysisPanel analysis={analysis} loading={loading} scenario={scenario} />
      </div>

      {/* Status bar */}
      {scenario && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 11, color: "var(--text-faint)" }}>
          <span style={{ color: "var(--accent)" }}>{scenario.name}</span>
          <span>·</span>
          <span>{assets.length} assets · {connections.length} connections</span>
        </div>
      )}
    </TechLayout>
  );
}

const btn = {
  primary: { background: "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "1px solid rgba(56,189,248,0.3)", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
  outline:  { background: "transparent", border: "1px solid var(--border-hover)", color: "var(--accent)", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
  ghost:    { background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" },
};

const FEATURES = [
  { icon: "🗺️", title: "Visual Architecture Canvas",      desc: "Drag and drop assets onto an interactive canvas. Define connections and trust boundaries." },
  { icon: "⚡", title: "Automated Attack Path Discovery",  desc: "DFS/BFS graph engine enumerates every attack path from public entry points to sensitive targets." },
  { icon: "🎯", title: "STRIDE Threat Mapping",            desc: "Every asset and path is automatically mapped to Microsoft's STRIDE threat model." },
  { icon: "🔴", title: "MITRE ATT&CK Alignment",           desc: "Attack paths tagged with real MITRE ATT&CK technique IDs." },
  { icon: "📊", title: "Risk Scoring Engine",              desc: "Each path gets a risk score (0-10) from likelihood × impact." },
  { icon: "📄", title: "Export Threat Report",             desc: "Generate a full threat report as PDF or JSON." },
];
