import { useState } from "react";

export default function DataBreach() {
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://127.0.0.1:8000";

  // ================= EMAIL CHECK =================
  const checkEmail = async () => {
    if (!email) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/breach/check-email`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "error", message: "Cannot connect to server" });
    }

    setLoading(false);
  };

  // ================= PASSWORD CHECK =================
  const checkPassword = async () => {
    if (!password) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/breach/check-password`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: "error", message: "Cannot connect to server" });
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen text-white flex flex-col items-center w-full max-w-6xl mx-auto py-16 px-4">

      {/* Title */}
      <h1 className="text-5xl font-bold mb-3 text-center">Data Breach Checker</h1>
      <p className="text-gray-400 mb-10 text-center max-w-2xl">
        Check whether your email address or password has appeared in known data breaches.
      </p>

      {/* EDUCATIONAL NOTICE */}
      <div className="max-w-3xl w-full mb-12 bg-[#0f1a35]/60 border border-[#1f2a4d] rounded-xl p-5">
        <p className="text-teal-300 font-semibold mb-2">Educational Tool</p>
        <p className="text-gray-300 text-sm">
          This tool checks whether your credentials may have been exposed online.
          If compromised, attackers may attempt phishing, account takeover, or identity theft.
          You should immediately change passwords found in breaches.
        </p>
      </div>

      {/* SWITCH TABS */}
      <div className="flex bg-[#0f1a35] rounded-xl p-1 mb-10 border border-[#1f2a4d]">
        <button
          className={`px-8 py-2 rounded-lg transition ${
            mode === "email"
              ? "bg-teal-500 text-black"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => {
            setMode("email");
            setResult(null);
          }}
        >
          Email Check
        </button>

        <button
          className={`px-8 py-2 rounded-lg transition ${
            mode === "password"
              ? "bg-teal-500 text-black"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => {
            setMode("password");
            setResult(null);
          }}
        >
          Password Check
        </button>
      </div>

      {/* INPUT CARD */}
      <div className="bg-[#0f1a35] border border-[#1f2a4d] rounded-2xl p-8 w-full max-w-lg shadow-lg">

        {mode === "email" && (
          <>
            <label className="text-gray-300 mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-[#071028] border border-[#2a3a66] focus:outline-none focus:border-teal-400 mb-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={checkEmail}
              className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 rounded-lg transition"
            >
              Check Email
            </button>
          </>
        )}

        {mode === "password" && (
          <>
            <label className="text-gray-300 mb-2 block">Password</label>
            <input
              type="password"
              placeholder="Enter password securely"
              className="w-full p-3 rounded-lg bg-[#071028] border border-[#2a3a66] focus:outline-none focus:border-teal-400 mb-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={checkPassword}
              className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 rounded-lg transition"
            >
              Check Password
            </button>
          </>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-8 text-teal-400 font-semibold animate-pulse">
          Scanning breach databases...
        </div>
      )}

      {/* RESULTS */}
      {result && result.status === "safe" && (
        <div className="mt-10 bg-green-900/40 border border-green-500 p-6 rounded-2xl max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-2">No Breach Found</h2>
          <p className="text-gray-300">{result.message}</p>
        </div>
      )}

      {result && result.status === "breached" && (
        <div className="mt-10 bg-red-900/40 border border-red-500 p-6 rounded-2xl max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Breach Detected</h2>

          <p className="mb-4 text-gray-300">
            Found in {result.breaches_found} breach database(s)
          </p>

          <div className="space-y-3">
            {result.breaches?.map((b, i) => (
              <div key={i} className="bg-[#071028] p-4 rounded-lg border border-red-800">
                <h3 className="font-semibold text-white">{b.name}</h3>
                <p className="text-gray-400 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && result.status === "exposed" && (
        <div className="mt-10 bg-red-900/40 border border-red-500 p-6 rounded-2xl max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Password Compromised</h2>
          <p className="text-gray-300">{result.message}</p>
        </div>
      )}

      {result && result.status === "error" && (
        <div className="mt-10 bg-yellow-900/40 border border-yellow-500 p-6 rounded-2xl max-w-lg w-full text-center">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Error</h2>
          <p className="text-gray-300">{result.message}</p>
        </div>
      )}

      {/* INFO SECTION */}
      <div className="max-w-3xl w-full mt-16 bg-[#0f1a35]/60 border border-[#1f2a4d] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">What Are Data Breaches?</h2>

        <p className="text-gray-300 mb-4">
          A data breach occurs when attackers gain unauthorized access to a company's
          database and steal user information such as emails and passwords.
        </p>

        <p className="text-gray-300 mb-4">
          Stolen credentials are often sold on the dark web and later used for phishing,
          identity theft, and account takeovers.
        </p>

        <div className="bg-teal-900/20 border border-teal-500 rounded-lg p-4 mt-6">
          <h3 className="text-teal-300 font-semibold mb-2">
            Why Unique Passwords Matter
          </h3>
          <p className="text-gray-300 text-sm">
            If you reuse the same password across multiple sites, attackers can access all
            your accounts after a single breach. Always use strong and unique passwords.
          </p>
        </div>
      </div>
    </div>
  );
}
