// Save this at: frontend/src/pages/MissionComplete.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Download, Home, CheckCircle2,
  FileText, AlertTriangle, Trophy, Zap, Shield
} from 'lucide-react';

const MissionComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine track from URL
  const isWebSec = location.pathname.includes('/websec');
  
  const [finalLoot, setFinalLoot] = useState([]);

  useEffect(() => {
    // Load the isolated loot bucket
    const lootKey = isWebSec ? 'cybercare_websec_loot' : 'cybercare_pentest_loot';
    const savedLoot = JSON.parse(sessionStorage.getItem(lootKey) || '[]');
    setFinalLoot(savedLoot);
  }, [isWebSec]);

  // Helper to check if a specific piece of evidence was found
  const hasFound = (id) => finalLoot.some(item => item.id === id);

  // Dynamic Theme Variables
  const themeColor = isWebSec ? 'purple' : 'cyan';
  const buttonClass = isWebSec 
    ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
    : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.3)]';

  const recommendations = isWebSec ? [
    "Implement Parameterized Queries to permanently prevent SQL Injection.",
    "Enforce strict server-side Authorization checks to prevent IDOR access.",
    "Sanitize and encode all user inputs to neutralize Reflected XSS vectors."
  ] : [
    "Immediately patch Apache HTTP Server to version 2.4.50+.",
    "Implement 'Strict-Transport-Security' and rotate database keys.",
    "Disable Directory Listing and restrict access to backup files."
  ];

  // Simplified Module List for the UI
  const modules = [
    { id: 'm1', title: 'Reconnaissance' },
    { id: 'm2', title: isWebSec ? 'Input Testing' : 'Scanning' },
    { id: 'm3', title: isWebSec ? 'Exploitation' : 'Enumeration' },
    { id: 'm4', title: 'Vulnerability Analysis' },
    { id: 'm5', title: 'Reporting' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* --- Header Section --- */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.15)] mb-5">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Concluded
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Mission Accomplished</h1>
        </div>

        {/* --- Completion Bar (Score Removed) --- */}
        <div className="mb-6 px-6 py-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex flex-wrap items-center gap-6">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-emerald-400">100%</span>
            <span className="text-slate-400 text-sm mb-1 font-bold uppercase tracking-widest">Completed</span>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden mb-1">
              <div className="h-full rounded-full transition-all duration-1000 bg-emerald-400 w-full" />
            </div>
            <p className="text-xs text-emerald-500/70 font-mono">All Methodology Phases Executed</p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black uppercase tracking-wider text-emerald-400">Elite Operator</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column: Phase Checklist */}
          <div className="bg-[#0c0e17] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 text-${themeColor}-500`} /> Methodology Execution
            </h2>
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{mod.title}</span>
                    <span className="font-mono text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Verified</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${themeColor}-500 w-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Executive Debrief */}
          <div className="bg-[#0c0e17] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
              <FileText className={`w-3.5 h-3.5 text-${themeColor}-500`} /> Executive Debrief
            </h2>
            
            <div className="space-y-6">
              {/* 1. Attack Path Narrative */}
              <div className={`p-4 rounded-xl bg-slate-900/80 border border-slate-800 border-l-4 border-l-${themeColor}-500`}>
                <p className="text-[13px] text-slate-300 leading-relaxed italic">
                  {isWebSec ? (
                    <>
                      "The engagement demonstrated a high-risk attack chain. Initial reconnaissance was facilitated through 
                      <span className={`text-${themeColor}-400 font-bold`}> API Fuzzing</span>. 
                      By exploiting improper input sanitization, we bypassed authentication via SQL Injection, 
                      proving that the application layer is currently vulnerable to complete database exfiltration."
                    </>
                  ) : (
                    <>
                      "The engagement demonstrated a high-risk attack chain. Initial entry was facilitated through 
                      <span className={`text-${themeColor}-400 font-bold`}> External Reconnaissance</span>. 
                      By exploiting exposed configuration files, we pivoted into the internal database environment, 
                      proving that static secrets are currently vulnerable to simple directory brute-forcing."
                    </>
                  )}
                </p>
              </div>

              {/* 2. Critical Vulnerability Analysis */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                <h3 className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Root Cause: {isWebSec ? 'CWE-89' : 'CVE-2021-41773'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isWebSec ? (
                    <>A <span className="text-white font-bold">Critical SQL Injection</span> vulnerability was identified in the authentication portal. This allowed unauthenticated access to the Administrator dashboard, leading to total compromise of patient records.</>
                  ) : (
                    <>A <span className="text-white font-bold">Critical Path Traversal</span> vulnerability was identified in the web server. This allowed unauthenticated access to sensitive system files. This single flaw serves as the primary gateway for total system compromise.</>
                  )}
                </p>
              </div>

              {/* 3. Security Recommendations (To-Do List for Client) */}
              <div className="border-t border-slate-800 pt-5">
                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Recommended Remediation
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-900/30 rounded-lg border border-slate-800/40">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[11px] text-slate-400 font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Action Footer --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => alert('PDF generation is a future feature!')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all border border-slate-700">
            <Download className="w-4 h-4" /> Download Certificate
          </button>
          <button onClick={() => navigate('/technical-user/guided-workflow')} className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${buttonClass}`}>
            <Home className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default MissionComplete;