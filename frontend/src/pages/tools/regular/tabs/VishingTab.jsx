import { Phone, PhoneCall, PhoneOff, ShieldAlert, UserX, AlertTriangle, CheckCircle } from "lucide-react";

const WARNING_SIGNS = [
  "Caller claims to be from your bank, police, or government and sounds very urgent",
  "Asks you to 'press 1' or stay on the line to avoid account suspension or arrest",
  "Requests your OTP, PIN, card number, or Aadhaar/SSN over the phone",
  "Tells you to install a remote access app like AnyDesk or TeamViewer",
  "Asks you to transfer money to a 'safe account' to protect your funds",
  "Threatens legal action, arrest, or account closure if you don't act immediately",
  "Number looks local but the caller has a foreign or robotic-sounding voice",
  "Offers a prize, refund, or reward — but asks for your bank details first",
];

const SCENARIOS = [
  {
    icon: ShieldAlert,
    title: "Fake Bank Call",
    color: "#f87171",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    caller: `"Hello, this is Rahul from SBI Fraud Prevention. We've detected suspicious activity on your account. To protect your funds, I need to verify your OTP right now..."`,
    tip: "SBI or any real bank will NEVER ask for your OTP over the phone. Hang up and call the number on the back of your card.",
  },
  {
    icon: UserX,
    title: "Fake Police / CBI Call",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.2)",
    caller: `"I am Inspector Sharma from CBI. Your Aadhaar number has been linked to money laundering. You will be arrested unless you transfer ₹50,000 to a safe government account immediately."`,
    tip: "The real police never call demanding money. This is a scare tactic. Hang up immediately.",
  },
  {
    icon: PhoneCall,
    title: "Tech Support Scam",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.06)",
    border: "rgba(167,139,250,0.2)",
    caller: `"Hi, this is Microsoft Windows Support. We've detected a virus on your computer. Please install AnyDesk so our engineer can fix it remotely before your data is lost..."`,
    tip: "Microsoft, Apple, and Google never call you about viruses. Never install remote access software for an unknown caller.",
  },
];

const DO_DONT = [
  { type: "do",   text: "Hang up immediately if the caller creates panic or urgency"         },
  { type: "do",   text: "Call back the company using the number on their official website"   },
  { type: "do",   text: "Tell a trusted family member about suspicious calls"                },
  { type: "dont", text: "Never share your OTP, PIN, or password over a call"                },
  { type: "dont", text: "Never install apps like AnyDesk on request from a caller"          },
  { type: "dont", text: "Never transfer money to a 'safe account' — it doesn't exist"       },
];

export default function VishingTab() {
  return (
    <div className="space-y-6">

      {/* ── Section header ── */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4" }}
        >
          <Phone size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Voice Phishing (Vishing)</h2>
          <p className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
            Phone call scams that impersonate banks, police, and tech support.
          </p>
        </div>
      </div>

      {/* ── What is Vishing ── */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "rgba(2,11,24,0.6)",
          border: "1px solid rgba(6,182,212,0.12)",
        }}
      >
        <h3 className="text-sm font-semibold text-white">What is Vishing?</h3>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.65)" }}>
          Vishing (Voice + Phishing) is when scammers call you on the phone pretending
          to be someone you trust — your bank, the police, a government agency, or a tech
          support team. They use fear, urgency, and authority to pressure you into
          giving away money or personal information before you have time to think clearly.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.65)" }}>
          Modern vishing scams can even spoof caller ID to show a real bank phone number,
          making them very convincing. The best defence is always to hang up and call back
          on a number you look up yourself.
        </p>

        {/* Warning signs */}
        <div
          className="rounded-xl p-4 mt-1"
          style={{
            background: "rgba(6,182,212,0.05)",
            border: "1px solid rgba(6,182,212,0.18)",
          }}
        >
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "#22d3ee", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
          >
            ⚠ COMMON WARNING SIGNS
          </p>
          <ul className="space-y-1.5">
            {WARNING_SIGNS.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span style={{ color: "#06b6d4", flexShrink: 0, marginTop: 1 }}>›</span>
                <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Real scenario examples ── */}
      <div>
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "rgba(148,163,184,0.4)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}
        >
          // REAL VISHING SCENARIOS
        </p>
        <div className="space-y-3">
          {SCENARIOS.map(({ icon: Icon, title, color, bg, border, caller, tip }) => (
            <div
              key={title}
              className="rounded-xl p-4"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              {/* Scenario title */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}20`, color }}
                >
                  <Icon size={14} />
                </div>
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {title.toUpperCase()}
                </span>
              </div>

              {/* Fake caller script */}
              <div
                className="rounded-lg p-3 mb-3 text-xs leading-relaxed"
                style={{
                  background: "rgba(0,0,0,0.35)",
                  borderLeft: `3px solid ${color}55`,
                  color: "rgba(226,232,240,0.7)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                }}
              >
                <span style={{ color: "rgba(148,163,184,0.35)", fontSize: "0.6rem" }}>CALLER SAYS: </span><br />
                {caller}
              </div>

              {/* What to do */}
              <div className="flex items-start gap-2">
                <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#4ade80" }} />
                <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                  <span style={{ color: "#4ade80", fontWeight: 600 }}>What to do: </span>
                  {tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Do's and Don'ts ── */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(2,11,24,0.6)",
          border: "1px solid rgba(6,182,212,0.1)",
        }}
      >
        <p
          className="text-xs font-semibold mb-4"
          style={{ color: "rgba(148,163,184,0.4)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}
        >
          // DO'S &amp; DON'TS
        </p>
        <div className="space-y-2">
          {DO_DONT.map(({ type, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 py-2.5 px-3 rounded-xl transition-all duration-200"
              style={{
                background: type === "do" ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                border: `1px solid ${type === "do" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}`,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = type === "do" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = type === "do" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{
                  background: type === "do" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: type === "do" ? "#4ade80" : "#f87171",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                }}
              >
                {type === "do" ? "✓" : "✗"}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.65)" }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Emergency tip ── */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.07), rgba(14,116,144,0.05))",
          border: "1px solid rgba(6,182,212,0.2)",
        }}
      >
        <PhoneOff size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#22d3ee" }} />
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#22d3ee" }}>
            The Golden Rule
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.6)" }}>
            No legitimate bank, government agency, or company will ever call you demanding
            immediate payment, an OTP, or remote access to your device. If you feel pressured
            — <span style={{ color: "#22d3ee" }}>hang up immediately</span> and call back on a number
            you find yourself from the official website.
          </p>
        </div>
      </div>

    </div>
  );
}
