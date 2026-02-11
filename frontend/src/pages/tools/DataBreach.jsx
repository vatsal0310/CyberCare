export default function DataBreach() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Data Breach Checker</h1>
      <p className="text-muted mb-6">
        Check whether your email has appeared in known data breaches.
      </p>

      <input
        type="email"
        placeholder="you@example.com"
        className="w-full p-3 rounded bg-card border border-white/10"
      />
    </div>
  )
}
