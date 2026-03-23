import { useState } from "react";
import { Mail, Lock, ShieldCheck, Zap, AlertCircle, Database, Search } from "lucide-react";
import ToolLayout from "../../../layouts/ToolLayout";

const API = "http://127.0.0.1:8000";

export default function DataBreach() {
  const [mode,     setMode]     = useState("email");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const checkEmail = async () => {
    if (!email) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/breach/check-email`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setResult(await res.json());
    } catch { setResult({ status: "error", message: "Cannot connect to server" }); }
    setLoading(false);
  };

  const checkPassword = async () => {
    if (!password) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/breach/check-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      setResult(await res.json());
    } catch { setResult({ status: "error", message: "Cannot connect to server" }); }
    setLoading(false);
  };

  const handleCheck = mode === "email" ? checkEmail : checkPassword;

  return (
    <ToolLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="cyber-tag mb-3 inline-block">DATA BREACH CHECKER</span>
          <h1 className="text-4xl font-extrabold tracking-tight theme-heading">Was Your Data Leaked?</h1>
          <p className="mt-2 text-sm theme-muted">Scan billions of leaked credentials to see if you've been exposed.</p>
        </div>

        {/* Mode toggle */}
        <div
          className="flex p-1 rounded-xl mb-6 theme-card"
          style={{ border: "1px solid var(--border)" }}
        >
          {["email", "password"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                mode === m
                  ? { background: "linear-gradient(135deg, #1d4ed8, #0369a1)", color: "#fff", boxShadow: "0 4px 15px rgba(29,78,216,0.3)" }
                  : { color: "var(--text-muted)" }
              }
            >
              {m === "email" ? <Mail size={15} /> : <Lock size={15} />}
              {m.charAt(0).toUpperCase() + m.slice(1)} Check
            </button>
          ))}
        </div>

        {/* Input card */}
        <div
          className="rounded-2xl p-7 mb-5 theme-card"
          style={{ border: "1px solid var(--border)" }}
        >
          <label className="block text-xs font-mono mb-3 theme-muted">
            {mode === "email" ? "// EMAIL ADDRESS" : "// PASSWORD"}
          </label>

          <div
            className="flex items-center rounded-xl px-4 mb-5"
            style={{ background: "var(--bg-input)", border: "1px solid var(--input-border)" }}
          >
            {mode === "email"
              ? <Mail size={16} className="mr-3 flex-shrink-0" style={{ color: "#60a5fa" }} />
              : <Lock size={16} className="mr-3 flex-shrink-0" style={{ color: "#60a5fa" }} />
            }
            <input
              type={mode === "email" ? "email" : "password"}
              placeholder={mode === "email" ? "you@example.com" : "Enter password securely"}
              className="flex-1 bg-transparent py-3.5 text-sm outline-none theme-text"
              style={{ fontFamily: "'JetBrains Mono', monospace", caretColor: "#60a5fa" }}
              value={mode === "email" ? email : password}
              onChange={(e) => mode === "email" ? setEmail(e.target.value) : setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || !(mode === "email" ? email : password)}
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "1px solid rgba(96,165,250,0.3)", color: "#fff" }}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />SCANNING DATABASES...</>
            ) : (
              <><Search size={15} />SCAN FOR BREACHES</>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-5">
            {[{ icon: ShieldCheck, label: "Encrypted" }, { icon: Zap, label: "Instant scan" }, { icon: Database, label: "Billions of records" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 theme-muted">
                <Icon size={13} /><span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result — SAFE */}
        {result?.status === "safe" && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: "#22c55e" }}>No Breach Found</div>
                <div className="text-xs theme-muted">Your data looks clean</div>
              </div>
            </div>
            <p className="text-sm theme-sub">{result.message}</p>
          </div>
        )}

        {/* Result — BREACHED */}
        {(result?.status === "breached" || result?.status === "exposed") && (
          <div className="rounded-2xl p-6" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: "#ef4444" }}>Breach Detected!</div>
                {result.breaches_found && (
                  <div className="text-xs theme-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Found in {result.breaches_found} breach database(s)
                  </div>
                )}
              </div>
            </div>

            {result.breaches && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.breaches.map((b, i) => (
                  <div key={i} className="rounded-xl p-4 theme-card" style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div className="font-semibold text-sm mb-1 theme-text">{b.name}</div>
                    <div className="text-xs theme-muted">{b.description}</div>
                  </div>
                ))}
              </div>
            )}

            {!result.breaches && <p className="text-sm theme-sub">{result.message}</p>}

            <div className="mt-4 rounded-xl p-3 flex items-start gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
              <p className="text-xs theme-muted">Change your password immediately and enable two-factor authentication on affected accounts.</p>
            </div>
          </div>
        )}

        {/* Result — ERROR */}
        {result?.status === "error" && (
          <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-sm" style={{ color: "#f87171" }}>⚠ {result.message}</p>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}