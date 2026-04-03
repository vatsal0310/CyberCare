// Save this at: frontend/src/components/shared/LootBoard.jsx

import React, { useState } from 'react';
import { X, Briefcase, Copy, CheckCircle2, FileText, Key, Hash, Terminal } from 'lucide-react';

const LootBoard = ({ isOpen, setIsOpen, lootData }) => {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'credential': return <Key className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'hash': return <Hash className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0B0F19] border-l border-slate-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Evidence Locker</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">{lootData.length} ITEMS CAPTURED</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {lootData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Briefcase className="w-12 h-12 mb-4" />
            <p className="text-sm font-mono text-center">No evidence collected yet.<br/>Complete tasks to extract loot.</p>
          </div>
        ) : (
          lootData.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative">
              <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold uppercase tracking-wider text-xs">
                {getIcon(item.type)} {item.title}
              </div>

              <div className="relative group">
                {/* 🎯 NEW: If the item is a 'file', render a multi-line code block! */}
                {item.type === 'file' ? (
                  <div className="bg-[#05070f] border border-emerald-500/30 rounded-lg p-4 mb-4 overflow-x-auto custom-scrollbar relative">
                    <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed">
                      {item.value}
                    </pre>
                    <button
                      onClick={() => handleCopy(item.value, item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors shadow-lg"
                    >
                      {copiedId === item.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ) : (
                  // Standard single-line rendering for keys/passwords
                  <div className="bg-[#05070f] border border-emerald-500/30 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                    <span className="text-emerald-400 font-mono text-sm break-all pr-4">{item.value}</span>
                    <button
                      onClick={() => handleCopy(item.value, item.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors shrink-0"
                    >
                      {copiedId === item.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LootBoard;