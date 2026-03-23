const items = [
  { accent: "#34d399", title: "Vulnerability Scan Completed",  sub: "scanme.nmap.org — 31 findings, 4 critical",        time: "2m ago"    },
  { accent: "#818cf8", title: "Attack Graph Created",          sub: "University Network — 10 attack paths mapped",      time: "18m ago"   },
  { accent: "#fb923c", title: "SQLi Challenge Completed",      sub: "Break the Login (Auth Bypass) — Score: 100%",      time: "1h ago"    },
  { accent: "#f472b6", title: "SOC Shift Ended",               sub: "28 threats detected, 13 missed — Grade: F",        time: "3h ago"    },
  { accent: "#34d399", title: "Password Lab Completed",        sub: "Beginner Mode cracked in 1m 33s — 50 pts",         time: "Yesterday" },
];

function Item({ accent, title, sub, time }) {
  return (
    <div
      className="flex items-center gap-4 py-3.5 px-5 transition-all duration-200"
      style={{ borderBottom: "1px solid var(--border-row)" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover-bg)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div className="relative flex-shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: accent, opacity: 0.3, animationDuration: "3s" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-none mb-0.5 theme-text">{title}</div>
        <div className="text-xs truncate theme-muted">{sub}</div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>
        {time}
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl overflow-hidden theme-card" style={{ border: "1px solid var(--border)" }}>
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-deep)" }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--accent-blue)", opacity: 0.5, letterSpacing: "0.1em" }}>SESSION LOG</span>
        <span
          className="text-xs cursor-pointer theme-muted"
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          View All →
        </span>
      </div>
      {items.map((item) => <Item key={item.title} {...item} />)}
    </div>
  );
}