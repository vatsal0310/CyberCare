import { useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:8000" });

const PRACTICE_TARGETS = [
  { domain: "scanme.nmap.org",         label: "Nmap Scanme",      desc: "Official Nmap test server — safe to scan anytime",         tags: ["Port Scan", "Network"],    color: "#38bdf8" },
  { domain: "testphp.vulnweb.com",     label: "Acunetix PHP",     desc: "Intentionally vulnerable PHP app by Acunetix",             tags: ["SQLi", "XSS", "Headers"],  color: "#818cf8" },
  { domain: "zero.webappsecurity.com", label: "WebApp Security",  desc: "Zero bank — practice web app with known vulns",            tags: ["Auth", "CSRF", "Headers"], color: "#22d3ee" },
  { domain: "testaspnet.vulnweb.com",  label: "Acunetix ASP.NET", desc: "Intentionally vulnerable ASP.NET app by Acunetix",         tags: ["SQLi", ".NET", "Headers"], color: "#60a5fa" },
  { domain: "testasp.vulnweb.com",     label: "Acunetix ASP",     desc: "Intentionally vulnerable classic ASP app",                 tags: ["SQLi", "ASP", "Headers"],  color: "#34d399" },
  { domain: "demo.testfire.net",       label: "IBM AltoroMutual", desc: "IBM's demo banking app for security testing",              tags: ["Banking", "Auth", "XSS"],  color: "#fb923c" },
];

function StepDot({ number, active, done }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13,
      background: done   ? "rgba(34,197,94,0.2)"
                : active ? "rgba(14,165,233,0.25)"
                :          "var(--bg-card-faint)",
      border: `2px solid ${done ? "#4ade80" : active ? "#38bdf8" : "var(--border)"}`,
      color:  done   ? "#4ade80"
            : active ? "#38bdf8"
            :          "var(--text-faint)",
      flexShrink: 0,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {done ? "✓" : number}
    </div>
  );
}

function StepConnector({ done }) {
  return (
    <div style={{
      flex: 1, height: 2, margin: "0 8px",
      background: done ? "#4ade80" : "var(--border)",
      transition: "background 0.4s",
    }} />
  );
}

