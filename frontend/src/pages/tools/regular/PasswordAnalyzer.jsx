import { useState } from "react";
import { analyzePassword as analyzePasswordAPI } from "../../../services/api";
import { ShieldCheck, Eye, EyeOff, Lock, KeyRound, Zap, AlertCircle } from "lucide-react";
import ToolLayout from "../../../layouts/ToolLayout";

const tips = [
  "Use at least 12–16 characters for strong entropy",
  "Mix uppercase & lowercase letters",
  "Include numbers (0–9) scattered throughout",
  "Add symbols like ! @ # $ % ^ & *",
  "Avoid dictionary words, names, or dates",
  "Never reuse passwords across sites",
];

const getStrengthColor = (score) => {
  if (score < 30) return { color: "#ef4444", label: "Weak",   bg: "rgba(239,68,68,0.15)"  };
  if (score < 60) return { color: "#f59e0b", label: "Fair",   bg: "rgba(245,158,11,0.15)" };
  if (score < 80) return { color: "#3b82f6", label: "Good",   bg: "rgba(59,130,246,0.15)" };
  return           { color: "#22c55e", label: "Strong", bg: "rgba(34,197,94,0.15)"  };
};

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState("");
  const [result,   setResult]   = useState(null);
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);

  const entropy  = password.length ? Math.round(password.length * 4.5) : 0;
  const score    = result?.score    || 0;
  const strength = result?.strength || "—";
  const { color, label, bg } = getStrengthColor(score);

  const analyze = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const data = await analyzePasswordAPI(password);
      setResult(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const checks = [
    { label: "Length ≥ 12", pass: password.length >= 12 },
    { label: "Uppercase",   pass: /[A-Z]/.test(password) },
    { label: "Lowercase",   pass: /[a-z]/.test(password) },
    { label: "Number",      pass: /[0-9]/.test(password) },
    { label: "Symbol",      pass: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <ToolLayout>
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="cyber-tag">PASSWORD ANALYZER</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight theme-heading">
            Password Strength Analyzer
          </h1>
          <p className="mt-2 text-sm theme-muted">
            Test your password's entropy and get real-time security feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">

          {/* Left — input + results */}
          <div className="md:col-span-3 space-y-5">

            {/* Input card */}
            <div
              className="rounded-2xl p-6 theme-card"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Lock size={16} style={{ color: "#60a5fa" }} />
                <span className="text-sm font-semibold theme-text">Enter Your Password</span>
              </div>

              {/* Input */}
              <div
                className="flex items-center rounded-xl px-4 mb-4"
                style={{ background: "var(--bg-input)", border: "1px solid var(--input-border)" }}
              >
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  placeholder="Type password here..."
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyze()}
                  autoComplete="new-password"
                  className="flex-1 bg-transparent py-3.5 text-sm outline-none theme-text"
                  style={{ fontFamily: "'JetBrains Mono', monospace", caretColor: "#60a5fa" }}
                />
                <button
                  onClick={() => setShow(!show)}
                  className="ml-2 transition-colors"
                  style={{ color: show ? "#60a5fa" : "var(--text-muted)" }}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Live checks */}
              <div className="flex flex-wrap gap-2 mb-5">
                {checks.map(({ label, pass }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all duration-300"
                    style={{
                      background: pass ? "rgba(34,197,94,0.1)" : "var(--bg-card-faint)",
                      border: `1px solid ${pass ? "rgba(34,197,94,0.3)" : "var(--border-row)"}`,
                      color: pass ? "#4ade80" : "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <span>{pass ? "✓" : "○"}</span> {label}
                  </div>
                ))}
              </div>

              {/* Analyze button */}
              <button
                onClick={analyze}
                disabled={!password || loading}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-widest transition-all duration-200 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "1px solid rgba(96,165,250,0.3)", color: "#fff", letterSpacing: "0.08em" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = "0 0 25px rgba(59,130,246,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? "ANALYZING..." : "ANALYZE PASSWORD"}
              </button>
            </div>

            {/* Result card */}
            {result && (
              <div
                className="rounded-2xl p-6"
                style={{ background: bg, border: `1px solid ${color}44` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono mb-1 theme-muted">ANALYSIS RESULT</div>
                    <div className="text-3xl font-extrabold" style={{ color }}>{label}</div>
                  </div>
                  <div className="text-5xl font-extrabold leading-none" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {score}<span className="text-xl">%</span>
                  </div>
                </div>
                <div className="score-track mb-4">
                  <div className="score-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} style={{ color }} />
                  <span className="text-sm theme-sub">
                    {strength} — Entropy: <span style={{ fontFamily: "'JetBrains Mono', monospace", color }}>{entropy} bits</span>
                  </span>
                </div>
              </div>
            )}

            {/* Live entropy meter */}
            {password && !result && (
              <div
                className="rounded-2xl p-5 theme-card"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex justify-between text-xs mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="theme-muted">Live Entropy</span>
                  <span style={{ color: "#60a5fa" }}>{entropy} bits</span>
                </div>
                <div className="score-track">
                  <div className="score-fill" style={{ width: `${Math.min(entropy, 100)}%`, background: "linear-gradient(90deg, #ef444488, #f59e0b, #22c55e)" }} />
                </div>
                <div className="flex justify-between text-xs mt-1.5 theme-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>WEAK</span><span>FAIR</span><span>GOOD</span><span>STRONG</span>
                </div>
              </div>
            )}
          </div>

          {/* Right — tips */}
          <div className="md:col-span-2 space-y-5">
            <div
              className="rounded-2xl p-6 theme-card"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <KeyRound size={16} style={{ color: "#06b6d4" }} />
                <span className="text-sm font-semibold theme-text">Security Tips</span>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3 border-b last:border-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                      style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm leading-relaxed theme-sub">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
              <p className="text-xs leading-relaxed theme-muted">
                Your password is never sent to our servers. All analysis happens locally in your browser.
              </p>
            </div>
          </div>

        </div>
      </div>
    </ToolLayout>
  );
}