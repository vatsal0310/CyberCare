import React, { useState } from "react";
import {
  portScan,
  sslScan,
  headerScan,
  vulnScan,
} from "../../../api/pentestapi";

const PenetrationTesting = () => {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleScan = async (scanType) => {
    if (!target.trim()) {
      setError("Please enter a target");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    setResult("");

    try {
      let response;

      switch (scanType) {
        case "port":
          response = await portScan(target);
          break;
        case "ssl":
          response = await sslScan(target);
          break;
        case "header":
          response = await headerScan(target);
          break;
        case "vuln":
          response = await vulnScan(target);
          break;
        default:
          return;
      }

      setResult(response.data.output);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError("❌ Network Error or Backend Not Running");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white px-4">
      <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-2xl w-full max-w-2xl shadow-[0_0_60px_rgba(0,255,255,0.15)] border border-cyan-500/20">

        <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
          🔐 Penetration Testing
        </h2>

        <input
          type="text"
          placeholder="Enter domain or IP (e.g. scanme.nmap.org)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6"
        />

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleScan("port")}
            className="flex-1 min-w-[140px] py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400 text-black font-semibold hover:scale-105 transition"
          >
            Port Scan
          </button>

          <button
            onClick={() => handleScan("ssl")}
            className="flex-1 min-w-[140px] py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400 text-black font-semibold hover:scale-105 transition"
          >
            SSL/TLS Scan
          </button>

          <button
            onClick={() => handleScan("header")}
            className="flex-1 min-w-[140px] py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400 text-black font-semibold hover:scale-105 transition"
          >
            HTTP Header Scan
          </button>

          <button
            onClick={() => handleScan("vuln")}
            className="flex-1 min-w-[140px] py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400 text-black font-semibold hover:scale-105 transition"
          >
            Vulnerability Scan
          </button>
        </div>

        {/* Status Messages */}
        <div className="mt-6">
          {status === "loading" && (
            <p className="text-yellow-400 animate-pulse">
              ⏳ Running scan...
            </p>
          )}

          {status === "success" && (
            <p className="text-green-400">
              ✅ Scan completed successfully
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* Output */}
        {result && (
          <pre className="mt-6 bg-black p-4 rounded-lg max-h-72 overflow-y-auto text-sm border border-cyan-500/30 whitespace-pre-wrap">
            {typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PenetrationTesting;
