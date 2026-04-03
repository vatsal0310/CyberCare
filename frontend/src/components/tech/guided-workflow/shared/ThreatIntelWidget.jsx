// Save this at: frontend/src/components/shared/ThreatIntelWidget.jsx

import React, { useState, useEffect } from 'react';
import { Search, X, Activity, AlertTriangle, ShieldCheck, Database, ChevronRight } from 'lucide-react';

const THREAT_DB = [
  {
    id: 'CVE-2021-41773',
    aliases: ['apache', '2.4.49', 'path traversal', 'cve-2021-41773'],
    title: 'Apache HTTP Server Path Traversal',
    type: 'Path Traversal',
    cvss: '9.8',
    severity: 'Critical',
    description: 'A flaw was found in a change made to path normalization in Apache HTTP Server 2.4.49. An attacker could use a path traversal attack to map URLs to files outside the expected document root. If files outside of the document root are not protected by "require all denied" these requests can succeed.',
    remediation: 'Update Apache to version 2.4.50 or higher.'
  },
  {
    id: 'CWE-89',
    aliases: ['sql', 'sqli', 'sql injection', 'cwe-89', 'injection'],
    title: 'Improper Neutralization of Special Elements used in an SQL Command',
    type: 'SQL Injection',
    cvss: '10.0',
    severity: 'Critical',
    description: 'The software constructs all or part of an SQL command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended SQL command. This allows an attacker to bypass authentication, spoof identity, or execute unauthenticated complete database takeover.',
    remediation: 'Parameterized Queries'
  }
];

const ThreatIntelWidget = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('');
        setResults(null);
        setIsSearching(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);

    setTimeout(() => {
      const searchTerms = query.toLowerCase().trim().split(' ');
      
      const found = THREAT_DB.filter(threat => {
        return searchTerms.some(term => 
          threat.aliases.some(alias => alias.includes(term))
        );
      });

      setResults(found);
      setIsSearching(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Global Threat Intelligence</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Vulnerability Database Search</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-800 bg-[#0B0F19]">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-500 absolute left-4" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by CVE, CWE, software name, or vulnerability type..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-24 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner font-mono text-sm"
              autoFocus
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSearching ? '...' : 'Query'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#05070f] custom-scrollbar relative">
          
          {isSearching && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070f]/80 backdrop-blur-sm z-10">
              <Activity className="w-8 h-8 text-red-500 animate-spin mb-4" />
              <p className="text-xs text-red-400 font-mono uppercase tracking-widest animate-pulse">Querying Global Database...</p>
            </div>
          )}

          {!results && !isSearching && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
              <Database className="w-12 h-12 mb-4" />
              <p className="text-sm font-mono">Awaiting Search Parameters.</p>
            </div>
          )}

          {results && results.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-16 h-16 border border-dashed border-slate-700 rounded-2xl flex items-center justify-center mb-4 bg-slate-900/50">
                {/* 🎯 FIXED: Changed _> to _&gt; to satisfy the JSX parser */}
                <span className="font-mono text-xl">_&gt;</span>
              </div>
              <p className="text-white font-bold mb-1">No records found.</p>
              <p className="text-xs">Check your spelling or ensure you included the exact software version.</p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-6">
              {results.map((threat) => (
                <div key={threat.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 shadow-lg">
                  
                  {/* Threat Header */}
                  <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-800/20">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded text-xs font-mono font-bold">
                          {threat.id}
                        </span>
                        <span className="bg-slate-800 text-slate-300 border border-slate-600 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                          {threat.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{threat.title}</h3>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">CVSS 3.1 Base Score</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-2xl font-black text-red-500">{threat.cvss}</span>
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">{threat.severity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Threat Body */}
                  <div className="p-5 space-y-6">
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Executive Summary
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-[#0B0F19] p-4 rounded-lg border border-slate-800/50">
                        {threat.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Remediation Status
                      </h4>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-mono text-emerald-400 font-bold">{threat.remediation}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-500/50" />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ThreatIntelWidget;