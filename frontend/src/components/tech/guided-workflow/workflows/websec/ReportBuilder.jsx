// Save this at: frontend/src/components/workflows/websec/ReportBuilder.jsx

import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, FileCheck, Lock, ChevronDown, Eye } from 'lucide-react';

const ReportBuilder = () => {
  const [vector, setVector] = useState('');
  const [cvss, setCvss] = useState('');
  const [remediation, setRemediation] = useState('');
  const [selectedLoot, setSelectedLoot] = useState([]);
  
  const [availableLoot, setAvailableLoot] = useState([]);
  // 🎯 NEW: Added 'verified_view' state to review the document after success
  const [status, setStatus] = useState('draft'); // 'draft', 'error', 'verified', 'verified_view'

  useEffect(() => {
    const isWebSec = window.location.pathname.includes('/websec');
    const lootKey = isWebSec ? 'cybercare_websec_loot' : 'cybercare_pentest_loot';
    const savedLoot = JSON.parse(sessionStorage.getItem(lootKey) || '[]');
    setAvailableLoot(savedLoot);
  }, []);

  const toggleLoot = (id) => {
    if (status === 'verified' || status === 'verified_view') return; // Prevent changing if locked
    setSelectedLoot(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleCompile = () => {
    const isVectorCorrect = vector === 'sqli';
    const isCvssCorrect = cvss === 'critical';
    const isRemediationCorrect = remediation === 'parameterized';
    const isLootCorrect = selectedLoot.includes('task_ws_enum_2'); // master_users.csv

    if (isVectorCorrect && isCvssCorrect && isRemediationCorrect && isLootCorrect) {
      setStatus('verified');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('draft'), 3000);
    }
  };

  const isLocked = status === 'verified' || status === 'verified_view';

  return (
    <div className="h-full bg-[#0c0e17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative font-sans">
      
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Executive Summary Builder</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Document Classification: CONFIDENTIAL</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        
        {/* Full Screen Success Overlay */}
        {status === 'verified' && (
          <div className="absolute inset-0 bg-[#0c0e17]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 border-4 border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] rotate-[-10deg] bg-emerald-950/30">
              <FileCheck className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2 text-center">Report Verified</h2>
            <p className="text-emerald-400 font-mono text-sm mb-8 text-center">All technical assessments are accurate.</p>
            
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-center w-full max-w-md shadow-2xl mb-8">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Cryptographic Signature
              </p>
              <div className="text-3xl font-mono font-bold text-white tracking-wider bg-slate-950 py-4 rounded-lg border border-slate-800">
                SIG-SQLI-99X
              </div>
            </div>

            {/* 🎯 NEW: Button to dismiss the overlay and view the read-only report */}
            <button 
              onClick={() => setStatus('verified_view')}
              className="flex items-center gap-2 bg-slate-900 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <Eye className="w-4 h-4" /> Review Compiled Document
            </button>
          </div>
        )}

        <div className="max-w-xl mx-auto space-y-8 pb-10">
          
          {/* 🎯 NEW: Top Banner showing signature when in Review Mode */}
          {status === 'verified_view' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 fade-in">
              <div className="flex items-center gap-3 text-emerald-400">
                <FileCheck className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-widest">Document Locked</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-500/70 uppercase block font-bold tracking-wider">Signature</span>
                <span className="font-mono text-white font-bold">SIG-SQLI-99X</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-lg flex items-center gap-3 animate-in shake">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">QA Failed: Incorrect technical assessment or missing evidence. Review your selections.</p>
            </div>
          )}

          {/* Section 1: Vector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded flex items-center justify-center text-[10px]">1</span> Primary Attack Vector
            </label>
            <div className="relative">
              <select 
                disabled={isLocked}
                value={vector} onChange={(e) => setVector(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select the root cause vulnerability...</option>
                <option value="xss">Cross-Site Scripting (XSS)</option>
                <option value="sqli">SQL Injection (CWE-89)</option>
                <option value="idor">Insecure Direct Object Reference (IDOR)</option>
                <option value="csrf">Cross-Site Request Forgery (CSRF)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Section 2: CVSS */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded flex items-center justify-center text-[10px]">2</span> CVSS 3.1 Base Score
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'low', label: 'Low', color: 'hover:border-emerald-500 hover:bg-emerald-500/10' },
                { id: 'medium', label: 'Medium', color: 'hover:border-yellow-500 hover:bg-yellow-500/10' },
                { id: 'high', label: 'High', color: 'hover:border-orange-500 hover:bg-orange-500/10' },
                { id: 'critical', label: 'Critical', color: 'hover:border-rose-500 hover:bg-rose-500/10' }
              ].map(level => (
                <button
                  key={level.id}
                  disabled={isLocked}
                  onClick={() => setCvss(level.id)}
                  className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all disabled:cursor-not-allowed ${cvss === level.id ? `bg-slate-800 border-slate-500 text-white shadow-inner` : `bg-slate-900/50 border-slate-800 text-slate-500 ${level.color} ${isLocked ? 'opacity-40' : ''}`}`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Evidence */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded flex items-center justify-center text-[10px]">3</span> Attach Evidence (Loot)
            </label>
            
            {availableLoot.length === 0 ? (
              <div className="p-4 bg-slate-900/30 border border-slate-800 border-dashed rounded-lg text-center text-sm text-slate-500">
                No evidence found in local storage.
              </div>
            ) : (
              <div className="space-y-2">
                {availableLoot.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleLoot(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${selectedLoot.includes(item.id) ? 'bg-blue-500/10 border-blue-500/50' : `bg-slate-900/50 border-slate-700 ${isLocked ? 'opacity-50' : 'hover:border-slate-500'}`}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedLoot.includes(item.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-500'}`}>
                      {selectedLoot.includes(item.id) && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${selectedLoot.includes(item.id) ? 'text-blue-100' : 'text-slate-300'}`}>{item.title}</p>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-sm">{item.value.split('\n')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Remediation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 bg-slate-800 text-slate-300 rounded flex items-center justify-center text-[10px]">4</span> Recommended Remediation
            </label>
            <div className="relative">
              <select 
                disabled={isLocked}
                value={remediation} onChange={(e) => setRemediation(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select a strategy...</option>
                <option value="waf">Deploy Web Application Firewall (WAF)</option>
                <option value="parameterized">Implement Parameterized Queries</option>
                <option value="encoding">HTML Output Encoding</option>
                <option value="obfuscation">Database Obfuscation</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      {!isLocked && (
        <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 p-6 flex justify-end shrink-0">
          <button 
            onClick={handleCompile}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            <ShieldAlert className="w-4 h-4" /> Validate & Compile Report
          </button>
        </div>
      )}

    </div>
  );
};

export default ReportBuilder;