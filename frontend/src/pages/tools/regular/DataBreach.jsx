import { useState } from "react";
import { Mail, Lock, ShieldCheck, Zap, AlertCircle, Database, Search } from "lucide-react";
import ToolLayout from "../../../layouts/ToolLayout";

const API = "http://127.0.0.1:8000";

export default function DataBreach() {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkEmail = async () => {
    if (!email) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/breach/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResult(await res.json());
    } catch {
      setResult({ status: "error", message: "Cannot connect to server" });
    }
    setLoading(false);
  };

  const checkPassword = async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/breach/check-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setResult(await res.json());
    } catch {
      setResult({ status: "error", message: "Cannot connect to server" });
    }
    setLoading(false);
  };

  const handleCheck = mode === "email" ? checkEmail : checkPassword;

  return (
    <ToolLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="cyber-tag mb-3 inline-block">DATA BREACH CHECKER</span>
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Was Your Data Leaked?
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            Scan billions of leaked credentials to see if you've been exposed.
          </p>
        </div>

        {/* Mode toggle */}
        <div
          className="flex p-1 rounded-xl mb-6"
          style={{ background: "rgba(7,14,34,0.9)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          {["email", "password"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                mode === m
                  ? {
                      background: "linear-gradient(135deg, #1d4ed8, #0369a1)",
                      color: "#fff",
                      boxShadow: "0 4px 15px rgba(29,78,216,0.3)",
                    }
                  : { color: "rgba(148,163,184,0.5)" }
              }
            >
              {m === "email" ? <Mail size={15} /> : <Lock size={15} />}
              {m.charAt(0).toUpperCase() + m.slice(1)} Check
            </button>
          ))}
        </div>

        {/* Input card */}
        <div
          className="rounded-2xl p-7 mb-5"
          style={{
            background: "rgba(7,14,34,0.85)",
            border: "1px solid rgba(59,130,246,0.18)",
          }}
        >
          <label className="block text-xs font-mono mb-3" style={{ color: "rgba(148,163,184,0.5)" }}>
            {mode === "email" ? "// EMAIL ADDRESS" : "// PASSWORD"}
          </label>

          <div
            className="flex items-center rounded-xl px-4 mb-5"
            style={{
              background: "rgba(2,11,24,0.9)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            {mode === "email"
              ? <Mail size={16} className="mr-3 flex-shrink-0" style={{ color: "#60a5fa" }} />
              : <Lock size={16} className="mr-3 flex-shrink-0" style={{ color: "#60a5fa" }} />
            }
            <input
              type={mode === "email" ? "email" : "password"}
              placeholder={mode === "email" ? "you@example.com" : "Enter password securely"}
              className="flex-1 bg-transparent py-3.5 text-sm outline-none"
              style={{
                color: "#e2e8f0",
                fontFamily: "'JetBrains Mono', monospace",
                caretColor: "#60a5fa",
              }}
              value={mode === "email" ? email : password}
              onChange={(e) =>
                mode === "email" ? setEmail(e.target.value) : setPassword(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || !(mode === "email" ? email : password)}
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #0369a1)",
              border: "1px solid rgba(96,165,250,0.3)",
              color: "#fff",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SCANNING DATABASES...
              </>
            ) : (
              <>
                <Search size={15} />
                SCAN FOR BREACHES
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="flex items-center gap-1.5" style={{ color: "rgba(148,163,184,0.4)" }}>
              <ShieldCheck size={13} />
              <span className="text-xs">Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(148,163,184,0.4)" }}>
              <Zap size={13} />
              <span className="text-xs">Instant scan</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: "rgba(148,163,184,0.4)" }}>
              <Database size={13} />
              <span className="text-xs">Billions of records</span>
            </div>
          </div>
        </div>

        {/* Result — SAFE */}
        {result?.status === "safe" && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: "#22c55e" }}>No Breach Found</div>
                <div className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>Your data looks clean</div>
              </div>
            </div>
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>{result.message}</p>
          </div>
        )}

        {/* Result — BREACHED */}
        {(result?.status === "breached" || result?.status === "exposed") && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
              >
                <AlertCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: "#ef4444" }}>Breach Detected!</div>
                {result.breaches_found && (
                  <div className="text-xs" style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                    Found in {result.breaches_found} breach database(s)
                  </div>
                )}
              </div>
            </div>

            {result.breaches && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.breaches.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(2,11,24,0.6)",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <div className="font-semibold text-sm text-white mb-1">{b.name}</div>
                    <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>{b.description}</div>
                  </div>
                ))}
              </div>
            )}

            {!result.breaches && (
              <p className="text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>{result.message}</p>
            )}

            <div
              className="mt-4 rounded-xl p-3 flex items-start gap-2"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
              <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                Change your password immediately and enable two-factor authentication on affected accounts.
              </p>
            </div>
          </div>
        )}

        {/* Result — ERROR */}
        {result?.status === "error" && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <p className="text-sm" style={{ color: "#f87171" }}>⚠ {result.message}</p>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
