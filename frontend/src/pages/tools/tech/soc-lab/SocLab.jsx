// frontend/src/pages/tech/soc-lab/SocLab.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechLayout   from "../../../../layouts/TechLayout";
import AttackCard   from "../../../../components/soc/AttackCard";
import LogFeed      from "../../../../components/soc/LogFeed";
import RespondModal from "../../../../components/soc/RespondModal";
import DebriefModal from "../../../../components/soc/DebriefModal";
import { socApi }   from "../../../../api/socApi";

const FONT = "'JetBrains Mono', monospace";

const ATTACKS = [
  { title: "SQL Injection Probe",   target: "Web App Login",  attackType: "SQL Injection",       severity: "High",   successRate: "89%" },
  { title: "Brute Force SSH",       target: "Server 10.0.1.5",attackType: "Brute Force",         severity: "Medium", successRate: "42%" },
  { title: "XSS Payload Delivery",  target: "Comment Form",   attackType: "Cross-Site Scripting",severity: "High",   successRate: "71%" },
];

export default function SocLab() {
  const navigate = useNavigate();

  const [hasStarted,    setHasStarted]    = useState(false);
  const [activeTab,     setActiveTab]     = useState("red");
  const [logs,          setLogs]          = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDebrief,   setShowDebrief]   = useState(false);
  const [activeAttack,  setActiveAttack]  = useState(null);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [error,         setError]         = useState("");

  const fetchLogs = async () => {
    try { setLogs(await socApi.getLogs()); }
    catch (e) { setError(e.message); }
  };

  // Poll logs every 2.5s when on blue tab
  useEffect(() => {
    let interval;
    if (hasStarted && activeTab === "blue") {
      fetchLogs();
      interval = setInterval(fetchLogs, 2500);
    }
    return () => clearInterval(interval);
  }, [activeTab, hasStarted]);

  const handleLaunchAttack = async (attackType, target) => {
    setActiveAttack(attackType);
    try { await socApi.launchAttack(attackType, target); }
    catch (e) { setError(e.message); }
    finally { setTimeout(() => setActiveAttack(null), 2000); }
  };

  const handleChaos = async () => {
    setIsChaosActive(true);
    try { await socApi.launchChaos(); }
    catch (e) { setError(e.message); }
    finally { setTimeout(() => setIsChaosActive(false), 4000); }
  };

  const handleRespond = async (action) => {
    try {
      await socApi.respond(selectedAlert.id, action);
      setSelectedAlert(null);
      fetchLogs();
    } catch (e) { setError(e.message); }
  };

  const handleReset = async () => {
    try { await socApi.reset(); fetchLogs(); }
    catch (e) { setError(e.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem("cybercare_token");
    localStorage.removeItem("cybercare_user");
    navigate("/");
  };

  // ── Mission Briefing ─────────────────────────────────────────────────────
  if (!hasStarted) return (
    <TechLayout onLogout={handleLogout} breadcrumb="SOC / Red-Blue Lab">
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, fontFamily: FONT }}>LIVE ATTACK SIMULATION</span>
          </div>
          <h1 className="theme-heading" style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px" }}>Red Team vs Blue Team.</h1>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: "var(--accent)" }}>Attack and Defend.</h1>
          <p style={{ color: "var(--text-sub)", fontSize: 14, maxWidth: 540, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Play both sides of a live cyberattack. Launch exploits as the Red Team, then switch to the Blue Team SOC to detect, triage, and neutralize threats in real time.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[
            { color: "#ff6480", icon: "⚔️", label: "RED TEAM", title: "The Attacker", points: ["Launch SQL Injections & XSS", "Execute Brute Force Attacks", "Initiate Automated Chaos Campaigns"] },
            { color: "#38bdf8", icon: "🛡️", label: "BLUE TEAM", title: "The SOC Analyst", points: ["Monitor Live SIEM Alert Feed", "Perform Deep Packet Inspection", "Neutralize Threats with SOC Playbooks"] },
          ].map(({ color, icon, label, title, points }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: `1px solid ${color}25`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 9, color, fontFamily: FONT, letterSpacing: 2 }}>{label}</div>
                  <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>{title}</div>
                </div>
              </div>
              {points.map(p => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setHasStarted(true)}
            style={{ background: "linear-gradient(135deg,#1d4ed8,#0369a1)", border: "1px solid rgba(56,189,248,0.3)", color: "#fff", borderRadius: 10, padding: "13px 36px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT, letterSpacing: 1 }}
          >
            ▶ ENTER SIMULATION LAB
          </button>
        </div>
      </div>
    </TechLayout>
  );

  // ── Main Simulation Dashboard ─────────────────────────────────────────────
  return (
    <TechLayout onLogout={handleLogout} breadcrumb="SOC / Red-Blue Lab">

      {/* Modals */}
      <RespondModal selectedAlert={selectedAlert} onSubmit={handleRespond} onClose={() => setSelectedAlert(null)} />
      {showDebrief && <DebriefModal logs={logs} onClose={() => setShowDebrief(false)} onReset={handleReset} />}

      {/* Error banner */}
      {error && (
        <div style={{ background: "rgba(255,100,128,0.1)", border: "1px solid rgba(255,100,128,0.3)", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "#fca5a5", fontFamily: FONT, display: "flex", justifyContent: "space-between" }}>
          ⚠️ {error}
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", marginBottom: 2 }}>Red Team vs Blue Team</div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: FONT }}>Live attack simulation — switch tabs to play both sides</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowDebrief(true)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 7, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", cursor: "pointer", fontFamily: FONT }}>🛑 End SOC Shift</button>
          <button onClick={handleReset} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 7, background: "rgba(255,100,128,0.08)", border: "1px solid rgba(255,100,128,0.25)", color: "#ff6480", cursor: "pointer", fontFamily: FONT }}>⚠️ Reset Lab</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "red", icon: "⚔️", label: "Red Team", color: "#ff6480" }, { id: "blue", icon: "🛡️", label: "Blue Team", color: "#38bdf8" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, background: activeTab === t.id ? "var(--bg-card)" : "transparent", color: activeTab === t.id ? t.color : "var(--text-muted)", border: `1px solid ${activeTab === t.id ? t.color + "40" : "var(--border)"}`, transition: "all 0.2s" }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Red Team panel */}
      {activeTab === "red" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Chaos box */}
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,100,128,0.2)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                {isChaosActive && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6480", display: "inline-block", animation: "pulse 1s infinite" }} />}
                <span style={{ fontSize: 12, fontWeight: 700, color: "#ff6480", fontFamily: FONT, letterSpacing: 1 }}>AUTOMATED APT CAMPAIGN</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Unleash a randomized multi-vector attack sequence to simulate background network noise.</div>
            </div>
            <button onClick={handleChaos} disabled={isChaosActive} style={{ padding: "10px 22px", borderRadius: 8, background: isChaosActive ? "rgba(255,100,128,0.06)" : "transparent", border: "1px solid rgba(255,100,128,0.4)", color: isChaosActive ? "rgba(255,100,128,0.4)" : "#ff6480", cursor: isChaosActive ? "not-allowed" : "pointer", fontFamily: FONT, fontSize: 11, fontWeight: 700, flexShrink: 0, letterSpacing: 1 }}>
              {isChaosActive ? "Executing..." : "Initiate Chaos →"}
            </button>
          </div>

          <div style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 2, marginBottom: -8 }}>TARGETED EXPLOITS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {ATTACKS.map(a => <AttackCard key={a.attackType} {...a} activeAttack={activeAttack} onLaunch={handleLaunchAttack} />)}
          </div>
        </div>
      )}

      {/* Blue Team panel */}
      {activeTab === "blue" && <LogFeed logs={logs} onRespondClick={setSelectedAlert} />}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </TechLayout>
  );
}