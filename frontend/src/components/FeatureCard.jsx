export default function FeatureCard({ icon, title }) {
  return (
    <div className="bg-card border border-white/10 p-6 rounded-xl">
      <div className="text-accent mb-4">{icon}</div>
      <h4 className="font-semibold">{title}</h4>
    </div>
  )
}