function PracticeCard({ target, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(target.domain)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card)" : "var(--bg-card-faint)",
        border: `1px solid ${hovered ? target.color + "55" : target.color + "22"}`,
        borderRadius: 12, padding: "14px 16px",
        cursor: "pointer", transition: "all 0.2s",
        position: "relative", overflow: "hidden",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${target.color}15` : "none",
      }}
    >
      {/* Top colour bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${target.color}, transparent)`, opacity: hovered ? 0.8 : 0.3 }} />

      {/* Label + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 13 }}>{target.label}</div>
        <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>
          NO VERIFY
        </span>
      </div>

      {/* Description */}
      <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 10 }}>{target.desc}</div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {target.tags.map(tag => (
          <span key={tag} style={{ background: `${target.color}14`, border: `1px solid ${target.color}30`, color: target.color, fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Domain */}
      <div style={{ color: "var(--text-faint)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{target.domain}</div>
    </div>
  );
}

export default function DomainVerification({ onVerified }) {
  const [domain,       setDomain]       = useState("");
  const [activeTab,    setActiveTab]    = useState("practice");
  const [step,         setStep]         = useState(1);
  const [tokenData,    setTokenData]    = useState(null);
  const [checking,     setChecking]     = useState(false);
  const [generating,   setGenerating]   = useState(false);
  const [error,        setError]        = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [pollCount,    setPollCount]    = useState(0);
  const [customDomain, setCustomDomain] = useState("");

  const handleGenerate = async () => {
    if (!domain.trim()) return;
    setGenerating(true); setError("");
    try {
      const res = await API.post("/pentest/verify/generate", { domain: domain.trim().toLowerCase() });
      setTokenData(res.data); setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate token.");
    } finally { setGenerating(false); }
  };

  const handleVerify = async () => {
    setChecking(true); setError(""); setVerifyResult(null); setPollCount(c => c + 1);
    try {
      const res = await API.post("/pentest/verify/check", { domain: domain.trim().toLowerCase() });
      setVerifyResult(res.data);
      if (res.data.verified) { setStep(3); setTimeout(() => onVerified(domain.trim()), 1500); }
    } catch (err) {
      setError(err.response?.data?.detail || "Verification check failed.");
    } finally { setChecking(false); }
  };

  const handleReset = () => {
    setStep(1); setDomain(""); setTokenData(null);
    setVerifyResult(null); setError(""); setPollCount(0);
  };

  // Shared input style — uses CSS variables so it adapts to both themes
  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "var(--bg-input)",
    border: "1px solid var(--input-border)",
    color: "var(--text)",
    borderRadius: 10, padding: "12px 16px",
    fontSize: 14, outline: "none",
    fontFamily: "'JetBrains Mono', monospace",
    transition: "all 0.2s",
  };

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 14 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>SMART VULNERABILITY ANALYZER</span>
        </div>
        {/* Heading — uses theme-heading class so it's visible in both themes */}
        <h1 className="theme-heading" style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          Choose Your Target
        </h1>
        <p style={{ color: "var(--text-sub)", fontSize: 14, margin: 0 }}>
          Use a practice target instantly, or verify ownership of your own domain.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 4 }}>
        {[
          { id: "practice", label: "🎯  Practice Targets", sub: "No verification needed" },
          { id: "own",      label: "🔐  My Own Domain",    sub: "DNS verification required" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setError(""); }}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 9, cursor: "pointer",
              background: activeTab === tab.id ? "rgba(14,165,233,0.15)" : "transparent",
              border: activeTab === tab.id ? "1px solid rgba(56,189,248,0.35)" : "1px solid transparent",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            <div style={{ color: activeTab === tab.id ? "var(--text)" : "var(--text-muted)", fontWeight: 700, fontSize: 13 }}>{tab.label}</div>
            <div style={{ color: activeTab === tab.id ? "var(--accent)" : "var(--text-faint)", fontSize: 11, marginTop: 2 }}>{tab.sub}</div>
          </button>
        ))}
      </div>

      {/* ── PRACTICE TARGETS ── */}
      {activeTab === "practice" && (
        <div>
          {/* Info bar */}
          <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, color: "#4ade80", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            ✓ Intentionally vulnerable sites for security testing. Click any card to scan immediately.
          </div>

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {PRACTICE_TARGETS.map(target => (
              <PracticeCard key={target.domain} target={target} onSelect={onVerified} />
            ))}
          </div>

          {/* Custom input */}
          <div style={{ background: "var(--bg-card-faint)", border: "1px dashed var(--border-hover)", borderRadius: 12, padding: 16 }}>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10 }}>
              Know another safe practice target? Enter it directly:
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={customDomain}
                onChange={e => setCustomDomain(e.target.value)}
                onKeyDown={e => e.key === "Enter" && customDomain && onVerified(customDomain.trim())}
                placeholder="e.g. hackthissite.org"
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--input-border)"}
              />
              <button
                onClick={() => customDomain && onVerified(customDomain.trim())}
                disabled={!customDomain.trim()}
                style={{ background: customDomain ? "linear-gradient(135deg, #1d4ed8, #0369a1)" : "var(--bg-card-faint)", border: "1px solid rgba(56,189,248,0.3)", color: customDomain ? "white" : "var(--text-muted)", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: customDomain ? "pointer" : "not-allowed", fontFamily: "inherit" }}
              >
                Scan →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── OWN DOMAIN ── */}
      {activeTab === "own" && (
        <div>
          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10, padding: "0 8px" }}>
            <StepDot number={1} active={step === 1} done={step > 1} />
            <StepConnector done={step > 1} />
            <StepDot number={2} active={step === 2} done={step > 2} />
            <StepConnector done={step > 2} />
            <StepDot number={3} active={step === 3} done={step === 3} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 11, color: "var(--text-faint)", padding: "0 4px" }}>
            <span>Enter Domain</span><span>Add DNS Record</span><span>Verified</span>
          </div>

          {/* Step card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>

            {/* Step 1 — enter domain */}
            {step === 1 && (
              <div>
                <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Enter your domain</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
                  You'll add a DNS TXT record to prove you own this domain before scanning.
                </div>
                <input
                  type="text" value={domain}
                  onChange={e => { setDomain(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  placeholder="yourdomain.com"
                  style={{ ...inputStyle, marginBottom: 16 }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--input-border)"}
                />
                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 14 }}>
                    ❌ {error}
                  </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={!domain.trim() || generating}
                  style={{ width: "100%", padding: "13px", background: domain.trim() ? "linear-gradient(135deg, #1d4ed8, #0369a1)" : "var(--bg-card-faint)", border: "1px solid rgba(56,189,248,0.3)", color: domain.trim() ? "white" : "var(--text-muted)", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: domain.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}
                >
                  {generating ? "Generating..." : "Get DNS Verification Token →"}
                </button>
              </div>
            )}

            {/* Step 2 — add DNS record */}
            {step === 2 && tokenData && (
              <div>
                <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  Add TXT record to <span style={{ color: "var(--accent)" }}>{domain}</span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
                  Log in to your DNS provider and add the record below. Usually takes 1–5 minutes.
                </div>
                <div style={{ background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, marginBottom: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "12px 16px", fontSize: 13 }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Type</span>
                    <span style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", padding: "2px 10px", borderRadius: 5, fontWeight: 700, width: "fit-content" }}>TXT</span>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Name</span>
                    <code style={{ color: "var(--accent)", fontSize: 12 }}>_cybercare-verify</code>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Value</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <code style={{ color: "#4ade80", fontSize: 11, wordBreak: "break-all", background: "rgba(34,197,94,0.08)", padding: "4px 8px", borderRadius: 6, flex: 1 }}>{tokenData.token}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(tokenData.token)}
                        style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                      >Copy</button>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>TTL</span>
                    <span style={{ color: "var(--text-sub)" }}>300</span>
                  </div>
                </div>
                {verifyResult && !verifyResult.verified && (
                  <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: 8, padding: "10px 14px", color: "#fde68a", fontSize: 13, marginBottom: 14 }}>
                    ⏳ {verifyResult.message}
                    {pollCount >= 2 && <div style={{ marginTop: 5, color: "var(--text-muted)", fontSize: 12 }}>DNS propagation can take up to 5 minutes. Keep trying.</div>}
                  </div>
                )}
                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, marginBottom: 14 }}>
                    ❌ {error}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleReset}
                    style={{ padding: "12px 18px", background: "transparent", border: "1px solid var(--border-hover)", color: "var(--accent)", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}
                  >← Back</button>
                  <button
                    onClick={handleVerify}
                    disabled={checking}
                    style={{ flex: 1, padding: "12px", background: checking ? "var(--bg-card-faint)" : "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "1px solid rgba(56,189,248,0.3)", color: checking ? "var(--text-muted)" : "white", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: checking ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                  >
                    {checking ? "Checking DNS..." : "✓ I Added the Record — Verify Now"}
                  </button>
                </div>
                <div style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 11, marginTop: 10 }}>
                  Token expires in {tokenData.expires_in_minutes} minutes
                </div>
              </div>
            )}

            {/* Step 3 — verified */}
            {step === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ color: "#4ade80", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Domain Verified!</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  <span style={{ color: "var(--accent)" }}>{domain}</span> ownership confirmed.<br />Starting your scan...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer disclaimer ── */}
      <div style={{ marginTop: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12, lineHeight: 1.6 }}>
        By scanning any target you confirm you have authorization to test it.<br />
        Unauthorized scanning is illegal. All activity is logged.
      </div>
    </div>
  );
}
