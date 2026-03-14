import ToolCard from "../components/ToolCard";
import { Lock, ShieldAlert, Database, AlertTriangle, Brain, Shield, Activity, Users, Zap } from "lucide-react";
import ToolLayout from "../layouts/ToolLayout";

const stats = [
  { label: "Threats Detected", value: "2.4M+", icon: Shield, color: "#3b82f6" },
  { label: "Users Protected", value: "180K+", icon: Users, color: "#06b6d4" },
  { label: "Breach Checks", value: "940K+", icon: Activity, color: "#818cf8" },
  { label: "Avg Response", value: "< 1s", icon: Zap, color: "#f59e0b" },
];

const tools = [
  {
    icon: <Lock size={20} />,
    title: "Password Analyzer",
    description: "Measure entropy and strength of your password in real time. Get AI-powered tips to make it unbreakable.",
    link: "/tools/password-analyzer",
    tag: "STRENGTH CHECK",
  },
  {
    icon: <ShieldAlert size={20} />,
    title: "Fake Website Detector",
    description: "Instantly verify any URL — detect phishing traps, spoofed domains, and unsafe redirects.",
    link: "/tools/fake-website-detector",
    tag: "URL SCAN",
  },
  {
    icon: <Database size={20} />,
    title: "Data Breach Checker",
    description: "Search billions of leaked records to see if your email or password has been exposed in a breach.",
    link: "/tools/data-breach",
    tag: "BREACH DB",
  },
  {
    icon: <AlertTriangle size={20} />,
    title: "Phishing Awareness",
    description: "Learn how phishing, smishing, and vishing attacks work — and how to spot them before it's too late.",
    link: "/tools/phishing-awareness",
    tag: "LEARN",
  },
  {
    icon: <Brain size={20} />,
    title: "Cyber Safety Quiz",
    description: "Test your cybersecurity knowledge with AI-generated questions. Track your score and beat your best.",
    link: "/tools/quiz",
    tag: "QUIZ",
  },
];

export default function RegularUser() {
  return (
    <ToolLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px flex-1 max-w-16"
              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.5), transparent)" }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(59,130,246,0.7)",
              }}
            >
              CYBERCARE // USER DASHBOARD
            </span>
          </div>

          <h1
            className="text-5xl font-extrabold mb-4 leading-tight tracking-tight"
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #93c5fd 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Stay Safe Online.
            <br />
            No Tech Skills Needed.
          </h1>
          <p
            className="text-lg max-w-xl leading-relaxed"
            style={{ color: "rgba(148,163,184,0.7)" }}
          >
            Five powerful tools that protect your digital life — from passwords to
            phishing — all in one place.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: "rgba(7,14,34,0.7)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, color }}
              >
                <Icon size={16} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white leading-none">{value}</div>
                <div
                  className="text-xs mt-0.5"
                  style={{
                    color: "rgba(148,163,184,0.5)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(148,163,184,0.4)",
            }}
          >
            // SELECT A TOOL
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(59,130,246,0.1)" }}
          />
          <span
            className="cyber-tag"
            style={{ fontSize: "0.6rem" }}
          >
            {tools.length} TOOLS
          </span>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
          {tools.map((tool) => (
            <ToolCard key={tool.link} {...tool} />
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-12 rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(14,116,144,0.06))",
            border: "1px solid rgba(59,130,246,0.12)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
          >
            <Shield size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-0.5">Your privacy is guaranteed</div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
              We never store your passwords or emails. All checks happen securely without saving your data.
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
