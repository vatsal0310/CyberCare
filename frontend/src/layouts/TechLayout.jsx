import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ToolSidebar from "../components/tech/TechSidebar";

// Map each /tools/* path to a readable page name
const ROUTE_LABELS = {
  "/tools/password-analyzer":     "Password Analyzer",
  "/tools/fake-website-detector": "Fake Website Detector",
  "/tools/data-breach":           "Data Breach Checker",
  "/tools/phishing-awareness":    "Phishing Awareness",
  "/tools/spam-detection":        "Email Spam Detector",
  "/tools/quiz":                  "Cyber Safety Quiz",
};

export default function ToolLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Only show breadcrumb when we're inside a specific tool (not the dashboard)
  const currentLabel = ROUTE_LABELS[location.pathname];
  const showBreadcrumb = Boolean(currentLabel);

  return (
    <div className="flex min-h-screen theme-main-area" style={{ color: "var(--text)" }}>
      <ToolSidebar />
      <main className="flex-1 p-10 overflow-y-auto theme-main-area">

        {/* ── Breadcrumb ── only shown inside a tool page */}
        {showBreadcrumb && (
          <div
            className="flex items-center gap-2 mb-8 text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span
              className="cursor-pointer transition-colors duration-150"
              onClick={() => navigate("/regular-user")}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              Dashboard
            </span>
            <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
            <span style={{ color: "var(--accent)" }}>
              {currentLabel}
            </span>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
