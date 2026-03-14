import { useState } from "react";
import axios from "axios";
import {
  Mail, ShieldX, ShieldCheck, Loader2, AlertTriangle,
  Link2, CreditCard, UserX, Gift, Eye, Info,
  ClipboardPaste, X
} from "lucide-react";

const EXAMPLES = [
  {
    label: "Bank Phishing",
    text: `Dear Customer,\n\nYour account has been temporarily suspended due to unusual activity. Click the link below to verify your identity immediately or your account will be closed:\n\nhttp://secure-banklogin.xyz/verify\n\nThis is urgent. Respond within 24 hours.\n\nBank Security Team`,
  },
  {
    label: "Prize Scam",
    text: `CONGRATULATIONS! You have been selected as our lucky winner!\n\nYou've won $5,000 in our annual sweepstakes. To claim your prize, send us your full name, address and bank details to claim@prize-winners.tk\n\nAct now — offer expires in 12 hours!`,
  },
];

export default function EmailSpamWidget() {
  const [emailText, setEmailText] = useState("");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setEmailText(e.target.value);
    setCharCount(e.target.value.length);
    if (result) setResult(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEmailText(text);
      setCharCount(text.length);
      setResult(null);
    } catch { /* permission denied */ }
  };

  const handleClear = () => {
    setEmailText("");
    setCharCount(0);
    setResult(null);
    setError(null);
  };

  const checkSpam = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.post("http://localhost:8000/spam/check", {
        email: emailText,
      });
      setResult(res.data.prediction);
    } catch {
      setError("Could not reach the server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const isSpam = result === "Spam";

  return (
    <div className="space-y-4">

      {/* Input card */}
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(2,11,24,0.7)", border: "1px solid rgba(59,130,246,0.15)" }}>

        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mail size={14} style={{ color: "#60a5fa" }} />
            <span className="text-sm font-semibold text-white">Paste Email Content</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", color: "rgba(148,163,184,0.6)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; e.currentTarget.style.color = "#93c5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.2)"; e.currentTarget.style.color = "rgba(148,163,184,0.6)"; }}>
              <ClipboardPaste size={11} /> Paste
            </button>
            {emailText && (
              <button onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.6)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "rgba(239,68,68,0.6)"; }}>
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={emailText}
            onChange={handleChange}
            placeholder={"Paste suspicious email content here...\n\ne.g. 'Your account has been suspended. Click here to verify...'"}
            rows={8}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
            style={{
              background: "rgba(2,11,24,0.9)",
              border: `1px solid ${emailText ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.12)"}`,
              color: "#e2e8f0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              lineHeight: 1.7,
              caretColor: "#60a5fa",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"}
            onBlur={e => e.currentTarget.style.borderColor = emailText ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.12)"}
          />
          <div className="absolute bottom-2.5 right-3 text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(148,163,184,0.25)" }}>
            {charCount} chars
          </div>
        </div>

        {/* Try examples */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(148,163,184,0.3)", letterSpacing: "0.1em" }}>
            TRY EXAMPLE:
          </span>
          {EXAMPLES.map((ex) => (
            <button key={ex.label}
              onClick={() => { setEmailText(ex.text); setCharCount(ex.text.length); setResult(null); }}
              className="px-2.5 py-1 rounded-lg text-xs transition-all duration-150"
              style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)", color: "rgba(148,163,184,0.5)", fontFamily: "'JetBrains Mono', monospace" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.color = "#93c5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)"; e.currentTarget.style.color = "rgba(148,163,184,0.5)"; }}>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={checkSpam}
          disabled={!emailText.trim() || loading}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #0369a1)",
            border: "1px solid rgba(96,165,250,0.3)",
            color: "#fff",
          }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> ANALYZING...</>
            : <><Mail size={14} /> DETECT SPAM</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <AlertTriangle size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl p-5 slide-up"
          style={{
            background: isSpam ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)",
            border: `1px solid ${isSpam ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
          }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isSpam ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                color: isSpam ? "#ef4444" : "#22c55e",
                boxShadow: isSpam ? "0 0 18px rgba(239,68,68,0.2)" : "0 0 18px rgba(34,197,94,0.2)",
              }}>
              {isSpam ? <ShieldX size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <div className="font-extrabold text-lg" style={{ color: isSpam ? "#f87171" : "#4ade80" }}>
                {isSpam ? "Spam Detected!" : "Looks Legitimate"}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(148,163,184,0.4)" }}>
                {isSpam ? "ML MODEL FLAGGED THIS EMAIL" : "ML MODEL CLEARED THIS EMAIL"}
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(148,163,184,0.4)" }}>
              <span>CONFIDENCE</span>
              <span style={{ color: isSpam ? "#f87171" : "#4ade80" }}>
                {isSpam ? "HIGH RISK" : "LOW RISK"}
              </span>
            </div>
            <div className="score-track">
              <div className="score-fill"
                style={{
                  width: isSpam ? "88%" : "12%",
                  background: isSpam
                    ? "linear-gradient(90deg, #f97316, #ef4444)"
                    : "linear-gradient(90deg, #22c55e88, #22c55e)",
                }} />
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(148,163,184,0.7)" }}>
            {isSpam
              ? "This email shows characteristics commonly found in spam or phishing messages. Do not click any links, provide personal information, or reply."
              : "This email does not appear to be spam. Still be careful — verify the sender before clicking any links."}
          </p>

          <div className="flex items-start gap-2 p-3 rounded-xl"
            style={{
              background: isSpam ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.06)",
              border: `1px solid ${isSpam ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.15)"}`,
            }}>
            <Info size={12} className="flex-shrink-0 mt-0.5" style={{ color: isSpam ? "#f87171" : "#4ade80" }} />
            <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
              {isSpam
                ? "Mark as spam in your email app, do not unsubscribe, and report it to your email provider."
                : "If unexpected, verify the sender's address carefully before downloading attachments."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
