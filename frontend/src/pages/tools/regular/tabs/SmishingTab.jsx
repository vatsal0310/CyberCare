import { MessageSquare } from "lucide-react";
import SmsSpamDetector from "../SmsSpamDetector";

export default function SmishingTab() {
  return (
    <div className="space-y-6">

      {/* Section header */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}
        >
          <MessageSquare size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold theme-text">SMS Phishing (Smishing)</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Scam text messages designed to steal your personal information.
          </p>
        </div>
      </div>

      {/* Awareness section */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "var(--bg-input)",
          border: "1px solid rgba(129,140,248,0.12)",
        }}
      >
        <h3 className="text-sm font-semibold theme-text">What is Smishing?</h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Smishing (SMS + Phishing) is when scammers send fake text messages pretending
          to be your bank, delivery company, government, or mobile operator. They want
          you to click a link or call a number so they can steal your money or personal details.
        </p>

        {/* Warning signs */}
        <div
          className="rounded-xl p-4 mt-2"
          style={{
            background: "rgba(129,140,248,0.06)",
            border: "1px solid rgba(129,140,248,0.2)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
          >
            ⚠ COMMON WARNING SIGNS
          </p>
          <ul className="space-y-1.5">
            {[
              "Message claims your package is stuck or undelivered — with a suspicious link",
              "Says your bank account is blocked and asks you to verify via a link",
              "Offers a prize, cashback, or refund — just click here to claim",
              "Sender number looks like a random mobile number, not a company short code",
              "Creates urgency — 'Act within 2 hours or your account will be closed'",
              "Link uses a short URL (bit.ly) or a strange domain you don't recognise",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span style={{ color: "#a78bfa", flexShrink: 0, marginTop: 1 }}>›</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real example */}
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "#f87171", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
          >
            📱 EXAMPLE SMISHING MESSAGE
          </p>
          <p
            className="text-xs leading-relaxed p-3 rounded-lg"
            style={{
              color: "var(--text-sub)",
              fontFamily: "'JetBrains Mono', monospace",
              background: "rgba(0,0,0,0.3)",
              borderLeft: "3px solid rgba(239,68,68,0.4)",
            }}
          >
            "HDFC Bank: Your a/c has been temporarily blocked. Verify immediately at
            http://hdfc-secure-login.xyz or call 9876XXXXXX. Ignore at your own risk."
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Real banks never send links like this. Always open your banking app directly.
          </p>
        </div>
      </div>

      {/* SMS Spam Detector widget */}
      <SmsSpamDetector />

    </div>
  );
}