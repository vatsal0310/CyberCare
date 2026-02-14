import { Link } from "react-router-dom";

export default function TechnicalUser() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-10 py-16">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-6">
          Technical User Dashboard
        </h1>

        <p className="text-slate-400 mb-12">
          Access penetration testing labs, vulnerability scanners, and advanced security tools.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Penetration Testing - Clickable */}
          <Link to="/tools/penetration-testing">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">
                Penetration Testing Labs
              </h3>
              <p className="text-slate-400 text-sm">
                Practice in controlled vulnerable environments.
              </p>
            </div>
          </Link>

          {/*<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition">
            <h3 className="text-lg font-semibold mb-2">Vulnerability Scanner</h3>
            <p className="text-slate-400 text-sm">
              Perform port scanning and security analysis.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition">
            <h3 className="text-lg font-semibold mb-2">Code Review Assistant</h3>
            <p className="text-slate-400 text-sm">
              Analyze code snippets for vulnerabilities.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition">
            <h3 className="text-lg font-semibold mb-2">Cloud Security Labs</h3>
            <p className="text-slate-400 text-sm">
              Learn cloud misconfiguration detection.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition">
            <h3 className="text-lg font-semibold mb-2">Report Generator</h3>
            <p className="text-slate-400 text-sm">
              Generate professional penetration testing reports.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition">
            <h3 className="text-lg font-semibold mb-2">Threat Modeling</h3>
            <p className="text-slate-400 text-sm">
              Design secure systems using STRIDE methodology.
            </p>
          </div>*/}

        </div>
      </div>
    </div>
  );
}
