import { useState } from 'react';
import { 
  CheckCircle2, Circle, Flag, ChevronRight, AlertCircle, 
  Network, Server, Globe, HelpCircle, Database,
  TerminalSquare, Copy, ShieldAlert, Lock, Unlock, Cpu,
  FolderSearch, FolderOpen, FileCode, Key,
  Bug, AlertTriangle, FileText, Flame, ShieldCheck, Wrench, BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CommandBuilder from '../workflows/pentest/CommandBuilder';
import PayloadBuilder from '../workflows/websec/PayloadBuilder';
import Confetti from 'react-confetti';
// 🎯 Hardcoded MAX_ATTEMPTS since we deleted the scoring utility
const MAX_ATTEMPTS = 3;

const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy} 
      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-md cursor-pointer relative z-50"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span className="text-[10px] font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

const cleanMarkdownLinks = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

const MethodologyPanel = ({
  moduleData, activeStep, setActiveStep,
  completedSteps, setCompletedSteps,
  vmStatus, requiresVM, nextModule,
  onNextModule, onReturnHome, onTaskScored,
}) => {
  const [flagInput, setFlagInput]   = useState('');
  const [feedback, setFeedback]     = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState({});

  if (!moduleData || !moduleData.tasks) return null;

  const isWebSec = window.location.pathname.includes('/websec');
  const sortedTasks = [...moduleData.tasks].sort((a, b) => a.step_number - b.step_number);

  const handleSubmitFlag = (e, task) => {
    e.preventDefault();
    const attempts = wrongAttempts[task.id] || 0;

    if (flagInput.trim().toLowerCase() === task.expected_flag.toLowerCase()) {
      // 🎯 REMOVED ALL SCORING LOGIC HERE
      setFeedback({ type: 'success' });
      if (!completedSteps.includes(task.step_number)) setCompletedSteps([...completedSteps, task.step_number]);
      
      // We only pass the ID and title now, no points!
      if (onTaskScored) onTaskScored(task.id, task.action_title); 
      
      setFlagInput('');
      
      setTimeout(() => {
        if (task.step_number < sortedTasks.length) {
          setActiveStep(task.step_number + 1);
          setFeedback(null);
        }
      }, 1500);
    } else {
      const newAttempts = attempts + 1;
      setWrongAttempts(prev => ({ ...prev, [task.id]: newAttempts }));
      const remaining = MAX_ATTEMPTS - newAttempts;
      setFeedback({ type: 'error', attempts: newAttempts, remaining });
    }
  };

  const MarkdownComponents = {
    p:      ({ node, ...props }) => <p className="mb-4 text-slate-300 leading-relaxed text-[13px]" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold text-amber-400" {...props} />,
    h3: ({ node, ...props }) => (
      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mt-8 mb-3 flex items-center gap-2 border-b border-slate-700/50 pb-2" {...props} />
    ),
    hr: ({ node, ...props }) => <hr className="border-t border-dashed border-slate-700/60 my-6" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-none space-y-3 mb-6 ml-1" {...props} />,
    li: ({ node, ...props }) => (
      <li className="text-slate-300 text-[13px] leading-relaxed relative pl-5 before:content-['▹'] before:absolute before:left-0 before:top-0.5 before:text-cyan-500 before:font-bold" {...props} />
    ),

    pre: ({ children, ...props }) => {
      let rawText = '';
      if (children && children.props && children.props.children) rawText = String(children.props.children);
      else if (typeof children === 'string') rawText = children;
      
      const cleanText = cleanMarkdownLinks(rawText).replace(/\n$/, '');

      return (
        <div className="relative group bg-[#05070f] border border-slate-700/60 hover:border-cyan-500/50 rounded-xl my-6 overflow-hidden shadow-md transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/40 border-b border-slate-700/50">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <TerminalSquare className="w-3.5 h-3.5 text-cyan-500" /> Execute in Terminal
            </span>
            <CopyButton textToCopy={cleanText} />
          </div>
          <div className="p-4 overflow-x-auto custom-scrollbar">
            <pre {...props} className="m-0 bg-transparent p-0 text-[13px] font-mono text-cyan-300">
              {cleanText}
            </pre>
          </div>
        </div>
      );
    },

    code: ({ node, inline, className, children, ...props }) => {
      const isInline = inline !== false && !/language-(\w+)/.exec(className || '') && !String(children).includes('\n');
      if (isInline) {
        return (
          <code className="bg-slate-800/80 text-amber-400 px-1.5 py-0.5 mx-0.5 rounded text-[13px] font-mono border border-slate-700 shadow-inner" {...props}>
            {children}
          </code>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },
  };

  const isInputDisabled = requiresVM && vmStatus !== 'online';
  const hasTask1 = completedSteps.includes(1);
  const hasTask2 = completedSteps.includes(2);

  return (
    <div className="bg-[#0c0e17] border border-purple-500/20 rounded-2xl h-full flex flex-col shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">

        {/* Progress Circles */}
        <div className="flex items-center justify-center gap-2 mb-8 relative z-30">
          {sortedTasks.map((task, index) => {
            const isActive    = activeStep === task.step_number;
            const isCompleted = completedSteps.includes(task.step_number);
            return (
              <div key={`nav-${task.id}`} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 ${
                  isActive    ? 'border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                : isCompleted ? 'bg-cyan-900/30 text-cyan-600 border border-cyan-900/50'
                :               'border border-purple-900/40 text-purple-700 bg-purple-950/10'
                }`}>
                  {task.step_number}
                </div>
                {index < sortedTasks.length - 1 && <ChevronRight className="w-5 h-5 text-purple-900/50" />}
              </div>
            );
          })}
        </div>

        {/* PHASE 1 HUD: RECONNAISSANCE */}
        {moduleData.title === 'Reconnaissance' && !isWebSec && (
          <div className="sticky top-0 z-40 -mx-8 px-8 pt-6 pb-4 mb-8 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Network className="w-4 h-4 text-cyan-400" /> Live Topology
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 uppercase border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full">Auto-Mapping</span>
            </div>
            <div className="flex justify-between items-center relative py-1 px-1 mt-1">
               <div className="absolute inset-x-10 top-[30%] -translate-y-1/2 h-px bg-slate-600 border-t border-dashed border-slate-500/50" />
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className="p-2.5 rounded-lg border bg-cyan-500/10 border-cyan-500/40">
                    <Server className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[11px] font-bold text-white uppercase block mb-0.5">Nameserver</span>
                    <span className="text-[10px] font-mono text-cyan-300 block mb-0.5">ns1.cybercare</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask1 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask1 ? <Globe className="w-4 h-4 text-emerald-400" /> : <HelpCircle className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-white' : 'text-slate-300'}`}>{hasTask1 ? 'Mail Server' : 'Unknown'}</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask1 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask1 ? '10.10.50.15' : 'Unresolved'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask2 ? 'bg-purple-500/10 border-purple-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <Database className="w-4 h-4 text-purple-400" /> : <HelpCircle className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask2 ? 'text-white' : 'text-slate-300'}`}>{hasTask2 ? 'Dev Server' : 'Hidden'}</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-purple-300' : 'text-slate-500'}`}>{hasTask2 ? 'dev.cybercare' : 'Unresolved'}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PHASE 2 HUD: SCANNING */}
        {moduleData.title === 'Scanning' && !isWebSec && (
          <div className="sticky top-0 z-40 -mx-8 px-8 pt-6 pb-4 mb-8 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" /> Live Attack Surface
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 uppercase border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Target: 10.10.50.11
              </span>
            </div>
            <div className="flex justify-between items-center relative py-1 px-1 mt-1">
               <div className="absolute inset-x-10 top-[30%] -translate-y-1/2 h-px bg-slate-600 border-t border-dashed border-slate-500/50" />
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className="p-2.5 rounded-lg border bg-slate-800/50 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Cpu className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[11px] font-bold text-white uppercase block mb-0.5">Target Host</span>
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">10.10.50.11</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask2 ? 'bg-cyan-500/10 border-cyan-500/40' : hasTask1 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <Unlock className="w-4 h-4 text-cyan-400" /> : hasTask1 ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-white' : 'text-slate-400'}`}>Port 22</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-cyan-300' : hasTask1 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask2 ? 'OpenSSH 8.2p1' : hasTask1 ? 'OPEN' : 'FILTERED'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 delay-100 ${hasTask2 ? 'bg-purple-500/10 border-purple-500/40' : hasTask1 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <Unlock className="w-4 h-4 text-purple-400" /> : hasTask1 ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-white' : 'text-slate-400'}`}>Port 53</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-purple-300' : hasTask1 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask2 ? 'ISC BIND 9.16' : hasTask1 ? 'OPEN' : 'FILTERED'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 delay-200 ${hasTask2 ? 'bg-amber-500/10 border-amber-500/40' : hasTask1 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <Unlock className="w-4 h-4 text-amber-400" /> : hasTask1 ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-white' : 'text-slate-400'}`}>Port 80</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-amber-300' : hasTask1 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask2 ? 'Apache 2.4.49' : hasTask1 ? 'OPEN' : 'FILTERED'}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PHASE 3 HUD: ENUMERATION */}
        {moduleData.title === 'Enumeration' && !isWebSec && (
          <div className="sticky top-0 z-40 -mx-8 px-8 pt-6 pb-4 mb-8 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <FolderSearch className="w-4 h-4 text-purple-400" /> Web Directory Mapping
              </h3>
              <span className="text-[10px] font-mono text-purple-400 uppercase border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 rounded-full flex items-center gap-2">
                Target: http://10.10.50.11
              </span>
            </div>
            <div className="flex justify-between items-center relative py-1 px-1 mt-1">
               <div className="absolute inset-x-10 top-[30%] -translate-y-1/2 h-px bg-slate-600 border-t border-dashed border-slate-500/50" />
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className="p-2.5 rounded-lg border bg-slate-800/50 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <Globe className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[11px] font-bold text-white uppercase block mb-0.5">Web Root</span>
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">/</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask1 ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask1 ? <FolderOpen className="w-4 h-4 text-cyan-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-white' : 'text-slate-400'}`}>Hidden Folder</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask1 ? 'text-cyan-300' : 'text-slate-500'}`}>{hasTask1 ? '/admin_backup_v2' : 'Brute-forcing...'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 delay-100 ${hasTask2 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <Key className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask2 ? 'text-emerald-400' : 'text-slate-400'}`}>DB Credentials</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask2 ? 'cyber_admin_99!' : 'config.bak'}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PHASE 4 HUD: VULNERABILITY ANALYSIS */}
        {moduleData.title === 'Vulnerability Analysis' && !isWebSec && (
          <div className="sticky top-0 z-40 -mx-8 px-8 pt-6 pb-4 mb-8 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Threat Intelligence Profile
              </h3>
              <span className="text-[10px] font-mono text-red-400 uppercase border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-full">Database Sync</span>
            </div>
            <div className="flex justify-between items-center relative py-1 px-1 mt-1">
               <div className="absolute inset-x-10 top-[30%] -translate-y-1/2 h-px bg-slate-600 border-t border-dashed border-slate-500/50" />
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-500/40">
                    <Server className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[11px] font-bold text-white uppercase block mb-0.5">Target Software</span>
                    <span className="text-[10px] font-mono text-amber-300 block mb-0.5">Apache 2.4.49</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask1 ? 'bg-red-500/10 border-red-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask1 ? <Bug className="w-4 h-4 text-red-400" /> : <HelpCircle className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-red-400' : 'text-slate-400'}`}>CVE Record</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask1 ? 'text-red-300' : 'text-slate-500'}`}>{hasTask1 ? 'CVE-2021-41773' : 'Mapping...'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 delay-100 ${hasTask2 ? 'bg-rose-500/10 border-rose-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <FolderOpen className="w-4 h-4 text-rose-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask2 ? 'text-rose-400' : 'text-slate-400'}`}>Exploit Class</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-rose-300' : 'text-slate-500'}`}>{hasTask2 ? 'Path Traversal' : 'Categorizing...'}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PHASE 5 HUD: REPORTING */}
        {moduleData.title === 'Reporting' && !isWebSec && (
          <div className="sticky top-0 z-40 -mx-8 px-8 pt-6 pb-4 mb-8 bg-[#0c0e17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-300" /> Executive Summary Draft
              </h3>
              <span className={`text-[10px] font-mono uppercase border px-2.5 py-1 rounded-full ${hasTask2 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-400 border-slate-500/30 bg-slate-800/50'}`}>
                {hasTask2 ? 'Report Finalized' : 'Draft in Progress'}
              </span>
            </div>
            <div className="flex justify-between items-center relative py-1 px-1 mt-1">
               <div className="absolute inset-x-10 top-[30%] -translate-y-1/2 h-px bg-slate-600 border-t border-dashed border-slate-500/50" />
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className="p-2.5 rounded-lg border bg-rose-500/10 border-rose-500/40">
                    <Bug className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[11px] font-bold text-white uppercase block mb-0.5">Vulnerability</span>
                    <span className="text-[10px] font-mono text-rose-300 block mb-0.5">CVE-2021-41773</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 ${hasTask1 ? 'bg-red-500/10 border-red-500/40 animate-pulse' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask1 ? <Flame className="w-4 h-4 text-red-500" /> : <HelpCircle className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask1 ? 'text-red-500' : 'text-slate-400'}`}>Risk Severity</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask1 ? 'text-red-400' : 'text-slate-500'}`}>{hasTask1 ? '9.8 (CRITICAL)' : 'Calculating...'}</span>
                  </div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0c0e17] px-2">
                  <div className={`p-2.5 rounded-lg border transition-all duration-700 delay-100 ${hasTask2 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0B0F19] border-slate-600 border-dashed opacity-70'}`}>
                    {hasTask2 ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Wrench className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-center mt-1">
                    <span className={`text-[11px] font-bold uppercase block mb-0.5 ${hasTask2 ? 'text-emerald-400' : 'text-slate-400'}`}>Remediation</span>
                    <span className={`text-[10px] font-mono block mb-0.5 ${hasTask2 ? 'text-emerald-300' : 'text-slate-500'}`}>{hasTask2 ? 'UPDATE APACHE' : 'Formulating...'}</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-6">
          {sortedTasks.map((task, index) => {
            const isExpanded  = activeStep === task.step_number;
            const isCompleted = completedSteps.includes(task.step_number);
            
            // A task is locked if it's NOT the first one, and the previous task is NOT completed.
            const isLocked = index > 0 && !completedSteps.includes(sortedTasks[index - 1].step_number);

            return (
              <div
                key={task.id}
                className={`group transition-all duration-500 ${
                  isExpanded ? 'bg-transparent border-transparent' 
                  : isLocked ? 'bg-transparent border-transparent opacity-75 pointer-events-none' 
                  : 'bg-transparent border-transparent opacity-50 hover:opacity-100'
                } border rounded-2xl`}
              >
                <div
                  className={`pb-4 flex items-center justify-between border-b border-slate-800/50 mb-4 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !isExpanded && !isLocked && setActiveStep(task.step_number)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-all duration-500 ${isCompleted ? 'text-cyan-500' : isExpanded ? 'text-cyan-400' : isLocked ? 'text-slate-500' : 'text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <h3 className={`font-bold text-base tracking-tight ${isExpanded || isCompleted ? 'text-white' : isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
                      Task {task.step_number}: {task.action_title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isLocked ? (
                      <>
                        {isCompleted && <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Completed</span>}
                      </>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Locked</span>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-2 pb-6 pt-1 animate-in fade-in duration-500">
                    <div className="mb-8">

                      <ReactMarkdown components={MarkdownComponents}>{task.instruction_text}</ReactMarkdown>

                      {moduleData.title === 'Scanning' && (task.step_number === 1 || task.step_number === 2) && !isWebSec && (
                        <CommandBuilder targetIP="10.10.50.11" />
                      )}
                      {moduleData.title === 'Exploitation' && task.step_number === 1 && isWebSec && (
                        <PayloadBuilder />
                      )}
                    </div>

                    <div className="bg-[#13152b] border border-indigo-500/30 p-6 rounded-xl shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Flag className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Question {task.step_number}</span>
                        </div>
                      </div>

                      <p className="text-slate-300 font-medium text-sm mb-5 leading-relaxed">{task.question}</p>

                      {isCompleted ? (
                        <div className="flex items-center justify-between bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20">
                          <div className="flex items-center gap-3 font-mono text-sm font-bold">
                            <CheckCircle2 className="w-5 h-5" /> VALID FLAG SUBMITTED
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSubmitFlag(e, task)} className="flex gap-3">
                          <input
                            type="text" value={flagInput} onChange={(e) => setFlagInput(e.target.value)}
                            placeholder={isInputDisabled ? 'Start VM to enable input' : 'Submit answer...'}
                            className="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-5 py-3 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-all disabled:opacity-50"
                            disabled={isInputDisabled}
                          />
                          <button
                            type="submit" disabled={isInputDisabled}
                            className={`px-8 rounded-xl font-bold text-sm transition-all ${!isInputDisabled ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}
                          >
                            Submit
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 🎯 Phase Mastery & Confetti */}
        {completedSteps.length === moduleData.tasks.length && (
          <>
            {moduleData.title === 'Reporting' && (
              <Confetti 
                recycle={false} 
                numberOfPieces={800} 
                gravity={0.15} 
                colors={['#06b6d4', '#10b981', '#f43f5e', '#8b5cf6', '#eab308']} 
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999 }}
              />
            )}

            <div className="mt-12 p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="w-16 h-16 bg-cyan-950/50 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10 tracking-tight">Phase Mastery Achieved</h3>
              <p className="text-slate-400 mb-8 text-sm px-4 relative z-10">
                You have successfully documented all required evidence for this stage of the operation.
              </p>
              {nextModule ? (
                <button
                  onClick={onNextModule}
                  className="relative z-10 flex items-center justify-center gap-2 w-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/60 hover:text-cyan-300 font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg"
                >
                  Initialize Next Phase <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={onReturnHome}
                  className="relative z-10 flex items-center justify-center gap-2 w-full bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/60 hover:text-emerald-300 font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg"
                >
                  Finalize Mission &amp; Exit
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default MethodologyPanel;