export const ASSET_TYPES = [
  { type: "internet",          label: "Internet",          icon: "🌐" },
  { type: "firewall",          label: "Firewall",          icon: "🛡️" },
  { type: "load_balancer",     label: "Load Balancer",     icon: "⚖️" },
  { type: "web_server",        label: "Web Server",        icon: "🖥️" },
  { type: "api_server",        label: "API Server",        icon: "⚡" },
  { type: "database",          label: "Database",          icon: "🗄️" },
  { type: "internal_network",  label: "Internal Network",  icon: "🔗" },
  { type: "admin_workstation", label: "Admin Workstation", icon: "💻" },
  { type: "dns_server",        label: "DNS Server",        icon: "📡" },
  { type: "mail_server",       label: "Mail Server",       icon: "📧" },
  { type: "vpn",               label: "VPN",               icon: "🔒" },
  { type: "cdn",               label: "CDN",               icon: "☁️" },
];

export const PROTOCOLS = ["HTTP", "HTTPS", "SSH", "SQL", "FTP", "SMTP", "DNS", "RDP"];

export const SEVERITY_COLORS = {
  critical: "#ff6480", high: "#fb923c", medium: "#fbbf24", low: "#34d399",
};