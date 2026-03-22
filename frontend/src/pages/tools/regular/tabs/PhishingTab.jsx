import { Mail } from "lucide-react";
import EmailSpamWidget from "../EmailSpamWidget";

export default function PhishingTab() {
  return (
    <div className="space-y-6">

      {/* Section header */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
        >
          <Mail size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold theme-text">Phishing Email Detector</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Paste a suspicious email below to check if it's a phishing attempt.
          </p>
        </div>
      </div>

      {/* Awareness info before the detector */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "var(--bg-input)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        <h3 className="text-sm font-semibold theme-text">What is Phishing?</h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Phishing is when scammers send fake emails pretending to be your bank,
          a delivery company, or a popular website like Google or Amazon. Their
          goal is to trick you into clicking a link and entering your password,
          credit card details, or personal information on a fake website they control.
        </p>

        {/* Warning signs */}
        <div
          className="rounded-xl p-4 mt-2"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.18)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "#f87171", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}
          >
            ⚠ COMMON WARNING SIGNS
          </p>
          <ul className="space-y-1.5">
            {[
              "Email says your account is suspended or you must act urgently",
              "Link in the email looks slightly wrong (e.g. paypa1.com instead of paypal.com)",
              "Asks you to confirm your password, card number, or OTP",
              "Sender's email address looks odd or doesn't match the company name",
              "Too-good-to-be-true offers like prizes, refunds, or free gifts",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }}>›</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Email Spam Detector widget */}
      <EmailSpamWidget />

    </div>
  );
}