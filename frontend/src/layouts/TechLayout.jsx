import { useNavigate } from "react-router-dom";
import TechSidebar from "../components/tech/TechSidebar";

const FONT = "'JetBrains Mono', monospace";

export default function TechLayout({ children, onLogout, breadcrumb }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen theme-main-area"
      style={{ color: "var(--text)" }}
    >
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none theme-grid-bg" style={{ zIndex: 0 }} />

      {/* Sidebar — self-routing via useLocation, no props needed */}
      <TechSidebar onLogout={onLogout} />

      {/* Main content area */}
      <main
        className="relative flex-1 p-10 overflow-y-auto theme-main-area"
        style={{ zIndex: 1, color: "var(--text)" }}
      >
        {/* Breadcrumb — shown only when the `breadcrumb` prop is passed */}
        {breadcrumb && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
              fontFamily: FONT,
              fontSize: 13,
            }}
          >
            <span
              onClick={() => navigate("/technical-user")}
              style={{
                color: "#4b5563",
                cursor: "pointer",
                transition: "color 0.15s",
                fontWeight: 500,
              }}
              onMouseEnter={e => (e.target.style.color = "var(--accent)")}
              onMouseLeave={e => (e.target.style.color = "#4b5563")}
            >
              Dashboard
            </span>
            <span style={{ color: "#9ca3af" }}>›</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{breadcrumb}</span>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}