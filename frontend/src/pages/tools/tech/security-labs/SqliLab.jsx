// frontend/src/pages/tools/tech/security-labs/SqliLab.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechLayout from "../../../../layouts/TechLayout";
import { sqliApi, saveToken } from "../../../../api/sqliApi";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";
const SANS = "'Inter', system-ui, sans-serif";

const STATUS = {
  red:          "#f87171",
  redDim:       "rgba(248,113,113,0.08)",
  redBorder:    "rgba(248,113,113,0.2)",
  green:        "#4ade80",
  greenDim:     "rgba(74,222,128,0.08)",
  greenBorder:  "rgba(74,222,128,0.2)",
  yellow:       "#fbbf24",
  yellowDim:    "rgba(251,191,36,0.08)",
  yellowBorder: "rgba(251,191,36,0.2)",
  blue:         "#60a5fa",
  blueDim:      "rgba(96,165,250,0.08)",
  blueBorder:   "rgba(96,165,250,0.2)",
};

const DIFFICULTY = {
  Beginner:     { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  Intermediate: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"  },
  Advanced:     { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
};

const STEPS = [
  { id: "intro",      label: "Intro",          shortLabel: "00",  badge: null,           icon: "📖" },
  { id: "challenge1", label: "Break the Login", shortLabel: "01", badge: "Beginner",      icon: "🔓" },
  { id: "challenge2", label: "Data Exfil",      shortLabel: "02", badge: "Beginner",      icon: "📤" },
  { id: "challenge3", label: "Error Reveals",   shortLabel: "03", badge: "Intermediate",  icon: "💥" },
  { id: "challenge4", label: "True or False",   shortLabel: "04", badge: "Intermediate",  icon: "🔍" },
  { id: "challenge5", label: "Timing Attack",   shortLabel: "05", badge: "Advanced",      icon: "⏱" },
  { id: "challenge6", label: "Stored Payload",  shortLabel: "06", badge: "Advanced",      icon: "💣" },
  { id: "completion", label: "Certificate",     shortLabel: "🏆", badge: null,            icon: "🏆" },
];

// ── Top Navigation ─────────────────────────────────────────────────────────────
function TopNav({ view, setView, completed }) {
  const [resetting, setResetting] = useState(false);
  const [resetOk,   setResetOk]   = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try { await sqliApi.resetDatabase(); setResetOk(true); } catch {}
    setTimeout(() => { setResetting(false); setResetOk(false); }, 2000);
  };

  const challengeSteps = STEPS.filter(s => s.id !== "intro" && s.id !== "completion");
  const doneCount = completed.length;
  const pct = Math.round((doneCount / 6) * 100);

  return (
    <div
      className="theme-card"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      {/* Top bar: title + progress + reset */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Lab title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", fontFamily: MONO, letterSpacing: 0.5 }}>
            SQLi Lab
          </span>
        </div>

        {/* Progress bar + count */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--accent-blue, #3b82f6), var(--accent, #38bdf8))",
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: "var(--accent)", fontFamily: MONO, fontWeight: 700, flexShrink: 0 }}>
            {doneCount}/6
          </span>
        </div>

        {/* Nav links: Intro + Completion */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {[STEPS[0], STEPS[7]].map(step => {
            const isActive = view === step.id;
            const locked   = step.id === "completion" && doneCount < 6;
            return (
              <button
                key={step.id}
                onClick={() => !locked && setView(step.id)}
                disabled={locked}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: `1px solid ${isActive ? "rgba(56,189,248,0.4)" : "var(--border)"}`,
                  background: isActive ? "rgba(56,189,248,0.1)" : "transparent",
                  color: locked ? "var(--text-faint)" : isActive ? "var(--accent)" : "var(--text-muted)",
                  fontSize: 11,
                  fontFamily: MONO,
                  cursor: locked ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
                {locked && <span style={{ fontSize: 9, opacity: 0.5 }}>🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          disabled={resetting}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            border: `1px solid ${resetOk ? STATUS.greenBorder : "var(--border)"}`,
            background: resetOk ? STATUS.greenDim : "transparent",
            color: resetOk ? STATUS.green : "var(--text-muted)",
            fontSize: 10,
            fontFamily: MONO,
            cursor: resetting ? "not-allowed" : "pointer",
            letterSpacing: 0.5,
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {resetOk ? "✓ Reset" : resetting ? "Resetting..." : "⟳ Reset DB"}
        </button>
      </div>

      {/* Challenge stepper */}
      <div style={{ display: "flex", padding: "10px 16px", gap: 6, overflowX: "auto" }}>
        {challengeSteps.map((step, idx) => {
          const isActive = view === step.id;
          const isDone   = completed.includes(step.id);
          const diff     = step.badge ? DIFFICULTY[step.badge] : null;
          const num      = idx + 1;

          return (
            <button
              key={step.id}
              onClick={() => setView(step.id)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "10px 12px",
                borderRadius: 10,
                border: `1px solid ${isActive ? "rgba(56,189,248,0.35)" : isDone ? STATUS.greenBorder : "var(--border)"}`,
                background: isActive
                  ? "rgba(56,189,248,0.08)"
                  : isDone
                  ? STATUS.greenDim
                  : "transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Active glow line at top */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: "var(--accent)",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
              )}
              {isDone && !isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: STATUS.green,
                    borderRadius: "10px 10px 0 0",
                  }}
                />
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{
                  fontSize: 9,
                  fontFamily: MONO,
                  color: isActive ? "var(--accent)" : isDone ? STATUS.green : "var(--text-faint)",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}>
                  {isDone ? "✓" : `0${num}`}
                </span>
                {diff && (
                  <span style={{
                    fontSize: 7,
                    padding: "1px 5px",
                    borderRadius: 8,
                    background: diff.bg,
                    color: diff.color,
                    border: `1px solid ${diff.border}`,
                    fontFamily: MONO,
                    letterSpacing: 0.3,
                  }}>
                    {step.badge}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 11,
                color: isActive ? "var(--accent)" : isDone ? "var(--text-muted)" : "var(--text)",
                fontFamily: SANS,
                fontWeight: isActive ? 700 : 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {step.icon} {step.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Terminal ──────────────────────────────────────────────────────────────────
function Terminal({ query }) {
  return (
    <div style={{ marginTop: 20, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
      <div style={{ background: "var(--bg-deeper)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid var(--border)" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        <span style={{ marginLeft: 8, fontSize: 10, color: "var(--text-muted)", fontFamily: MONO }}>sql_query.log</span>
      </div>
      <div style={{ background: "var(--bg-deeper)", padding: "14px 18px", fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", overflowX: "auto", lineHeight: 1.6 }}>
        <span style={{ color: "#1d4ed8", userSelect: "none" }}>$ </span>
        {query
          ? <span style={{ color: "var(--accent)" }}>{query}</span>
          : <span style={{ color: "var(--text-faint)", fontStyle: "italic" }}>-- waiting for input</span>
        }
      </div>
    </div>
  );
}

// ── HintBox ───────────────────────────────────────────────────────────────────
function HintBox({ hints, solution }) {
  const [revealed, setRevealed] = useState(0);
  const [showSol,  setShowSol]  = useState(false);
  const list = Array.isArray(hints) ? hints : [];

  return (
    <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 14, fontFamily: SANS }}>Hints</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO }}>({revealed}/{list.length})</span>
        </div>
        {revealed < list.length && (
          <button
            onClick={() => setRevealed(r => r + 1)}
            style={{ fontSize: 10, padding: "6px 16px", borderRadius: 20, background: STATUS.yellowDim, border: `1px solid ${STATUS.yellowBorder}`, color: STATUS.yellow, cursor: "pointer", fontFamily: MONO, letterSpacing: 1 }}
          >
            Reveal #{revealed + 1}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {list.slice(0, revealed).map((h, i) => (
          <div key={i} style={{ background: STATUS.yellowDim, border: `1px solid ${STATUS.yellowBorder}`, borderLeft: `3px solid ${STATUS.yellow}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--text-sub)", display: "flex", gap: 12, lineHeight: 1.6, fontFamily: SANS }}>
            <span style={{ color: STATUS.yellow, fontWeight: 800, fontFamily: MONO, flexShrink: 0, fontSize: 11, marginTop: 2 }}>#{i+1}</span>
            {h}
          </div>
        ))}
        {revealed === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-faint)", fontSize: 12, fontFamily: MONO, border: "1px dashed var(--border)", borderRadius: 8 }}>
            Click "Reveal #1" to get your first hint
          </div>
        )}
      </div>

      {solution && (!showSol ? (
        <button
          onClick={() => setShowSol(true)}
          style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: `1px dashed ${STATUS.redBorder}`, background: STATUS.redDim, color: STATUS.red, cursor: "pointer", fontSize: 11, fontFamily: MONO, letterSpacing: 1.5 }}
        >
          ⚠ REVEAL FULL SOLUTION
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: STATUS.redDim, border: `1px solid ${STATUS.redBorder}`, borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 9, color: STATUS.red, letterSpacing: 3, fontFamily: MONO, marginBottom: 10, fontWeight: 700 }}>INJECTION PAYLOAD</div>
            <code style={{ color: "#fca5a5", fontFamily: MONO, fontSize: 13, wordBreak: "break-all", lineHeight: 1.8 }}>{solution.payload}</code>
          </div>
          <div style={{ background: STATUS.blueDim, border: `1px solid ${STATUS.blueBorder}`, borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 9, color: STATUS.blue, letterSpacing: 3, fontFamily: MONO, marginBottom: 10, fontWeight: 700 }}>HOW IT WORKS</div>
            <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>{solution.explanation}</p>
          </div>
          <div style={{ background: STATUS.greenDim, border: `1px solid ${STATUS.greenBorder}`, borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 9, color: STATUS.green, letterSpacing: 3, fontFamily: MONO, marginBottom: 10, fontWeight: 700 }}>HOW TO PREVENT</div>
            <p style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>{solution.prevention}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ChallengeHeader ───────────────────────────────────────────────────────────
function ChallengeHeader({ num, category, title, desc, badge }) {
  const diff = DIFFICULTY[badge] || {};
  return (
    <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 11, color: "var(--accent)", fontWeight: 800 }}>
          {String(num).padStart(2, "0")}
        </div>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2 }}>{category?.toUpperCase()}</span>
        {badge && <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, fontFamily: MONO, letterSpacing: 1, marginLeft: "auto" }}>{badge}</span>}
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", marginBottom: 6, letterSpacing: -0.5, lineHeight: 1.2, fontFamily: SANS }}>{title}</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0, fontFamily: MONO }}>{desc}</p>
    </div>
  );
}

// ── ObjectiveCard ─────────────────────────────────────────────────────────────
function ObjectiveCard({ text }) {
  return (
    <div style={{ background: "rgba(var(--accent-rgb),0.05)", border: "1px solid rgba(var(--accent-rgb),0.15)", borderLeft: "3px solid var(--accent)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🎯</span>
      <div>
        <div style={{ fontSize: 9, color: "var(--accent)", fontFamily: MONO, letterSpacing: 2, marginBottom: 5, fontWeight: 700 }}>OBJECTIVE</div>
        <p style={{ fontSize: 13, color: "var(--text-sub)", margin: 0, lineHeight: 1.6, fontFamily: SANS }}>{text}</p>
      </div>
    </div>
  );
}

// ── InputRow ──────────────────────────────────────────────────────────────────
function InputRow({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ flex: 1 }}>
      {label && <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2, marginBottom: 6 }}>{label}</div>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="theme-input"
        style={{ width: "100%", boxSizing: "border-box", borderRadius: 8, padding: "11px 14px", fontFamily: MONO, fontSize: 12, outline: "none", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e  => e.target.style.borderColor = "var(--input-border)"}
      />
    </div>
  );
}

// ── PrimaryBtn ────────────────────────────────────────────────────────────────
const PrimaryBtn = ({ onClick, children, disabled, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "var(--bg-card-faint)" : "linear-gradient(135deg, #1d4ed8, #0284c7)",
      border: `1px solid ${disabled ? "var(--border)" : "rgba(56,189,248,0.25)"}`,
      color: disabled ? "var(--text-muted)" : "#fff",
      padding: "11px 22px", borderRadius: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1,
      flexShrink: 0, transition: "all 0.2s",
      ...style,
    }}
  >
    {children}
  </button>
);

// ── ResultBanner ──────────────────────────────────────────────────────────────
function ResultBanner({ result, onNext }) {
  if (!result) return null;
  const ok  = result.success;
  const err = !!result.error;
  return (
    <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: ok ? STATUS.greenDim : err ? STATUS.redDim : STATUS.yellowDim, border: `1px solid ${ok ? STATUS.greenBorder : err ? STATUS.redBorder : STATUS.yellowBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, color: ok ? STATUS.green : err ? STATUS.red : STATUS.yellow, fontFamily: MONO, lineHeight: 1.5 }}>
        {ok ? "✓ " : err ? "⚠ " : "✗ "}{result.message || result.error}
      </span>
      {ok && onNext && (
        <button onClick={onNext} style={{ fontSize: 10, padding: "6px 16px", borderRadius: 20, background: STATUS.greenDim, border: `1px solid ${STATUS.greenBorder}`, color: STATUS.green, cursor: "pointer", fontFamily: MONO, letterSpacing: 1, flexShrink: 0 }}>
          Next →
        </button>
      )}
    </div>
  );
}

// ── ChallengeCard ─────────────────────────────────────────────────────────────
function ChallengeCard({ children }) {
  return (
    <div className="theme-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px" }}>
      {children}
    </div>
  );
}

// ── Challenge 1 ───────────────────────────────────────────────────────────────
function Challenge1({ onNext, onComplete }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure,   setSecure]   = useState(false);
  const [result,   setResult]   = useState(null);
  const hints = ["Think about what happens if you close the string early with a single quote (')", "SQL uses -- to start a comment, ignoring everything after it.", "Try making the WHERE clause always evaluate to true for the admin user.", "What if the username was: admin' -- ? The rest of the query would be commented out."];
  const solution = { payload: "admin' --", explanation: "The quote closes the string early and -- comments out the password check. The DB only checks if username='admin'.", prevention: "Use parameterized queries. Never concatenate user input directly into SQL strings." };
  const handle = async (e) => { e.preventDefault(); const d = await sqliApi.challenge1Login(username, password, secure); setResult(d); if (d.success && d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={1} category="Authentication" title="Break the Login" desc="Bypass authentication using classic SQL injection" badge="Beginner" />
      <ObjectiveCard text="Log in as the admin user without knowing their password." />
      <ChallengeCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: MONO }}>Login Form</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, fontFamily: MONO, color: secure ? STATUS.green : STATUS.red }}>{secure ? "SECURE MODE" : "VULNERABLE"}</span>
            <div onClick={() => setSecure(!secure)} style={{ width: 40, height: 22, borderRadius: 11, background: secure ? "#15803d" : "#7f1d1d", cursor: "pointer", position: "relative", border: `1px solid ${secure ? "#22c55e40" : "#ef444440"}`, transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 3, left: secure ? 20 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <InputRow label="USERNAME" value={username} onChange={setUsername} placeholder="e.g. admin' --" />
          <InputRow label="PASSWORD" value={password} onChange={setPassword} placeholder="anything" type="password" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <PrimaryBtn onClick={handle}>⚡ Execute</PrimaryBtn>
          <PrimaryBtn onClick={() => { setUsername(""); setPassword(""); setResult(null); }} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)" }}>Reset</PrimaryBtn>
        </div>
        <ResultBanner result={result} onNext={onNext} />
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Challenge 2 ───────────────────────────────────────────────────────────────
function Challenge2({ onNext, onComplete }) {
  const [q, setQ] = useState(""); const [result, setResult] = useState(null);
  const hints = ["Break the original string by injecting a single quote (')", "UNION SELECT only works if both queries return the same number of columns.", "The original query returns 3 columns (id, name, description).", "Don't forget to comment out the rest with --."];
  const solution = { payload: "' UNION SELECT id, username, password FROM users --", explanation: "The quote closes the LIKE string early. UNION appends results from the users table, leaking passwords into the product list.", prevention: "db.execute('SELECT * FROM products WHERE name LIKE :q', {'q': f'%{term}%'})" };
  const handle = async (e) => { e.preventDefault(); const d = await sqliApi.challenge2Search(q); setResult(d); if (d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={2} category="Data Extraction" title="Data Exfiltration" desc="Extract hidden data using UNION SELECT" badge="Beginner" />
      <ObjectiveCard text="Leak the administrator's password from the users table." />
      <ChallengeCard>
        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2, marginBottom: 8 }}>PRODUCT SEARCH</div>
        <form onSubmit={handle} style={{ display: "flex", gap: 10 }}>
          <InputRow value={q} onChange={setQ} placeholder="Try injecting a UNION SELECT..." />
          <PrimaryBtn>Search</PrimaryBtn>
        </form>
        {result?.success && result.data?.length > 0 && (
          <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: MONO }}>
              <thead>
                <tr style={{ background: "var(--bg-deep)" }}>
                  {["ID","Name","Description"].map(h => <th key={h} style={{ padding: "10px 14px", color: "var(--text-faint)", textAlign: "left", fontSize: 9, letterSpacing: 2 }}>{h.toUpperCase()}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border-row)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{row.id}</td>
                    <td style={{ padding: "10px 14px", color: "var(--text)" }}>{row.name}</td>
                    <td style={{ padding: "10px 14px", color: row.description?.includes("CyberCare") ? STATUS.red : "var(--accent)" }}>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result?.error && <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: STATUS.redDim, border: `1px solid ${STATUS.redBorder}`, color: STATUS.red, fontSize: 12 }}>⚠ {result.error}</div>}
        {result?.token && <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><PrimaryBtn onClick={onNext}>Next →</PrimaryBtn></div>}
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Challenge 3 ───────────────────────────────────────────────────────────────
function Challenge3({ onNext, onComplete }) {
  const [userId, setUserId] = useState(""); const [result, setResult] = useState(null);
  const hints = ["The input is a number — no quotes needed to break out.", "What happens if you CAST() a password text string into an INTEGER?", "Force a mathematical comparison that evaluates your subquery.", "Try: 1 AND 1=CAST((SELECT password FROM users WHERE username='admin') AS INTEGER)"];
  const solution = { payload: "1 AND 1=CAST((SELECT password FROM users WHERE username='admin') AS INTEGER)", explanation: "DB evaluates the AND clause, runs the subquery to get the password, tries to convert it to an integer, fails, and prints the value in the error output.", prevention: "Never expose raw database errors to users. Use generic HTTP 500 messages and always parameterize inputs." };
  const handle = async (e) => { e.preventDefault(); const d = await sqliApi.challenge3Status(userId); setResult(d); if (d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={3} category="Reconnaissance" title="Error Reveals" desc="Force database errors to leak schema information" badge="Intermediate" />
      <ObjectiveCard text="Force the database to crash and leak the admin password inside the error message." />
      <ChallengeCard>
        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2, marginBottom: 8 }}>USER ID LOOKUP</div>
        <form onSubmit={handle} style={{ display: "flex", gap: 10 }}>
          <InputRow value={userId} onChange={setUserId} placeholder="Try injecting a CAST attack..." />
          <PrimaryBtn>Check Status</PrimaryBtn>
        </form>
        {result && <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 10, background: result.success ? STATUS.greenDim : STATUS.redDim, border: `1px solid ${result.success ? STATUS.greenBorder : STATUS.redBorder}`, color: result.success ? STATUS.green : STATUS.red, fontSize: 12, fontFamily: MONO, lineHeight: 1.6 }}>{result.success ? `✓ ${result.message}` : result.error ? `⚠ FATAL DB ERROR: ${result.error}` : `✗ ${result.message}`}</div>}
        {result?.token && <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><PrimaryBtn onClick={onNext}>Next →</PrimaryBtn></div>}
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Challenge 4 ───────────────────────────────────────────────────────────────
function Challenge4({ onNext, onComplete }) {
  const [username, setUsername] = useState(""); const [result, setResult] = useState(null);
  const hints = ["If your statement is TRUE, the app says 'Taken'. If FALSE, it says 'Available'.", "Use SUBSTRING() to check specific letters of the admin's password.", "Try: admin' AND SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1)='C' --"];
  const solution = { payload: "admin' AND SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1)='C' --", explanation: "The query checks if username is 'admin' AND the first letter of their password is 'C'. Both true → returns 'Taken', confirming the character.", prevention: "Use parameterized queries. Avoid boolean-style feedback that leaks data character by character." };
  const handle = async (e) => { e.preventDefault(); const d = await sqliApi.challenge4Check(username); setResult(d); if (d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={4} category="Blind SQLi" title="True or False" desc="Infer hidden data through boolean responses" badge="Intermediate" />
      <ObjectiveCard text="Extract the first letter of the admin password without seeing any database output." />
      <ChallengeCard>
        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2, marginBottom: 8 }}>USERNAME AVAILABILITY CHECK</div>
        <form onSubmit={handle} style={{ display: "flex", gap: 10 }}>
          <InputRow value={username} onChange={setUsername} placeholder="Inject a boolean condition..." />
          <PrimaryBtn>Check</PrimaryBtn>
        </form>
        {result && <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 10, fontFamily: MONO, fontSize: 12, background: result.exists ? STATUS.redDim : STATUS.greenDim, border: `1px solid ${result.exists ? STATUS.redBorder : STATUS.greenBorder}`, color: result.exists ? STATUS.red : STATUS.green }}>{result.exists ? `✗ ${result.message}` : `✓ ${result.message}`}</div>}
        {result?.token && <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><PrimaryBtn onClick={onNext}>Next →</PrimaryBtn></div>}
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Challenge 5 ───────────────────────────────────────────────────────────────
function Challenge5({ onNext, onComplete }) {
  const [email, setEmail] = useState(""); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  const hints = ["The endpoint returns the same message regardless of input.", "Force the database to behave differently in a measurable way.", "In PostgreSQL, pg_sleep(seconds) forces a pause.", "Try: admin' AND 1=(SELECT 1 FROM pg_sleep(3)) --"];
  const solution = { payload: "admin' AND 1=(SELECT 1 FROM pg_sleep(3)) --", explanation: "If 'admin' exists, DB evaluates pg_sleep(3), causing a 3-second delay. If not, sleep is skipped — letting you map valid users by measuring response time.", prevention: "Use parameterized queries. Never concatenate user input into SQL." };
  const handle = async (e) => { e.preventDefault(); setLoading(true); setResult(null); const d = await sqliApi.challenge5Reset(email); setResult(d); setLoading(false); if (d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={5} category="Advanced" title="Timing Attack" desc="Use timing differences to extract data" badge="Advanced" />
      <ObjectiveCard text="Confirm the admin user exists by forcing the server to delay its response by 2+ seconds." />
      <ChallengeCard>
        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2, marginBottom: 8 }}>PASSWORD RESET FORM</div>
        <form onSubmit={handle} style={{ display: "flex", gap: 10 }}>
          <InputRow value={email} onChange={setEmail} placeholder="Inject a pg_sleep payload..." />
          <PrimaryBtn disabled={loading}>{loading ? "⏳ Waiting..." : "Send Link"}</PrimaryBtn>
        </form>
        {result && (
          <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 10, background: STATUS.blueDim, border: `1px solid ${STATUS.blueBorder}`, fontFamily: MONO, fontSize: 12, color: "var(--text-muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>ℹ {result.message}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10 }}>⏱</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: result.time_taken_ms > 2000 ? STATUS.red : STATUS.green }}>{result.time_taken_ms}ms</span>
            </div>
          </div>
        )}
        {result?.token && <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><PrimaryBtn onClick={onNext}>Next →</PrimaryBtn></div>}
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Challenge 6 ───────────────────────────────────────────────────────────────
function Challenge6({ onNext, onComplete }) {
  const [profileName, setProfileName] = useState(""); const [saveMsg, setSaveMsg] = useState(null); const [result, setResult] = useState(null);
  const hints = ["This is a two-step attack. Store your payload first, then execute it.", "Phase 1 storage is secure — payload is saved as literal text.", "Phase 2 retrieves your profile name and blindly inserts it into a SELECT.", "Set profile to: x' UNION SELECT id, password FROM users -- then load the viewer."];
  const solution = { payload: "x' UNION SELECT id, password FROM users --", explanation: "The app stores the payload safely. But Phase 2 trusts its own database and blindly concatenates the stored name into a WHERE clause, triggering the UNION extraction.", prevention: "Always parameterize queries even when data comes from your own database. Never trust stored data." };
  const handleSave = async (e) => { e.preventDefault(); const d = await sqliApi.challenge6Save(profileName); setSaveMsg(d.message); setResult(null); };
  const handleView = async () => { const d = await sqliApi.challenge6View(); setResult(d); setSaveMsg(null); if (d.token) { saveToken(d.token, d.completed); onComplete(d.token, d.completed); } };
  return (
    <div>
      <ChallengeHeader num={6} category="Advanced" title="Stored Payload" desc="Register a payload that executes in a different context" badge="Advanced" />
      <ObjectiveCard text="Exploit Second-Order SQL injection — plant a payload in your profile that detonates when viewed." />
      <ChallengeCard>
        <div style={{ padding: "18px 20px", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--bg-row)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, color: "var(--accent)", fontWeight: 800 }}>1</div>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 2 }}>PHASE 1 — STORE PAYLOAD</span>
          </div>
          <form onSubmit={handleSave} style={{ display: "flex", gap: 10 }}>
            <InputRow value={profileName} onChange={setProfileName} placeholder="Enter profile name or injection payload..." />
            <PrimaryBtn style={{ background: "var(--bg-card-faint)", border: "1px solid var(--border)" }}>Save</PrimaryBtn>
          </form>
          {saveMsg && <div style={{ marginTop: 10, fontSize: 12, color: STATUS.green, fontFamily: MONO }}>✓ {saveMsg}</div>}
        </div>
        <div style={{ padding: "18px 20px", border: "1px solid rgba(var(--accent-rgb),0.2)", borderRadius: 10, background: "rgba(var(--accent-rgb),0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, color: "var(--accent)", fontWeight: 800 }}>2</div>
              <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: MONO, letterSpacing: 2 }}>PHASE 2 — EXECUTE PAYLOAD</span>
            </div>
            <span style={{ fontSize: 9, color: "var(--text-faint)", fontFamily: MONO }}>Simulates Admin View</span>
          </div>
          <PrimaryBtn onClick={handleView} style={{ width: "100%", justifyContent: "center", display: "flex" }}>⚡ Load Profile Viewer</PrimaryBtn>
        </div>
        {result?.success && result.data && (
          <div style={{ marginTop: 16, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: MONO }}>
              <thead>
                <tr style={{ background: "var(--bg-deep)" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-faint)", textAlign: "left", fontSize: 9, letterSpacing: 2 }}>ID</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-faint)", textAlign: "left", fontSize: 9, letterSpacing: 2 }}>PROFILE DATA</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border-row)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{row.id}</td>
                    <td style={{ padding: "10px 14px", color: row.name?.includes("CyberCare") ? STATUS.red : "var(--accent)" }}>{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result?.token && <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><PrimaryBtn onClick={onNext} style={{ background: "linear-gradient(135deg,#0e7490,#0369a1)" }}>🏆 Finish Lab</PrimaryBtn></div>}
        <Terminal query={result?.query} />
      </ChallengeCard>
      <HintBox hints={hints} solution={solution} />
    </div>
  );
}

// ── Intro ─────────────────────────────────────────────────────────────────────
function IntroView({ onNext }) {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: 3, marginBottom: 10 }}>BEFORE YOU BEGIN</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", marginBottom: 8, letterSpacing: -1, lineHeight: 1.15, fontFamily: SANS }}>
          Learn SQL Injection<br />
          <span style={{ color: "var(--accent)" }}>By Breaking Things.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: MONO, margin: 0 }}>6 challenges · safe isolated environment · instant feedback · guided solutions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
        {[
          { icon: "⚠", title: "The Vulnerability", color: STATUS.red,    desc: "Apps that concatenate user input directly into SQL queries are vulnerable. User input becomes part of the SQL command itself." },
          { icon: "🗄", title: "The Impact",        color: STATUS.yellow, desc: "Attackers can bypass login, dump entire databases, modify records, or in some cases execute system-level commands." },
          { icon: "🛡", title: "The Prevention",    color: STATUS.green,  desc: "Always use parameterized queries. Never trust user input. Apply least-privilege principles to database accounts." },
        ].map(({ icon, title, color, desc }) => (
          <div key={title} className="theme-card" style={{ border: "1px solid var(--border)", borderTop: `2px solid ${color}`, borderRadius: 12, padding: "20px 20px" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontWeight: 800, color, fontSize: 12, fontFamily: MONO, letterSpacing: 1, marginBottom: 8 }}>{title.toUpperCase()}</div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {[{ num: "6", label: "Challenges" }, { num: "6", label: "Attack Types" }].map(({ num, label }) => (
          <div key={label} className="theme-stat-card" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)", fontFamily: MONO }}>{num}</span>
            <span style={{ fontSize: 13, color: "var(--text-sub)", fontFamily: SANS }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: STATUS.yellowDim, border: `1px solid ${STATUS.yellowBorder}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: STATUS.yellow, fontFamily: MONO, letterSpacing: 2, marginBottom: 8 }}>⚠ EDUCATIONAL USE ONLY</div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>This lab uses an isolated database with fake data. All SQL injection happens in a safe sandbox. Never use these techniques on systems you don't own.</p>
      </div>

      <PrimaryBtn onClick={onNext} style={{ padding: "14px 36px", fontSize: 12, display: "block", width: "100%", textAlign: "center" }}>
        ▶ Start Challenge 1 — Break the Login
      </PrimaryBtn>
    </div>
  );
}

// ── Completion ────────────────────────────────────────────────────────────────
function CompletionView({ onReturnHome }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", marginBottom: 8, letterSpacing: -1, fontFamily: SANS }}>Lab Conquered</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: MONO, margin: 0 }}>All 6 SQL Injection challenges completed</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32, textAlign: "left" }}>
        {[
          ["Authentication", "Bypassed login using SQL comments & tautologies.", STATUS.green],
          ["UNION Extraction","Exfiltrated entire tables via UNION SELECT.",       STATUS.green],
          ["Error Analysis",  "Leaked data by forcing a DB crash.",               STATUS.yellow],
          ["Boolean Blind",   "Inferred data character-by-character.",            STATUS.yellow],
          ["Timing Attacks",  "Mapped users using pg_sleep() delays.",            STATUS.red],
          ["Second-Order",    "Detonated a stored payload in another context.",   STATUS.red],
        ].map(([t, d, c]) => (
          <div key={t} className="theme-card" style={{ border: "1px solid var(--border)", borderLeft: `3px solid ${c}`, borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontWeight: 700, color: c, fontSize: 10, fontFamily: MONO, letterSpacing: 1, marginBottom: 6 }}>✓ {t.toUpperCase()}</div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6, fontFamily: SANS }}>{d}</p>
          </div>
        ))}
      </div>
      <PrimaryBtn onClick={onReturnHome} style={{ padding: "13px 32px", fontSize: 12 }}>← Return to Security Labs</PrimaryBtn>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SqliLab() {
  const navigate = useNavigate();
  const [view,      setView]      = useState("intro");
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    localStorage.removeItem("sqli_token");
    localStorage.removeItem("sqli_completed");
  }, []);

  const handleComplete = (token, list) => {
    if (token) localStorage.setItem("sqli_token", token);
    if (list)  { localStorage.setItem("sqli_completed", JSON.stringify(list)); setCompleted(list); }
  };

  const handleLogout = () => {
    localStorage.removeItem("cybercare_token");
    localStorage.removeItem("cybercare_user");
    navigate("/");
  };

  const goNext = (id) => setView(id);

  const views = {
    intro:      <IntroView      onNext={() => goNext("challenge1")} />,
    challenge1: <Challenge1     onNext={() => goNext("challenge2")} onComplete={handleComplete} />,
    challenge2: <Challenge2     onNext={() => goNext("challenge3")} onComplete={handleComplete} />,
    challenge3: <Challenge3     onNext={() => goNext("challenge4")} onComplete={handleComplete} />,
    challenge4: <Challenge4     onNext={() => goNext("challenge5")} onComplete={handleComplete} />,
    challenge5: <Challenge5     onNext={() => goNext("challenge6")} onComplete={handleComplete} />,
    challenge6: <Challenge6     onNext={() => goNext("completion")} onComplete={handleComplete} />,
    completion: <CompletionView onReturnHome={() => navigate("/technical-user/security-labs")} />,
  };

  return (
    <TechLayout onLogout={handleLogout} breadcrumb="Security Labs / SQLi Lab">
      {/* Top navigation — replaces sidebar */}
      <TopNav view={view} setView={setView} completed={completed} />

      {/* Full-width content area */}
      <div
        className="theme-main-area"
        style={{
          borderRadius: 12,
          border: "1px solid var(--border)",
          padding: "36px 48px",
          minHeight: "calc(100vh - 260px)",
        }}
      >
        {views[view]}
      </div>
    </TechLayout>
  );
}