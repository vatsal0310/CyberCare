import { useNavigate } from "react-router-dom"

export default function UserCard({ title, description, link, highlight }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(link)}
      className={`cursor-pointer p-8 rounded-xl border transition
        ${highlight
          ? "border-accent bg-accent/5"
          : "border-white/10 bg-card"}
        hover:border-accent`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  )
}
