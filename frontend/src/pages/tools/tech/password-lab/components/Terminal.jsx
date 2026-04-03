import { useState, useEffect, useRef } from "react";
import { execTerminal } from "../../../../../api/pcl";
import { useTheme } from "../../../../../context/ThemeContext";

// ─────────────────────────────────────────────────────────────
// Terminal.jsx
//
// ✅ BUG FIX: Backend returns `current_step` (snake_case).
//    Was previously read as `res.currentStep` → always undefined
//    → step never advanced in InstructionPanel. Now fixed.
//
// ✅ THEME: Now respects dark/light theme via useTheme().
// ─────────────────────────────────────────────────────────────

export default function Terminal({ sessionId, difficulty, onStepUpdate }) {
  const { isDark } = useTheme();

  const [history, setHistory] = useState([
    "Welcome to the Password Cracking Lab Terminal",
    `Difficulty: ${difficulty || "unknown"} | Session: ${sessionId}`,
    "─────────────────────────────────────",
    "",
  ]);
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleCommand = async () => {
    const trimmed = command.trim();
    if (!trimmed || !sessionId || loading) return;

    setHistory((prev) => [...prev, `$ ${trimmed}`]);
    setCommand("");
    setLoading(true);

    try {
      const res = await execTerminal(sessionId, trimmed);

      const stripAnsi = (str) =>
        str.replace(/(\x1b|\x1B)\[[0-9;]*[mGKHF]/g, "")
           .replace(/\[[0-9;]*[mGKHF]/g, "");

      const outputLines = stripAnsi(res.output || "No output")
        .split("\n")
        .map((line) => line || " ");

      setHistory((prev) => [...prev, ...outputLines, ""]);

      // Auto-show cracked password after hashcat finishes
      const outputText = res.output || "";
      const isHashcatCmd = trimmed.toLowerCase().startsWith("hashcat") && !trimmed.includes("--show");
      const crackedInOutput = outputText.includes("Status") && outputText.includes("Cracked");
      if (isHashcatCmd && crackedInOutput) {
        setTimeout(async () => {
          try {
            const showRes = await execTerminal(sessionId, "hashcat --show --session=lab hash.txt");
            const showLines = stripAnsi(showRes.output || "")
              .split("\n")
              .filter(l => l.trim())
              .map(l => {
                if (l.includes(":") && l.split(":").length === 2) {
                  const pwd = l.split(":")[1].trim();
                  return pwd ? `🔓 PASSWORD FOUND: ${pwd}` : l;
                }
                return l;
              });
            if (showLines.length > 0) {
              setHistory((prev) => [...prev, "--- hashcat --show result ---", ...showLines, ""]);
            }
          } catch { /* ignore */ }
        }, 500);
      }

      // ✅ KEY FIX: Backend sends `current_step` (snake_case), NOT `currentStep`
      if (onStepUpdate) {
        onStepUpdate(
          res.current_step  ?? res.currentStep,
          res.hints_used    ?? res.hintsUsed,
          res.current_score ?? res.currentScore,
        );
      }

    } catch (err) {
      let errMsg = "Command failed";
      if (typeof err === "string") errMsg = err;
      else if (err?.message && typeof err.message === "string") errMsg = err.message;
      else if (err?.response?.data?.detail) errMsg = String(err.response.data.detail);
      setHistory((prev) => [...prev, `❌ ${errMsg}`, ""]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Theme-aware color palette
  const t = isDark ? {
    bg: "#000", header: "#0a0f1f", headerBorder: "#1e3a5f",
    border: "#00bfff", shadow: "0 0 14px rgba(0,191,255,0.3)",
    inputBg: "#000", inputBorder: "#1e3a5f",
    textDefault: "#00ff88", textCmd: "#00bfff",
    textErr: "#f87171", textStatus: "#facc15",
    textProgress: "#94a3b8", prompt: "#00bfff",
    sessionLabel: "#475569", loading: "#facc15",
    crackedBg: "#00ffcc", crackedText: "#000",
  } : {
    bg: "#f0f7ff", header: "#ddeaf8", headerBorder: "#b6d4f0",
    border: "#0284c7", shadow: "0 0 14px rgba(2,132,199,0.18)",
    inputBg: "#ffffff", inputBorder: "#b6d4f0",
    textDefault: "#065f46", textCmd: "#0369a1",
    textErr: "#dc2626", textStatus: "#b45309",
    textProgress: "#4b5563", prompt: "#0369a1",
    sessionLabel: "#64748b", loading: "#b45309",
    crackedBg: "#059669", crackedText: "#fff",
  };

  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        background: t.bg, color: t.textDefault,
        fontFamily: "'Courier New', Courier, monospace",
        borderRadius: "10px", border: `1px solid ${t.border}`,
        boxShadow: t.shadow, height: "400px", overflow: "hidden",
        transition: "background 0.3s, border-color 0.3s",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header bar */}
      <div style={{
        background: t.header, padding: "8px 14px",
        borderBottom: `1px solid ${t.headerBorder}`,
        display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
        transition: "background 0.3s",
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#facc15", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff88", display: "inline-block" }} />
        <span style={{ marginLeft: "8px", fontSize: "12px", color: t.sessionLabel }}>
          lab-terminal — session {sessionId}
        </span>
      </div>

      {/* Output history */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", fontSize: "13px", lineHeight: "1.6" }}>
        {history.map((line, i) => {
          const isCracked =
            line.includes(":") && !line.startsWith("$") && !line.startsWith("❌")
            && !line.includes("http") && !line.includes("//")
            && line.split(":").length === 2
            && line.split(":")[0].length >= 32
            && line.split(":")[1].trim().length > 0;

          const isStatus   = line.includes("Status") && line.includes("Cracked");
          const isProgress = line.startsWith("Progress") || line.startsWith("Speed") || line.startsWith("Recovered");

          return (
            <div key={i} style={{
              color: line.startsWith("$")  ? t.textCmd
                   : line.startsWith("❌") ? t.textErr
                   : line.startsWith("🎉") ? t.textDefault
                   : isCracked             ? t.crackedText
                   : isStatus              ? t.textStatus
                   : isProgress            ? t.textProgress
                   : t.textDefault,
              background:   isCracked ? t.crackedBg : "transparent",
              padding:      isCracked ? "4px 8px" : "0",
              borderRadius: isCracked ? "4px" : "0",
              fontWeight:   isCracked ? "900" : "normal",
              fontSize:     isCracked ? "14px" : "13px",
              whiteSpace:   "pre-wrap", wordBreak: "break-all",
              marginBottom: isCracked ? "4px" : "0",
            }}>
              {isCracked ? `🔓 CRACKED: ${line.split(":")[1].trim()}  ← Submit this password!` : line}
            </div>
          );
        })}

        {loading && <div style={{ color: t.loading }}>⏳ Running...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "10px 16px", borderTop: `1px solid ${t.inputBorder}`,
        background: t.inputBg, flexShrink: 0, transition: "background 0.3s",
      }}>
        <span style={{ color: t.prompt, marginRight: "8px", fontSize: "14px" }}>$</span>
        <input
          ref={inputRef}
          style={{
            flex: 1, background: "transparent", color: t.textDefault,
            border: "none", outline: "none",
            fontFamily: "'Courier New', Courier, monospace", fontSize: "13px",
            opacity: loading ? 0.4 : 1, cursor: loading ? "not-allowed" : "text",
          }}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !loading) handleCommand(); }}
          disabled={loading}
          placeholder={loading ? "Running..." : "Type a command..."}
          autoComplete="off" autoCapitalize="off" spellCheck={false}
        />
      </div>
    </div>
  );
}
