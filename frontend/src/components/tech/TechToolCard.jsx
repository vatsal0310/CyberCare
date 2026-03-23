import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function TechToolCard({ id, icon: Icon, label, desc, accent, tags, detail, onLaunch }) {
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
      className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 overflow-hidden theme-card"
      style={{
        background: hovered ? `linear-gradient(135deg, ${accent}10, var(--bg-card))` : "var(--bg-card)",
        border: hovered ? `1px solid ${accent}40` : "1px solid var(--border)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${accent}12` : "none",
      }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: hovered ? 0.6 : 0 }}
      />

      {/* Icon + tags */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{ background: hovered ? `${accent}22` : `${accent}14`, color: accent, boxShadow: hovered ? `0 0 20px ${accent}30` : "none" }}
        >
          <Icon size={20} />
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {tags.map((t) => (
            <span
              key={t}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", background: `${accent}14`, color: accent, border: `1px solid ${accent}30` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="font-bold mb-1.5 leading-snug theme-text">{label}</h3>
        <p className="text-sm leading-relaxed theme-muted">{desc}</p>
      </div>

      {/* Detail chips */}
      <div className="flex flex-wrap gap-3">
        {detail.map(({ k, v }) => (
          <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            {k}: <span style={{ color: "var(--text-sub)" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Launch button */}
      <button
        onClick={handleLaunch}
        className="mt-auto self-end flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
        style={{ background: `linear-gradient(135deg, ${accent}25, ${accent}10)`, border: `1px solid ${accent}40`, color: accent, cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.background = `${accent}35`; e.currentTarget.style.boxShadow = `0 0 16px ${accent}30`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${accent}25, ${accent}10)`; e.currentTarget.style.boxShadow = "none"; }}
      >
        {launching ? (
          <>
            <div className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}40`, borderTopColor: accent }} />
            Launching...
          </>
        ) : (
          <> Launch <ArrowRight size={13} /> </>
        )}
      </button>
    </div>
  );
}