import { useState } from "react";
import ToolLayout from "../../../layouts/ToolLayout";
import {
  Globe, Search, ShieldCheck, ShieldAlert, ShieldX,
  AlertTriangle, Lock, CheckCircle, XCircle,
  Wifi, Hash, Link2, Eye, Loader2,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

const VERDICT_CONFIG = {
  "LIKELY SAFE": { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.3)",  icon: ShieldCheck, label: "Likely Safe" },
  "CAUTION":     { color: "#eab308", bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.3)",  icon: ShieldAlert, label: "Caution"     },
  "SUSPICIOUS":  { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)", icon: ShieldAlert, label: "Suspicious"  },
  "DANGEROUS":   { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.3)",  icon: ShieldX,     label: "Dangerous!"  },
};

function ScoreRing({ score, verdict }) {
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG["LIKELY SAFE"];
  const r = 52, circ = 2 * Math.PI * r, filled = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border-svg)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={cfg.color} strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${cfg.color}88)`, transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-extrabold" style={{ color: cfg.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{score}</div>
        <div className="text-xs mt-0.5 theme-muted">risk</div>
      </div>
    </div>
  );
}

function FeatureRow({ icon: Icon, label, value, status }) {
  const colors = {
    good:    { text: "#22c55e", bg: "rgba(34,197,94,0.1)",  icon: CheckCircle  },
    bad:     { text: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: XCircle      },
    warn:    { text: "#f97316", bg: "rgba(249,115,22,0.1)", icon: AlertTriangle },
    neutral: { text: "#60a5fa", bg: "rgba(96,165,250,0.08)",icon: Eye          },
  };
  const c = colors[status] || colors.neutral;
  const StatusIcon = c.icon;
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150"
      style={{ background: "var(--bg-row)", border: "1px solid var(--border-row)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
          <Icon size={14} />
        </div>
        <span className="text-sm theme-sub">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: c.text }}>{value}</span>
        <StatusIcon size={14} style={{ color: c.text }} />
      </div>
    </div>
  );
}

export default function FakeWebsiteDetector() {
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch(`${API}/website/check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: url.trim() }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || "Server error"); }
      setResult(await res.json());
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const verdict = result?.risk?.verdict;
  const cfg = verdict ? VERDICT_CONFIG[verdict] : null;
  const VerdictIcon = cfg?.icon;

  const featureRows = result ? [
    { icon: Lock,        label: "HTTPS (Secure connection)",    value: result.features.https.uses_https ? "Yes — padlock present" : "No — not secure",                                                                                                                                  status: result.features.https.uses_https ? "good" : "bad" },
    { icon: Globe,       label: "Suspicious domain ending",     value: result.features.suspicious_tld.suspicious ? `Yes — ${result.features.suspicious_tld.tld}` : "No — domain looks normal",                                                                                        status: result.features.suspicious_tld.suspicious ? "bad" : "good" },
    { icon: ShieldAlert, label: "Brand impersonation",          value: result.features.brand_impersonation.detected ? result.features.brand_impersonation.is_impersonation ? `Faking '${result.features.brand_impersonation.brand}'` : `'${result.features.brand_impersonation.brand}' — looks real` : "None detected", status: result.features.brand_impersonation.is_impersonation ? "bad" : result.features.brand_impersonation.detected ? "neutral" : "good" },
    { icon: Wifi,        label: "Google Safe Browsing",         value: result.features.google_safe_browsing.threat ? `⚠ ${result.features.google_safe_browsing.threat}` : result.features.google_safe_browsing.checked ? "Clean — not in threat database" : "Not checked (no API key)", status: result.features.google_safe_browsing.threat ? "bad" : result.features.google_safe_browsing.checked ? "good" : "neutral" },
    { icon: Hash,        label: "URL structure",                value: result.features.url_structure.is_ip_address ? "IP address — suspicious" : result.features.url_structure.hyphen_count >= 3 ? `${result.features.url_structure.hyphen_count} hyphens — suspicious` : `Length ${result.features.url_structure.length} chars`, status: result.features.url_structure.is_ip_address ? "bad" : result.features.url_structure.hyphen_count >= 3 ? "warn" : "good" },
    { icon: Link2,       label: "Suspicious words in URL",      value: result.features.suspicious_keywords.count > 0 ? `${result.features.suspicious_keywords.count} found: ${result.features.suspicious_keywords.found.slice(0,3).join(", ")}` : "None found",                        status: result.features.suspicious_keywords.count >= 3 ? "bad" : result.features.suspicious_keywords.count >= 1 ? "warn" : "good" },
    { icon: Wifi,        label: "Domain resolves",              value: result.features.domain_resolves ? "Yes — domain is online" : "No — domain not found",                                                                                                                           status: result.features.domain_resolves ? "good" : "warn" },
    { icon: Eye,         label: "URL entropy (randomness)",     value: `${result.features.entropy} bits`,                                                                                                                                                                              status: result.features.entropy > 4.8 ? "warn" : result.features.entropy > 4.5 ? "neutral" : "good" },
  ] : [];

  return (
    <ToolLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="cyber-tag mb-3 inline-block">FAKE WEBSITE DETECTOR</span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 theme-heading">Is This Website Safe?</h1>
          <p className="text-sm theme-muted">Paste any website link below and we'll check it for phishing, fake branding, and known threats.</p>
        </div>

        {/* Input card */}
        <div
          className="rounded-2xl p-6 mb-6 theme-card"
          style={{ border: "1px solid rgba(129,140,248,0.2)" }}
        >
          <label className="block text-xs font-mono mb-3 theme-muted">// PASTE WEBSITE URL</label>

          <div
            className="flex items-center gap-3 rounded-xl px-4 mb-4"
            style={{ background: "var(--bg-input)", border: "1px solid rgba(129,140,248,0.2)" }}
          >
            <Globe size={16} style={{ color: "#818cf8", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="e.g. paypal-secure-login.xyz or https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="flex-1 bg-transparent py-4 text-sm outline-none theme-text"
              style={{ fontFamily: "'JetBrains Mono', monospace", caretColor: "#818cf8" }}
            />
            {url && (
              <button
                onClick={() => { setUrl(""); setResult(null); setError(null); }}
                style={{ color: "var(--text-muted)" }}
                className="transition-colors text-lg leading-none hover:text-accent"
              >×</button>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={!url.trim() || loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", border: "1px solid rgba(129,140,248,0.3)", color: "#fff" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = "0 0 28px rgba(129,140,248,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> SCANNING...</> : <><Search size={15} /> SCAN WEBSITE</>}
          </button>

          {loading && (
            <div className="mt-4 space-y-1.5">
              {["Checking Google Safe Browsing database...", "Analysing URL structure and patterns...", "Detecting brand impersonation...", "Verifying domain..."].map((step, i) => (
                <div key={i} className="flex items-center gap-2" style={{ animationDelay: `${i * 0.3}s`, opacity: 0, animation: "slideUp 0.4s ease forwards" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--text-muted)" }}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl p-5 mb-6 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <XCircle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "#f87171" }}>Could not connect to server: {error}</p>
          </div>
        )}

        {/* Results */}
        {result && cfg && (
          <div className="space-y-5 slide-up">
            {/* Verdict banner */}
            <div className="rounded-2xl p-6" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div className="flex items-center gap-6">
                <ScoreRing score={result.risk.score} verdict={verdict} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <VerdictIcon size={22} style={{ color: cfg.color }} />
                    <span className="text-2xl font-extrabold tracking-wide" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div className="text-xs mb-4 font-mono truncate max-w-sm theme-muted">{result.url}</div>
                  {result.risk.flags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.risk.flags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                          <AlertTriangle size={11} />{flag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#4ade80" }}>
                      <CheckCircle size={15} />No red flags found — this website looks clean.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature breakdown */}
            <div className="rounded-2xl p-6 theme-card" style={{ border: "1px solid rgba(129,140,248,0.12)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Eye size={15} style={{ color: "#818cf8" }} />
                <span className="text-sm font-semibold theme-text">Detailed Analysis</span>
                <span className="ml-auto cyber-tag" style={{ fontSize: "0.58rem" }}>{featureRows.filter(r => r.status === "good").length}/{featureRows.length} PASSED</span>
              </div>
              <div className="space-y-2">{featureRows.map((row, i) => <FeatureRow key={i} {...row} />)}</div>
            </div>

            {/* Safety tip */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: verdict === "LIKELY SAFE" ? "rgba(34,197,94,0.05)" : "rgba(245,158,11,0.06)", border: verdict === "LIKELY SAFE" ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(245,158,11,0.18)" }}
            >
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: verdict === "LIKELY SAFE" ? "#22c55e" : "#f59e0b" }} />
              <p className="text-xs leading-relaxed theme-muted">
                {verdict === "LIKELY SAFE"
                  ? "This website passed our checks, but always be careful. Look for the padlock icon and make sure the address bar shows the correct website name before entering any passwords or personal details."
                  : "Do not enter your password, bank details, or personal information on this website. If you received a link asking you to log in, go directly to the official website instead of clicking the link."}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="rounded-2xl p-10 text-center theme-card" style={{ border: "1px dashed rgba(129,140,248,0.2)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(129,140,248,0.08)", color: "#818cf8" }}>
              <Globe size={28} />
            </div>
            <p className="text-sm font-semibold mb-1 theme-text">No website scanned yet</p>
            <p className="text-xs theme-muted">Paste any link above — we'll run 8 checks in seconds</p>
            <div className="grid grid-cols-2 gap-2 mt-6 text-left max-w-sm mx-auto">
              {[{ icon: Lock, text: "HTTPS check" }, { icon: ShieldAlert, text: "Brand impersonation" }, { icon: Wifi, text: "Google Safe Browsing" }, { icon: Globe, text: "Suspicious domain" }, { icon: Hash, text: "URL structure" }, { icon: Link2, text: "Phishing keywords" }, { icon: Eye, text: "URL entropy" }, { icon: CheckCircle, text: "Domain resolve check" }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 py-1">
                  <Icon size={12} style={{ color: "rgba(129,140,248,0.5)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--text-muted)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}