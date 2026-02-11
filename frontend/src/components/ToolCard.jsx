import { useNavigate } from "react-router-dom"

export default function ToolCard({ icon, title, description, link }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(link)}
      className="cursor-pointer bg-card border border-white/10 p-6 rounded-xl
                 hover:border-accent transition"
    >
      <div className="text-accent mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm">{description}</p>
    </div>
  )
}
