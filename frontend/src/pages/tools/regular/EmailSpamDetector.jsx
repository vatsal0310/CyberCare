import ToolLayout from "../../../layouts/ToolLayout";
import EmailSpamWidget from "./EmailSpamWidget";
import {
  Mail, AlertTriangle, Link2, CreditCard,
  UserX, Gift, Eye, Info, Trash2, ShieldCheck
} from "lucide-react";

const SPAM_SIGNALS = [
  { icon: Link2,         label: "Suspicious links or attachments",         color: "#f87171" },
  { icon: CreditCard,    label: "Urgent requests for passwords or payment", color: "#fb923c" },
  { icon: UserX,         label: "Unknown or disguised senders",             color: "#facc15" },
  { icon: Gift,          label: "Offers that seem too good to be true",     color: "#a78bfa" },
  { icon: AlertTriangle, label: "Threatening or fear-inducing language",    color: "#f472b6" },
  { icon: Eye,           label: "Asks you to click a link to 'verify'",    color: "#38bdf8" },
];

export default function EmailSpamDetection() {
  return (
    <ToolLayout>
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <span className="cyber-tag mb-3 inline-block">EMAIL SPAM DETECTOR</span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 theme-heading">
            Is This Email Spam?
          </h1>
          <p className="text-sm theme-muted">
            Paste any suspicious email and our ML model will detect phishing and spam instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left — spam widget (3/5) */}
          <div className="lg:col-span-3">
            <EmailSpamWidget />
          </div>

          {/* Right — education sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-5">

            {/* What is spam */}
            <div
              className="rounded-2xl p-6 theme-card"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}
                >
                  <Info size={14} />
                </div>
                <span className="text-sm font-semibold theme-text">What is a Spam Email?</span>
              </div>
              <p className="text-xs leading-relaxed mb-4 theme-muted">
                Spam emails are unwanted messages sent in bulk, designed to trick you into clicking dangerous links, giving away personal details, or sending money to scammers.
              </p>
              <div
                className="rounded-xl p-3"
                style={{ background: "var(--bg-card-faint)", border: "1px solid var(--border-row)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 size={12} style={{ color: "#60a5fa" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--accent-blue)", opacity: 0.6, letterSpacing: "0.1em" }}>
                    GOOD TO KNOW
                  </span>
                </div>
                <p className="text-xs theme-muted">
                  Over 45% of all emails sent worldwide are spam. Your email provider filters most, but some still get through.
                </p>
              </div>
            </div>

            {/* Red flag signals */}
            <div
              className="rounded-2xl p-6 theme-card"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
                >
                  <AlertTriangle size={14} />
                </div>
                <span className="text-sm font-semibold theme-text">Red Flag Signals</span>
              </div>
              <div className="space-y-2.5">
                {SPAM_SIGNALS.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 py-2.5 px-3 rounded-xl transition-all duration-200"
                    style={{ background: "var(--bg-card-faint)", border: "1px solid var(--border-row)" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-row)"}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}15`, color }}
                    >
                      <Icon size={12} />
                    </div>
                    <span className="text-xs leading-relaxed theme-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay safe tip */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--footer-card-bg)", border: "1px solid var(--footer-card-border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} style={{ color: "#4ade80" }} />
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  STAY SAFE
                </span>
              </div>
              <p className="text-xs leading-relaxed theme-muted">
                When in doubt, go directly to the company's official website by typing the address yourself — never click links in emails asking for passwords, account details, or payments.
              </p>
            </div>

          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
