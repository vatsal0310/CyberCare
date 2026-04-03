// Save this at: frontend/src/components/workflows/websec/PayloadBuilder.jsx

import React, { useState } from 'react';
import { Database, Code2, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

const PayloadBuilder = () => {
  // 🎯 FIXED: Initial defaults set to incorrect values to force user interaction!
  const [quote, setQuote]     = useState('"'); // Double Quote (Won't break single-quoted syntax)
  const [logic, setLogic]     = useState("AND 1=0"); // Always False
  const [comment, setComment] = useState("#"); // Useless comment for this target
  const [copied, setCopied]   = useState(false);

  const finalPayload = `${quote} ${logic} ${comment}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0B0F19] border border-purple-500/30 rounded-xl p-6 mt-6 mb-8 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Database className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-200">SQLi Payload Constructor</h3>
          <p className="text-xs text-slate-500 font-mono">Target: Authentication Bypass</p>
        </div>
      </div>

      {/* Interactive Selectors */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">1. Break Syntax</label>
          <select 
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-purple-300 font-mono focus:border-purple-500 outline-none"
          >
            <option value="'">Single Quote (')</option>
            <option value='"'>Double Quote (")</option>
            <option value="')">Quote + Paren (')')</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">2. Logic Bypass</label>
          <select 
            value={logic}
            onChange={(e) => setLogic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-purple-300 font-mono focus:border-purple-500 outline-none"
          >
            <option value="OR 1=1">OR 1=1 (Always True)</option>
            <option value="OR 'a'='a'">OR 'a'='a'</option>
            <option value="AND 1=0">AND 1=0 (Always False)</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">3. Comment Out</label>
          <select 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-purple-300 font-mono focus:border-purple-500 outline-none"
          >
            <option value="--">Dash-Dash (--)</option>
            <option value="#">Hash (#)</option>
            <option value="/*">Slash-Star (/*)</option>
          </select>
        </div>
      </div>

      {/* Real-time Output */}
      <div className="bg-[#05070f] border border-slate-800 rounded-lg p-4 relative group">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Code2 className="w-3 h-3" /> Compiled Payload
          </span>
          <button 
            onClick={handleCopy}
            className="text-xs font-bold text-slate-400 hover:text-purple-400 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
        
        <div className="font-mono text-lg text-emerald-400 tracking-wider">
          {finalPayload}
        </div>
        
        {/* The visual reward is good, but now they have to EARN it */}
        {finalPayload === "' OR 1=1 --" && (
          <div className="absolute -bottom-3 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold animate-in zoom-in duration-300">
            <ShieldAlert className="w-3 h-3" /> OPTIMAL BYPASS
          </div>
        )}
      </div>
    </div>
  );
};

export default PayloadBuilder;