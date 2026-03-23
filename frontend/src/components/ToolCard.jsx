import { useNavigate } from "react-router-dom"

export default function ToolCard({ icon, title, description, link }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer theme-card p-6 rounded-xl transition-all duration-200"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div className="mb-4" style={{ color: "var(--accent)" }}>{icon}</div>
      <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{description}</p>
    </div>
  )
}