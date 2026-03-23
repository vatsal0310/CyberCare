import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ToolSidebar from "../components/ToolSidebar";

// Maps every /tools/* route to its readable page title
const ROUTE_LABELS = {
  "/tools/password-analyzer":     "Password Analyzer",
  "/tools/fake-website-detector": "Fake Website Detector",
  "/tools/data-breach":           "Data Breach Checker",
  "/tools/phishing-awareness":    "Phishing Awareness",
  "/tools/spam-detection":        "Email Spam Detector",
  "/tools/quiz":                  "Cyber Safety Quiz",
};

// Clickable crumb
function Crumb({ label, onClick }) {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer transition-colors duration-150"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "var(--text-muted)",
        fontSize: "0.75rem",
      }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
      onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
    >
      {label}
    </span>
  );
}

// Active (last) crumb — accent color, not clickable
function ActiveCrumb({ label }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "var(--accent)",
        fontSize: "0.75rem",
      }}
    >
      {label}
    </span>
  );
}

function Separator() {
  return (
    <ChevronRight size={12} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
  );
}

export default function ToolLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLabel  = ROUTE_LABELS[location.pathname];
  const isOnDashboard = location.pathname === "/regular-user";
  const isOnToolPage  = Boolean(currentLabel);

  return (
    <div className="flex min-h-screen theme-main-area" style={{ color: "var(--text)" }}>
      <ToolSidebar />
      <main className="flex-1 p-10 overflow-y-auto theme-main-area">

        {/*
          Breadcrumb logic:
          /regular-user   →  Home  >  Dashboard          (Dashboard is active)
          /tools/*        →  Home  >  Dashboard  >  Tool  (Tool is active)
        */}
        {(isOnDashboard || isOnToolPage) && (
          <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">

            {/* Home — always clickable */}
            <Crumb label="Home" onClick={() => navigate("/")} />

            <Separator />

            {isOnDashboard ? (
              /* On the dashboard itself — Dashboard is the active end crumb */
              <ActiveCrumb label="Dashboard" />
            ) : (
              <>
                {/* Dashboard — clickable when inside a tool */}
                <Crumb label="Dashboard" onClick={() => navigate("/regular-user")} />

                <Separator />

                {/* Current tool — active end crumb */}
                <ActiveCrumb label={currentLabel} />
              </>
            )}

          </nav>
        )}

        {children}
      </main>
    </div>
  );
}
