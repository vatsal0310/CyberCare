const SEV_STYLES = {
  HIGH: { bg: "rgba(255,56,96,0.12)",  color: "#ff6480",  border: "rgba(255,56,96,0.3)"  },
  MED:  { bg: "rgba(255,145,0,0.12)",  color: "#fb923c",  border: "rgba(255,145,0,0.3)"  },
  LOW:  { bg: "rgba(56,189,248,0.1)",  color: "#38bdf8",  border: "rgba(56,189,248,0.2)" },
};

const alerts = [
  { sev: "HIGH", title: "Missing Content-Security-Policy", sub: "scanme.nmap.org — XSS attack surface exposed"     },
  { sev: "HIGH", title: "Port 80 — HTTP Open",             sub: "Unencrypted traffic on production target"         },
  { sev: "MED",  title: "Outdated Software Detected",      sub: "Nikto install out of date on Kali container"      },
  { sev: "MED",  title: "Missing X-Frame-Options",         sub: "Clickjacking vulnerability on scanned target"     },
  { sev: "LOW",  title: "Web Server Version Exposed",      sub: "Apache version visible in response headers"       },
];

function Item({ sev, title, sub }) {
  const s = SEV_STYLES[sev];
  return (
    <div
      className="flex items-start gap-3 py-3.5 px-5 transition-all duration-200"
      style={{ borderBottom: "1px solid var(--border-row)" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover-bg)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.08em", background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0, marginTop: 2 }}>
        {sev}
      </span>
      <div>
        <div className="text-sm font-semibold leading-none mb-0.5 theme-text">{title}</div>
        <div className="text-xs theme-muted">{sub}</div>
      </div>
    </div>
  );
}

export default function AlertsPanel() {
  return (
    <div className="rounded-2xl overflow-hidden theme-card" style={{ border: "1px solid var(--border)" }}>
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-deep)" }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--accent-blue)", opacity: 0.5, letterSpacing: "0.1em" }}>PRIORITY QUEUE</span>
        <span
          className="text-xs cursor-pointer theme-muted"
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          Dismiss All
        </span>
      </div>
      {alerts.map((a) => <Item key={a.title} {...a} />)}
    </div>
  );
}
