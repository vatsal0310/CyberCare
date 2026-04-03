import { useState } from "react";
import axios from "axios";
import {
  MessageSquare, ShieldX, ShieldCheck,
  Loader2, AlertTriangle, ClipboardPaste, X, Info,
} from "lucide-react";

const EXAMPLES = [
  { label: "Bank Alert", text: "URGENT: Your SBI account has been blocked. Verify now or lose access: http://sbi-secure-verify.tk/login" },
  { label: "Prize Scam", text: "Congratulations! You've won Rs.50,000 in our lucky draw. Call 9876543210 or click http://claim-prize.xyz to collect." },
];

export default function SmsSpamDetector() {
  const [sms,       setSms]       = useState("");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setSms(e.target.value);
    setCharCount(e.target.value.length);
    if (result) setResult(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSms(text); setCharCount(text.length); setResult(null);
    } catch { /* permission denied */ }
  };

  const handleClear = () => {
    setSms(""); setCharCount(0); setResult(null); setError(null);
  };

  const checkSms = async () => {
    if (!sms.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await axios.post("http://localhost:8000/detect-sms-spam", { message: sms });
      setResult(res.data);  // store full response
    } catch {
      setError("Could not reach the server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const isSpam = result?.prediction?.toUpperCase().startsWith("SPAM") ?? false;

  return (
    <div className="space-y-4">

      {/* Input card */}
      <div
        className="rounded-2xl p-5 theme-card"
        style={{ border: "1px solid rgba(129,140,248,0.2)" }}
      >
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} style={{ color: "#818cf8" }} />
            <span className="text-sm font-semibold theme-text">Paste SMS Message</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)"; e.currentTarget.style.color = "#c4b5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.2)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <ClipboardPaste size={11} /> Paste
            </button>
            {sms && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.6)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "rgba(239,68,68,0.6)"; }}
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={sms}
            onChange={handleChange}
            placeholder={"Paste suspicious SMS here...\n\ne.g. 'Your account is blocked. Click here to verify...'"}
            rows={6}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200 theme-input"
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${sms ? "rgba(129,140,248,0.35)" : "rgba(129,140,248,0.15)"}`,
              color: "var(--text)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              lineHeight: 1.7,
              caretColor: "#818cf8",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(129,140,248,0.6)"}
            onBlur={e => e.currentTarget.style.borderColor = sms ? "rgba(129,140,248,0.35)" : "rgba(129,140,248,0.15)"}
          />
          <div
            className="absolute bottom-2.5 right-3 text-xs theme-muted"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {charCount} chars
          </div>
        </div>

        {/* Try examples */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--text-faint)", letterSpacing: "0.1em" }}>
            TRY EXAMPLE:
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setSms(ex.text); setCharCount(ex.text.length); setResult(null); }}
              className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
              style={{ background: "rgba(129,140,248,0.07)", border: "1px solid rgba(129,140,248,0.15)", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)"; e.currentTarget.style.color = "#c4b5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(129,140,248,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Detect button */}
        <button
          onClick={checkSms}
          disabled={!sms.trim() || loading}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #4f46e5, #6d28d9)", border: "1px solid rgba(129,140,248,0.3)", color: "#fff" }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = "0 0 24px rgba(129,140,248,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> ANALYZING...</>
            : <><MessageSquare size={14} /> DETECT SMS SPAM</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <AlertTriangle size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className="rounded-2xl p-5 slide-up"
          style={{
            background: isSpam ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)",
            border: `1px solid ${isSpam ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isSpam ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                color: isSpam ? "#ef4444" : "#22c55e",
                boxShadow: isSpam ? "0 0 18px rgba(239,68,68,0.2)" : "0 0 18px rgba(34,197,94,0.2)",
              }}
            >
              {isSpam ? <ShieldX size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <div className="font-extrabold text-lg" style={{ color: isSpam ? "#f87171" : "#4ade80" }}>
                {isSpam ? "Spam SMS Detected!" : "Looks Legitimate"}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--text-muted)" }}>
                {isSpam ? "ML MODEL FLAGGED THIS MESSAGE" : "ML MODEL CLEARED THIS MESSAGE"}
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5 theme-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span>CONFIDENCE</span>
              <span style={{ color: isSpam ? "#f87171" : "#4ade80" }}>{result?.confidence_label ?? (isSpam ? "HIGH RISK" : "LOW RISK")}</span>
            </div>
            <div className="score-track">
              <div
                className="score-fill"
                style={{
                  width: `${Math.round((result?.spam_probability ?? (isSpam ? 0.88 : 0.12)) * 100)}%`,
                  background: isSpam ? "linear-gradient(90deg, #f97316, #ef4444)" : "linear-gradient(90deg, #22c55e88, #22c55e)",
                }}
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-3 theme-sub">
            {isSpam
              ? "This SMS shows characteristics of a smishing attack. Do not click any links or call any numbers mentioned in this message."
              : "This message does not appear to be spam. Still be cautious — if it's unexpected, verify the sender before taking any action."}
          </p>

          <div
            className="flex items-start gap-2 p-3 rounded-xl"
            style={{
              background: isSpam ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.06)",
              border: `1px solid ${isSpam ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.15)"}`,
            }}
          >
            <Info size={12} className="flex-shrink-0 mt-0.5" style={{ color: isSpam ? "#f87171" : "#4ade80" }} />
            <p className="text-xs theme-muted">
              {isSpam
                ? "Delete this message immediately. Report it to your mobile carrier by forwarding to 1909 (India) or your country's spam reporting number."
                : "If you weren't expecting this message, contact the sender through their official website or app — not through the number in the SMS."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}