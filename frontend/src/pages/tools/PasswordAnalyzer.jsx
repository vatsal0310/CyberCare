import { useState } from "react";
import { analyzePassword as analyzePasswordAPI } from "../../services/api";

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strengthColor = {
    "Very Strong": "text-green-500 font-bold",
    "Strong": "text-green-500 font-bold",
    "Medium": "text-yellow-400 font-semibold",
    "Weak": "text-red-500 font-semibold",
    "Very Weak": "text-red-600 font-semibold",
  };

  const handleAnalyzePassword = async () => {
    if (!password) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await analyzePasswordAPI(password);
      setResult(response.data);
    } catch (err) {
      setError("Unable to analyze password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-cyan-400">
            Password Strength Checker
          </h1>
          <p className="text-slate-400 mt-2">
            Test your password strength and get personalized improvement suggestions.
          </p>
        </div>

        {/* Analyzer Card */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
          <input
            type="password"
            placeholder="Enter a password to test..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            onClick={handleAnalyzePassword}
            className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 py-3 rounded font-semibold transition"
          >
            {loading ? "Analyzing..." : "Analyze Password"}
          </button>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          {result && (
            <div className="mt-6 bg-slate-800 p-4 rounded-lg">
              <p className="text-lg">
                <strong>Strength:</strong>{" "}
                <span className={strengthColor[result.strength] || "text-red-500"}>
                  {result.strength}
                </span>
              </p>

              <p className="mt-2 text-slate-300">
                <strong>Score:</strong> {result.score} / 100
              </p>
            </div>
          )}
        </div>

        {/* Best Practices Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-cyan-400 mb-6">
            Password Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Use 12+ characters",
                desc: "Longer passwords are exponentially harder to crack.",
              },
              {
                title: "Mix character types",
                desc: "Combine uppercase, lowercase, numbers, and symbols.",
              },
              {
                title: "Avoid personal info",
                desc: "Don’t use names, birthdays, or common words.",
              },
              {
                title: "Use unique passwords",
                desc: "Never reuse passwords across different accounts.",
              },
              {
                title: "Consider a passphrase",
                desc: "A sentence can be both memorable and secure.",
              },
              {
                title: "Use a password manager",
                desc: "Generate and store strong passwords securely.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-cyan-600 transition"
              >
                <h3 className="font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-12 bg-slate-900 border border-cyan-700 p-5 rounded-xl">
          <h3 className="text-cyan-400 font-semibold mb-2">
            Your Privacy is Protected
          </h3>
          <p className="text-slate-400 text-sm">
            Password analysis is processed securely through our backend API.
            We do not store or log your passwords.
          </p>
        </div>

      </div>
    </div>
  );
}
