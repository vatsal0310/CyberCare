// src/pages/tools/UrlChecker.jsx
export default function UrlChecker() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">URL Safety Checker</h1>
      <p className="text-muted mb-6">
        Enter a website URL to check if it is safe or potentially malicious.
      </p>

      <input
        type="text"
        placeholder="https://example.com"
        className="w-full p-3 rounded bg-card border border-white/10"
      />
    </div>
  )
}
