import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ToolLayout from "../../../layouts/ToolLayout"
import PhishingTab from "./tabs/PhishingTab"
import SmishingTab from "./tabs/SmishingTab"
import VishingTab from "./tabs/VishingTab"
import { Mail, MessageSquare, Phone } from "lucide-react"

const tabs = [
  {
    id: "phishing",
    label: "Phishing",
    icon: Mail,
    tag: "EMAIL ATTACKS",
    description: "Fake emails that steal your credentials",
    color: "#3b82f6",
  },
  {
    id: "smishing",
    label: "Smishing",
    icon: MessageSquare,
    tag: "SMS ATTACKS",
    description: "Fraudulent text messages with malicious links",
    color: "#818cf8",
  },
  {
    id: "vishing",
    label: "Vishing",
    icon: Phone,
    tag: "VOICE ATTACKS",
    description: "Phone call scams impersonating trusted entities",
    color: "#06b6d4",
  },
]

export default function PhishingAwareness() {
  const [active, setActive] = useState("phishing")
  const activeTab = tabs.find((t) => t.id === active)

  return (
    <ToolLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="cyber-tag mb-3 inline-block">PHISHING AWARENESS</span>
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Scam & Phishing Awareness
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            Learn how attackers try to deceive you — and how to stay one step ahead.
          </p>
        </div>

        {/* Tab selector cards — 3 cols */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {tabs.map(({ id, label, icon: Icon, tag, description, color }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="text-left rounded-2xl p-5 transition-all duration-200"
              style={{
                background: active === id
                  ? `linear-gradient(135deg, ${color}18, ${color}08)`
                  : "rgba(7,14,34,0.7)",
                border: active === id
                  ? `1px solid ${color}55`
                  : "1px solid rgba(59,130,246,0.12)",
                boxShadow: active === id ? `0 8px 24px ${color}15` : "none",
                transform: active === id ? "translateY(-2px)" : "none",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: `${color}20`,
                  color: active === id ? color : "rgba(148,163,184,0.4)",
                }}
              >
                <Icon size={17} />
              </div>

              <div
                className="font-bold text-sm mb-1"
                style={{ color: active === id ? "#fff" : "rgba(148,163,184,0.6)" }}
              >
                {label}
              </div>

              <div
                className="text-xs leading-relaxed"
                style={{ color: "rgba(148,163,184,0.4)" }}
              >
                {description}
              </div>

              {active === id && (
                <div className="mt-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: `${color}20`,
                      color,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                    }}
                  >
                    {tag}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-7"
            style={{
              background: "rgba(7,14,34,0.85)",
              border: `1px solid ${activeTab.color}25`,
            }}
          >
            {active === "phishing" && <PhishingTab />}
            {active === "smishing" && <SmishingTab />}
            {active === "vishing" && <VishingTab />}
          </motion.div>
        </AnimatePresence>

      </div>
    </ToolLayout>
  )
}
