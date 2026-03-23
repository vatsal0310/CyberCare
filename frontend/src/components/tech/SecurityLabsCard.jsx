import { useState } from "react";
import { FlaskConical, Database, Lock, ArrowRight } from "lucide-react";

const ACCENT = "#a78bfa";

const labs = [
  {
    id: "sqli",
    icon: Database,
    label: "SQLi Lab",
    desc: "6 progressive SQL injection challenges with live query visualisation.",
    accent: "#fb923c",
    tags: ["Auth Bypass", "UNION", "Blind"],
    detail: [{ k: "Challenges", v: "6" }, { k: "DB", v: "Postgres" }],
  },
  {
    id: "pwdcrack",
    icon: Lock,
    label: "Password Cracking Lab",
    desc: "Crack MD5, SHA-256 & bcrypt hashes. Isolated Docker container per user.",
    accent: "#34d399",
    tags: ["John", "Hashcat", "MD5/SHA256"],
    detail: [{ k: "Levels", v: "3" }, { k: "Container", v: "Isolated" }],
  },
];

function LabOption({ id, icon: Icon, label, desc, accent, tags, detail, onLaunch }) {
  const [hovered, setHovered] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = (e) => {
    e.stopPropagation();
    setLaunching(true);
    setTimeout(() => { setLaunching(false); onLaunch(id); }, 900);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 overflow-hidden"
      style={{
        background: hovered ? `linear-gradient(135deg, ${accent}12, var(--bg-card))` : "var(--bg-card-faint)",
        border: hovered ? `1px solid ${accent}40` : "1px solid var(--border-row)",
      }}
    >
      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: hovered ? 0.7 : 0 }}
      />

      {/* Icon + tags */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{ background: hovered ? `${accent}22` : `${accent}14`, color: accent, boxShadow: hovered ? `0 0 16px ${accent}25` : "none" }}
        >
          <Icon size={17} />
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {tags.map((t) => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", padding: "1px 6px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", background: `${accent}14`, color: accent, border: `1px solid ${accent}30` }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Text */}
      <div>
        <div className="font-bold text-sm mb-1 theme-text">{label}</div>
        <p className="text-xs leading-relaxed theme-muted">{desc}</p>
      </div>

      {/* Detail + button row */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex gap-3">
          {detail.map(({ k, v }) => (
            <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "var(--text-faint)", letterSpacing: "0.04em" }}>
              {k}: <span style={{ color: "var(--text-muted)" }}>{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleLaunch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}25, ${accent}10)`, border: `1px solid ${accent}40`, color: accent, cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}35`; e.currentTarget.style.boxShadow = `0 0 12px ${accent}25`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}25, ${accent}10)`; e.currentTarget.style.boxShadow = "none"; }}
        >
          {launching ? (
            <div className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}40`, borderTopColor: accent }} />
          ) : (
            <> Launch <ArrowRight size={11} /> </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SecurityLabsCard({ onLaunch }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 overflow-hidden theme-card"
      style={{
        background: hovered ? `linear-gradient(135deg, ${ACCENT}08, var(--bg-card))` : "var(--bg-card)",
        border: hovered ? `1px solid ${ACCENT}35` : "1px solid var(--border)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${ACCENT}10` : "none",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, opacity: hovered ? 0.5 : 0 }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ background: hovered ? `${ACCENT}22` : `${ACCENT}14`, color: ACCENT, boxShadow: hovered ? `0 0 20px ${ACCENT}30` : "none" }}
          >
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="font-bold leading-snug theme-text">Security Labs</h3>
            <p className="text-xs mt-0.5 theme-muted">
              Hands-on exploit & defence exercises
            </p>
          </div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", background: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}30`, flexShrink: 0 }}>
          2 LABS
        </span>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "var(--border-svg)" }} />

      {/* Lab options */}
      <div className="flex flex-col gap-3">
        {labs.map((lab) => (
          <LabOption key={lab.id} {...lab} onLaunch={onLaunch} />
        ))}
      </div>
    </div>
  );
}