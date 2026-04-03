import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Play, Database, KeyRound } from "lucide-react";
import TechLayout from "../../../../layouts/TechLayout";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";
const SANS = "'Inter', system-ui, sans-serif";

const labs = [
  {
    id: "sqli",
    title: "SQL Injection Lab",
    category: "Web",
    description:
      "Exploit a vulnerable login form using SQL injection to bypass authentication and extract hidden data from the database.",
    difficulty: "Beginner",
    difficultyColor: "#34d399",
    accent: "#fb923c",
    icon: Database,
    tags: ["Auth Bypass", "UNION", "Blind"],
    detail: [
      { k: "Challenges", v: "6" },
      { k: "DB", v: "Postgres" },
    ],
    route: "/technical-user/sqli-lab",
  },
  {
    id: "pcl",
    title: "Password Cracking Lab",
    category: "Cryptography",
    description:
      "Learn to crack MD5, SHA-256 and bcrypt password hashes using John the Ripper and Hashcat inside an isolated Kali Linux container.",
    difficulty: "Beginner → Advanced",
    difficultyColor: "#00bfff",
    accent: "#00bfff",
    icon: KeyRound,
    tags: ["John", "Hashcat", "MD5", "SHA-256"],
    detail: [
      { k: "Timer", v: "10 min" },
      { k: "Container", v: "Kali" },
    ],
    route: "/technical-user/password-lab",
  },
];

const tabs = ["All", "Web", "Cryptography"];

function LabCard({ lab, onStart }) {
  const [hovered, setHovered] = useState(false);
  const Icon = lab.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${lab.accent}10, var(--bg-card))`
          : "var(--bg-card)",
        border: hovered
          ? `1px solid ${lab.accent}45`
          : "1px solid var(--border)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${lab.accent}12` : "none",
        padding: "24px 28px",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: hovered ? `${lab.accent}22` : `${lab.accent}14`,
              color: lab.accent,
            }}
          >
            <Icon size={18} />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontFamily: SANS }}>{lab.title}</h2>
            <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: lab.difficultyColor }}>
              {lab.difficulty}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {lab.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: MONO,
                fontSize: "0.5rem",
                padding: "2px 6px",
                background: `${lab.accent}14`,
                border: `1px solid ${lab.accent}30`,
                color: lab.accent,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="flex-1 mb-6" style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
        {lab.description}
      </p>

      <div className="flex items-center justify-between">
        <div style={{ display: "flex", gap: 12 }}>
          {lab.detail.map((d) => (
            <span key={d.k} style={{ fontFamily: MONO, fontSize: "0.6rem", color: "var(--text-muted)" }}>
              {d.k}: <span style={{ color: lab.accent }}>{d.v}</span>
            </span>
          ))}
        </div>

        <button
          onClick={() => onStart(lab)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold"
          style={{
            background: `linear-gradient(135deg, ${lab.accent}30, ${lab.accent}15)`,
            border: `1px solid ${lab.accent}45`,
            color: lab.accent,
          }}
        >
          <Play size={12} /> Start Lab
        </button>
      </div>
    </div>
  );
}

export default function SecurityLabsDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filteredLabs =
    activeTab === "All"
      ? labs
      : labs.filter((lab) => lab.category === activeTab);

  return (
    <TechLayout breadcrumb="Security Labs">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Security Labs</h1>

      <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
        Practice real-world attacks in safe, isolated environments.
      </p>

      <div className="mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border:
                activeTab === tab
                  ? "1px solid var(--border)"
                  : "1px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLabs.map((lab) => (
          <LabCard key={lab.id} lab={lab} onStart={(l) => navigate(l.route)} />
        ))}
      </div>
    </TechLayout>
  );
}
