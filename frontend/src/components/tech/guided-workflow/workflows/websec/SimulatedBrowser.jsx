// Save this at: frontend/src/components/workflows/websec/SimulatedBrowser.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Shield, RotateCcw, ChevronLeft, ChevronRight, Lock, Search, AlertCircle, Terminal as TerminalIcon, Code, User, Database, ShieldAlert, Download, FileText, CheckCircle2 } from 'lucide-react';

const SimulatedBrowser = ({ targetUrl = "portal.cybercare-health.local", onSearch }) => {
  const [activeTab, setActiveTab] = useState('terminal'); 

  // Browser State
  const [url, setUrl] = useState(targetUrl);
  // States: home, login, search_results, source, dashboard, idor_success, admin_dashboard
  const [browserContent, setBrowserContent] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [xssMessage, setXssMessage] = useState(''); 
  const [downloadToast, setDownloadToast] = useState('');

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    'CyberCare Attack Terminal v2.0 (Smart Mode)',
    'Target context: web_security_lab',
    'Type "help" for a list of available commands.',
    'Ready...'
  ]);
  const endOfTerminalRef = useRef(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleTerminalCommand = async (e) => {
    if (e.key === 'Enter' && !isExecuting) {
      const cmd = terminalInput.trim();
      setTerminalInput('');

      if (!cmd) {
        setTerminalHistory(prev => [...prev, `root@attack-box:~# `]);
        return;
      }

      setTerminalHistory(prev => [...prev, `root@attack-box:~# ${cmd}`]);
      setIsExecuting(true);

      const args = cmd.split(' ');
      const baseCmd = args[0].toLowerCase();

      const appendLines = async (lines, delay = 50) => {
        for (let line of lines) {
          await new Promise(resolve => setTimeout(resolve, delay));
          setTerminalHistory(prev => [...prev, line]);
        }
      };

      switch (baseCmd) {
        case 'clear':
          setTerminalHistory([]);
          break;
        case 'help':
          await appendLines([
            'CyberCare Terminal Help',
            'Available commands:',
            '  whoami    - Print effective userid',
            '  ls        - List directory contents',
            '  ping      - Send ICMP ECHO_REQUEST to network hosts',
            '  ffuf      - Fuzz Faster U Fool (Web Fuzzer)',
            '  clear     - Clear terminal screen'
          ], 50);
          break;
        case 'whoami':
          await appendLines(['root'], 200);
          break;
        case 'ls':
          await appendLines(['common_apis.txt   payloads   scripts'], 200);
          break;
        case 'ping':
          if (args[1] === 'portal.cybercare-health.local') {
            await appendLines([
              'PING portal.cybercare-health.local (192.168.1.105) 56(84) bytes of data.',
              '64 bytes from 192.168.1.105: icmp_seq=1 ttl=64 time=0.211 ms',
              '64 bytes from 192.168.1.105: icmp_seq=2 ttl=64 time=0.185 ms',
              '64 bytes from 192.168.1.105: icmp_seq=3 ttl=64 time=0.190 ms',
              '--- portal.cybercare-health.local ping statistics ---',
              '3 packets transmitted, 3 received, 0% packet loss, time 2041ms'
            ], 600);
          } else {
            await appendLines([`ping: ${args[1] || ''}: Name or service not known`], 200);
          }
          break;
        case 'ffuf':
          if (cmd.includes('common_apis.txt') && cmd.includes('http://portal.cybercare-health.local/FUZZ')) {
            await appendLines([
              ' ',
              '        /\'___\\  /\'___\\           /\'___\\       ',
              '       /\\ \\__/ /\\ \\__/  __  __  /\\ \\__/       ',
              '       \\ \\ ,__\\\\ \\ ,__\\/\\ \\/\\ \\ \\ \\ ,__\\      ',
              '        \\ \\ \\_/ \\ \\ \\_/\\ \\ \\_\\ \\ \\ \\ \\_/      ',
              '         \\ \\_\\   \\ \\_\\  \\ \\____/  \\ \\_\\       ',
              '          \\/_/    \\/_/   \\/___/    \\/_/       ',
              ' ',
              ':: Method           : GET',
              ':: URL              : http://portal.cybercare-health.local/FUZZ',
              ':: Wordlist         : common_apis.txt',
              ':: Timeout          : 10',
              ':: Threads          : 40',
              '________________________________________________',
              ' '
            ], 20); 
            
            await new Promise(r => setTimeout(r, 1200)); 
            
            await appendLines([
              '/api/v1/users           [Status: 200, Size: 842, Words: 112, Lines: 40]'
            ], 100);

            await new Promise(r => setTimeout(r, 800)); 

            await appendLines([
              ' ',
              ':: Progress: [4614/4614] :: Job [1/1] :: 0 req/sec :: Duration: [0:00:02] ::',
            ], 50);
          } else {
            await appendLines([
              'Error: Invalid ffuf syntax or missing required arguments.',
              'Hint: Check your wordlist and target URL.'
            ], 100);
          }
          break;
        default:
          await appendLines([`bash: command not found: ${baseCmd}`], 50);
      }
      
      setIsExecuting(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Strip all whitespace to make evaluating the payload easier
    const cleanQuery = searchQuery.replace(/\s+/g, '');
    
    if (cleanQuery.includes('<script>alert(document.cookie)</script>')) {
      // 🎯 THE PERFECT PAYLOAD: Reveals the flag
      setXssMessage('session_token=xss_flag_8492k');
      if (onSearch) onSearch(searchQuery);
      
    } else if (cleanQuery.includes('<script>alert(1)</script>')) {
      // 🎯 BASIC TEST PAYLOAD: Pops a generic 1
      setXssMessage('1');
      if (onSearch) onSearch(searchQuery);
      
    } else if (cleanQuery.includes('<script>')) {
      // 🎯 BROKEN SYNTAX: Throws an error to teach them JS structure
      setXssMessage('JavaScript Error: Malformed script syntax. Did you put the object inside the alert() function?');
    }
    
    setBrowserContent('search_results');
    setUrl(`${targetUrl}/search?q=${encodeURIComponent(searchQuery)}`);
  };
  const handleUrlSubmit = (e) => {
    if (e.key === 'Enter') {
      const newUrl = url.toLowerCase();
      if (newUrl.includes('patient_id=102')) {
        setBrowserContent('idor_success');
      } else if (newUrl.includes('patient_id=101')) {
        setBrowserContent('dashboard');
      } else if (newUrl.includes('search')) {
        setBrowserContent('search_results');
      } else {
        setBrowserContent('home');
        setUrl(targetUrl);
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const input = loginUsername.trim().toUpperCase();
    
    if (input.includes("'") && input.includes("OR 1=1") && input.includes("--")) {
      setLoginError('');
      setBrowserContent('admin_dashboard');
      setUrl(`${targetUrl}/admin/console`);
    } else if (input === "DAVE@CYBERCARE.LOCAL" || input === "") { // 🎯 FIXED: Let Dave (or empty submission) pass
      setLoginError('');
      setBrowserContent('dashboard');
      setUrl(`${targetUrl}/dashboard?patient_id=101`);
    } else {
      setLoginError('Invalid credentials or SQL syntax error.');
      setLoginPassword('');
    }
  };

  const handleExportClick = () => {
    setDownloadToast('master_users.csv');
    setTimeout(() => setDownloadToast(''), 4000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      
      <div className="flex bg-slate-950 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'terminal' ? 'bg-slate-900 text-cyan-400 border-t-2 border-t-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
        >
          <TerminalIcon className="w-4 h-4" /> Attack Terminal
        </button>
        <button 
          onClick={() => setActiveTab('browser')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'browser' ? 'bg-slate-900 text-purple-400 border-t-2 border-t-purple-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
        >
          <Globe className="w-4 h-4" /> Target Browser
        </button>
      </div>

      {activeTab === 'terminal' && (
        <div className="flex-1 bg-[#0c0c0c] p-4 font-mono text-sm overflow-y-auto flex flex-col cursor-text" onClick={() => document.getElementById('term-input')?.focus()}>
          <div className="flex-1">
            {terminalHistory.map((line, i) => (
              <div key={i} className={`mb-1 ${line.includes('root@') ? 'text-emerald-400 font-bold' : line.includes('api/v1') ? 'text-amber-400 font-bold' : line.includes('Error:') ? 'text-rose-400' : 'text-slate-300'}`}>
                {line.replace(/ /g, "\u00a0")}
              </div>
            ))}
            
            <div className="flex items-center gap-2 mt-1 shrink-0">
              <span className={`font-bold ${isExecuting ? 'text-slate-600' : 'text-emerald-400'}`}>root@attack-box:~#</span>
              {!isExecuting && (
                <input 
                  id="term-input"
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalCommand}
                  className="flex-1 bg-transparent border-none outline-none text-slate-300 focus:ring-0 p-0 shadow-none selection:bg-cyan-500/30 caret-emerald-400"
                  autoFocus
                  spellCheck="false"
                  autoComplete="off"
                />
              )}
              {isExecuting && (
                <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block ml-1" />
              )}
            </div>
            
            <div ref={endOfTerminalRef} />
          </div>
        </div>
      )}

      {activeTab === 'browser' && (
        <div className="flex-1 flex flex-col min-h-0 relative">
          
          <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <ChevronLeft className="w-4 h-4 text-slate-600 cursor-not-allowed" />
              <ChevronRight className="w-4 h-4 text-slate-600 cursor-not-allowed" />
              <RotateCcw onClick={() => { setBrowserContent('home'); setUrl(targetUrl); setLoginError(''); }} className="w-4 h-4 text-slate-400 ml-1 cursor-pointer hover:text-white" />
            </div>

            <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 gap-2 shadow-inner">
              <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
              <input 
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleUrlSubmit}
                className="bg-transparent border-none outline-none text-xs text-slate-300 font-mono flex-1 focus:ring-0 p-0 w-full"
              />
              
              <button 
                onClick={() => setBrowserContent(prev => prev === 'source' ? 'home' : 'source')}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded transition-colors shrink-0"
                title="View Page Source"
              >
                <Code className="w-3 h-3" /> {browserContent === 'source' ? 'Close Source' : 'Inspect'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white text-slate-900 p-0 relative">
            
            {xssMessage && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in zoom-in duration-200">
                <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-6 max-w-xs text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Embedded Page Message</h3>
                  <p className="text-sm text-slate-600 mb-6 font-mono bg-slate-100 p-3 rounded-lg break-all text-left border border-slate-200">
                    {xssMessage}
                  </p>
                  <button 
                    onClick={() => setXssMessage('')}
                    className="w-full py-2 bg-slate-900 text-white rounded-md font-bold text-sm hover:bg-slate-800"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {downloadToast && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-8 fade-in border border-slate-700">
                <div className="bg-emerald-500/20 p-1.5 rounded-md">
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400">Download Complete</p>
                  <p className="text-xs font-mono text-slate-300">{downloadToast}</p>
                </div>
              </div>
            )}
            
            {browserContent === 'home' && (
              <div className="p-8 font-sans">
                <div style={{ display: 'none' }}>
                  {``}
                </div>
                
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                  <Shield className="w-8 h-8 text-emerald-600" />
                  <h1 className="text-2xl font-black tracking-tight text-slate-800">CyberCare <span className="text-emerald-600">Clinic</span></h1>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2">Patient Records</h3>
                    <p className="text-sm text-slate-500 mb-4">Securely access your medical history and upcoming appointments.</p>
                    <button 
                      onClick={() => { 
                        setBrowserContent('login'); 
                        setUrl(`${targetUrl}/login`); 
                        // 🎯 FIXED: Pre-fill credentials to simulate "Saved Password"
                        setLoginUsername('dave@cybercare.local'); 
                        setLoginPassword('password123');
                        setLoginError(''); 
                      }} 
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700"
                    >
                      Login to Portal
                    </button>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2">Public Directory</h3>
                    <p className="text-sm text-slate-500 mb-4">Find practitioners and specialists available at our locations.</p>
                    <button className="px-4 py-2 bg-slate-200 text-slate-600 text-sm font-bold rounded-lg cursor-not-allowed">Coming Soon</button>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" /> Global Search
                  </h3>
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search symptoms, doctors..."
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold">Search</button>
                  </form>
                </div>
              </div>
            )}

            {browserContent === 'login' && (
              <div className="h-full flex items-center justify-center bg-slate-50 p-8 font-sans relative">
                <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8 z-10">
                  <h2 className="text-xl font-bold text-center mb-2 text-slate-800">Patient Portal</h2>
                  
                  {/* 🎯 NEW: Saved Credentials UI Notice */}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] p-2 rounded-lg text-center font-bold mb-6 uppercase tracking-wider flex items-center justify-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3" /> Saved Credentials Auto-Filled
                  </div>
                  
                  {loginError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-lg text-center font-bold mb-4 animate-in fade-in">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Username / Email</label>
                      <input 
                        type="text" 
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-medium" 
                        placeholder="username" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Password</label>
                      <input 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-medium text-emerald-600" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-emerald-600/20 mt-4 hover:bg-emerald-700 transition-colors"
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            )}

            {browserContent === 'admin_dashboard' && (
              <div className="p-8 font-sans bg-slate-100 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Console</h2>
                      <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Access Level: God Mode</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono border border-slate-200 px-2 py-1 rounded bg-white">Connected as: root@localhost</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
                      <Database className="w-5 h-5 text-purple-500" /> Database Management
                    </div>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      Generate and export full comma-separated (CSV) backups of the internal patient and staff credentials database.
                    </p>
                    <button
                      onClick={handleExportClick}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4 text-slate-400" /> Export Users (CSV)
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
                      <FileText className="w-5 h-5 text-slate-400" /> System Logs
                    </div>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      View recent server access logs, error reports, and security events. Feature currently disabled for maintenance.
                    </p>
                    <button disabled className="w-full bg-slate-100 text-slate-400 text-sm font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" /> Locked
                    </button>
                  </div>
                </div>
              </div>
            )}

            {browserContent === 'dashboard' && (
              <div className="p-8 font-sans">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome back.</h2>
                    <p className="text-sm text-slate-500 font-mono">Profile ID: #101</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-700 mb-4">Your Recent Medical Records</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex justify-between border-b pb-2"><span>Annual Checkup</span> <span>Oct 12, 2025</span></li>
                    <li className="flex justify-between border-b pb-2"><span>Blood Work Panel</span> <span>Oct 14, 2025</span></li>
                    <li className="flex justify-between font-bold text-emerald-600 pt-2">Status: ALL CLEAR</li>
                  </ul>
                </div>
              </div>
            )}

            {browserContent === 'idor_success' && (
              <div className="p-8 font-sans bg-rose-50 h-full">
                <div className="bg-rose-600 text-white p-4 rounded-lg mb-8 font-bold flex items-center gap-3 shadow-lg shadow-rose-600/20 animate-in slide-in-from-top-4">
                  <AlertCircle className="w-6 h-6" /> UNAUTHORIZED ACCESS DETECTED
                </div>
                <div className="bg-white border border-rose-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Confidential File</h2>
                  <p className="text-sm text-rose-500 font-mono mb-6">Profile ID: #102</p>
                  
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-4 border-b pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Patient Name</span>
                      <span className="col-span-2 font-bold text-slate-800">Sarah Jenkins</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-3">
                      <span className="text-slate-500 font-bold uppercase text-xs">Diagnosis</span>
                      <span className="col-span-2 text-rose-600 font-bold">Classified (Level 3)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-slate-500 font-bold uppercase text-xs">Payment Method</span>
                      <span className="col-span-2 font-mono text-slate-600">****-****-****-4921</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {browserContent === 'search_results' && (
              <div className="p-8 font-sans">
                 <button onClick={() => { setBrowserContent('home'); setUrl(targetUrl); }} className="text-xs text-slate-400 hover:text-emerald-600 mb-6">← Back to Search</button>
                 <h2 className="text-xl font-bold mb-2 text-slate-800">Search Results for: <span className="italic text-emerald-600">"{searchQuery}"</span></h2>
                 <p className="text-sm text-slate-500 mb-8 border-b pb-4">0 results found.</p>
              </div>
            )}

            {browserContent === 'source' && (
              <div className="h-full bg-[#1e1e1e] text-[#d4d4d4] p-6 font-mono text-sm overflow-y-auto select-text">
                <pre>
                  <code>
<span className="text-[#808080]">&lt;!DOCTYPE html&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;html</span> <span className="text-[#9cdcfe]">lang</span>=<span className="text-[#ce9178]">"en"</span><span className="text-[#569cd6]">&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;head&gt;</span>{'\n'}
  <span className="text-[#569cd6]">&lt;meta</span> <span className="text-[#9cdcfe]">charset</span>=<span className="text-[#ce9178]">"UTF-8"</span><span className="text-[#569cd6]">&gt;</span>{'\n'}
  <span className="text-[#569cd6]">&lt;title&gt;</span>CyberCare Internal Portal<span className="text-[#569cd6]">&lt;/title&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;/head&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;body&gt;</span>{'\n'}
  <span className="text-[#569cd6]">&lt;div</span> <span className="text-[#9cdcfe]">id</span>=<span className="text-[#ce9178]">"app-root"</span><span className="text-[#569cd6]">&gt;</span>{'\n'}
    <span className="text-[#569cd6]">&lt;form</span> <span className="text-[#9cdcfe]">action</span>=<span className="text-[#ce9178]">"/api/v1/auth"</span><span className="text-[#569cd6]">&gt;</span>{'\n'}
      <span className="text-[#569cd6]">&lt;input</span> <span className="text-[#9cdcfe]">type</span>=<span className="text-[#ce9178]">"text"</span> <span className="text-[#569cd6]">/&gt;</span>{'\n'}
      <span className="text-[#569cd6]">&lt;button</span> <span className="text-[#9cdcfe]">type</span>=<span className="text-[#ce9178]">"submit"</span><span className="text-[#569cd6]">&gt;</span>Login<span className="text-[#569cd6]">&lt;/button&gt;</span>{'\n'}
    <span className="text-[#569cd6]">&lt;/form&gt;</span>{'\n'}
  <span className="text-[#569cd6]">&lt;/div&gt;</span>{'\n'}
  {'\n'}
  <span className="text-[#6a9955] font-bold bg-green-900/30 px-1">&lt;!-- DEV NOTE: Temporary API Key for testing. DO NOT PUSH TO PROD. dev_api_key: ak_99x81m --&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;/body&gt;</span>{'\n'}
<span className="text-[#569cd6]">&lt;/html&gt;</span>
                  </code>
                </pre>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatedBrowser;