// frontend/src/components/soc/RespondModal.jsx
import { useState, useEffect } from "react";

const FONT = "'JetBrains Mono', monospace";

export default function RespondModal({ selectedAlert, onSubmit, onClose }) {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { setFeedback(null); }, [selectedAlert]);
  if (!selectedAlert) return null;

  const getPlaybook = () => {
    const t = selectedAlert.attack_type;
    if (t.includes("SQL"))         return "Critical DB probing detected. Block the Source IP at the perimeter firewall immediately.";
    if (t.includes("Brute Force")) return "Dictionary attack on auth endpoints. Block Source IP to halt the automated script.";
    if (t.includes("XSS") || t.includes("Cross-Site")) return "Malicious payload in user-facing forms. Block Source IP — do not isolate unless patching is underway.";
    if (t.includes("Scan") || t.includes("Ping"))      return "Low-level reconnaissance. Flag as False Positive to clear the queue, or monitor for escalation.";
    return "Analyze payload headers. If malicious, Block IP. If anomalous but internal, Isolate Target.";
  };

  const handleAction = (action) => {
    const t           = selectedAlert.attack_type;
    const realAttacks = ["SQL Injection", "Brute Force", "Cross-Site Scripting"];
    const webAttacks  = ["SQL Injection", "Cross-Site Scripting"];
    const noise       = ["Automated Port Scan", "Ping Sweep"];

    if (action === "Flag as False Positive" && realAttacks.some(r => t.includes(r))) {
      return setFeedback({ type: "error", message: `CRITICAL ERROR: This is a validated ${t} signature. Marking as false positive allows the attacker to breach the network.` });
    }
    if (action === "Isolate Target" && webAttacks.some(w => t.includes(w))) {
      return setFeedback({ type: "warning", message: "SUB-OPTIMAL: Isolating the host takes the entire app offline for legitimate users. Block the Source IP at the firewall instead." });
    }
    if ((action === "Block Source IP" || action === "Isolate Target") && noise.some(n => t.includes(n))) {
      return setFeedback({ type: "warning", message: "SUB-OPTIMAL: This is background internet noise. Don't waste firewall rules on a simple ping. Flag as False Positive." });
    }
    setFeedback({ type: "success", message: "SOP Followed Successfully. Threat neutralized. Updating SIEM feed..." });
    setTimeout(() => onSubmit(action), 1500);
  };

  const actions = [
    { label: "Block Source IP", action: "Block Source IP", color: "#ff6480" },
    { label: "Isolate Target",  action: "Isolate Target",  color: "#fb923c" },
    { label: "False Positive",  action: "Flag as False Positive", color: "var(--text-muted)" },
  ];

  const feedbackStyle = {
    error:   { background: "rgba(255,100,128,0.1)", border: "1px solid rgba(255,100,128,0.3)", color: "#fca5a5" },
    warning: { background: "rgba(251,146,60,0.1)",  border: "1px solid rgba(251,146,60,0.3)",  color: "#fdba74" },
    success: { background: "rgba(52,211,153,0.1)",  border: "1px solid rgba(52,211,153,0.3)",  color: "#6ee7b7" },
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 400, backdropFilter: "blur(4px)", padding: 16 }}>
      <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: 14, width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "var(--bg-deep)", padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6480", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "var(--text)", fontWeight: 700, fontSize: 13, fontFamily: FONT }}>DEEP PACKET INSPECTION</span>
          </div>
          <span style={{ fontSize: 9, padding: "2px 10px", borderRadius: 8, fontFamily: FONT, letterSpacing: 1, background: selectedAlert.severity === "High" ? "rgba(255,100,128,0.12)" : "rgba(251,146,60,0.12)", color: selectedAlert.severity === "High" ? "#ff6480" : "#fb923c", border: `1px solid ${selectedAlert.severity === "High" ? "rgba(255,100,128,0.3)" : "rgba(251,146,60,0.3)"}` }}>
            {selectedAlert.severity?.toUpperCase()} SEVERITY
          </span>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Threat Vector", selectedAlert.attack_type, "var(--text)"], ["Attacker IP", selectedAlert.source_ip, "#fbbf24"]].map(([label, val, color]) => (
              <div key={label} style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: FONT }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Raw payload */}
          <div>
            <div style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 2, marginBottom: 6 }}>RAW INTERCEPTED PAYLOAD</div>
            <div style={{ background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, fontFamily: FONT, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.8 }}>
              <span style={{ color: "#38bdf8" }}>POST</span> /api/authenticate HTTP/1.1<br />
              Host: <span style={{ color: "var(--text)" }}>{selectedAlert.target}</span><br />
              X-Forwarded-For: <span style={{ color: "#fbbf24" }}>{selectedAlert.source_ip}</span><br /><br />
              payload=<span style={{ background: "rgba(255,100,128,0.15)", color: "#ff6480", padding: "1px 6px", borderRadius: 3 }}>{selectedAlert.payload}</span>
            </div>
          </div>

          {/* Playbook */}
          <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, color: "#38bdf8", fontFamily: FONT, letterSpacing: 2, marginBottom: 6 }}>SOC ANALYST PLAYBOOK</div>
            <div style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.7 }}>{getPlaybook()}</div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{ borderRadius: 8, padding: "12px 14px", fontSize: 12, lineHeight: 1.6, ...feedbackStyle[feedback.type] }}>
              {feedback.type === "error" ? "❌" : feedback.type === "warning" ? "⚠️" : "✅"} {feedback.message}
            </div>
          )}

          {/* Action buttons */}
          <div>
            <div style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: FONT, letterSpacing: 2, marginBottom: 8 }}>EXECUTE RESPONSE PROTOCOL</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {actions.map(({ label, action, color }) => (
                <button key={action} onClick={() => handleAction(action)} disabled={feedback?.type === "success"} style={{ padding: "10px 0", borderRadius: 7, cursor: "pointer", fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: 1, background: "transparent", border: "1px solid var(--border)", color, transition: "all 0.2s", opacity: feedback?.type === "success" ? 0.4 : 1 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "var(--bg-deep)", padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ fontSize: 10, padding: "7px 18px", borderRadius: 6, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontFamily: FONT }}>
            Close Inspector
          </button>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    </div>
  );
}