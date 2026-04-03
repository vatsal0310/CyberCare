import { useNavigate } from 'react-router-dom';
import { Terminal, Globe, ChevronRight, ShieldAlert, Target } from 'lucide-react';
// 👇 ADDED: Import your Sidebar (adjust the path if your Sidebar is located elsewhere)
import TechSidebar from '../../../../components/tech/TechSidebar'; 

export default function WorkflowDashboard() {
  const navigate = useNavigate();

  return (
    // 👇 ADDED: Flex container to hold the Sidebar and the Page Content side-by-side
    <div className="flex h-screen bg-[#05070f]">
      
      {/* 👇 ADDED: The Sidebar Component */}
      <TechSidebar />

      {/* 👇 MODIFIED: Made this a scrollable container that takes up the rest of the screen */}
      <div className="flex-1 overflow-y-auto p-8 text-slate-300">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-6 font-medium">
          <span 
            className="hover:text-slate-300 cursor-pointer transition-colors" 
            onClick={() => navigate('/technical-user')}
          >
            Dashboard
          </span>
          <span className="mx-2">›</span>
          <span className="text-cyan-400">Guided Workflows</span>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Guided Workflows
          </h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Select a training track below. Each workflow provides an isolated, guided environment to master specific offensive security disciplines.
          </p>
        </div>

        {/* Cards Grid - Matches Security Labs Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* 🔴 PENTEST CARD */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors group flex flex-col h-full shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Guided Penetration Testing
                  </h2>
                  <span className="text-xs text-cyan-500 font-medium tracking-wider uppercase">
                    Network Layer
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="px-2.5 py-1 rounded bg-slate-800/50 border border-slate-700 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                  <Target className="w-3 h-3 text-cyan-500" /> 5 Modules
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-grow pr-4">
              Master the methodology of a Red Team operator. Execute network reconnaissance, exploit vulnerable services, and escalate privileges on a target Linux machine.
            </p>

            <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-800/60">
              <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
                <span>Track: <span className="text-slate-300 font-sans font-medium">Offensive</span></span>
                <span>Env: <span className="text-slate-300 font-sans font-medium">Kali Linux</span></span>
              </div>
              <button
                onClick={() => navigate('/technical-user/guided-workflow/pentest/roadmap')}
                className="flex items-center gap-2 bg-transparent hover:bg-cyan-950/40 text-cyan-400 border border-cyan-800/50 hover:border-cyan-500 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                <ChevronRight className="w-4 h-4" /> Start Track
              </button>
            </div>
          </div>

          {/* 🔵 WEBSEC CARD */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors group flex flex-col h-full shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    Guided Web Security
                  </h2>
                  <span className="text-xs text-purple-500 font-medium tracking-wider uppercase">
                    Application Layer
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="px-2.5 py-1 rounded bg-slate-800/50 border border-slate-700 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3 text-purple-500" /> 5 Modules
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-grow pr-4">
              Analyze web application architectures and extract sensitive data. Learn how to identify, exploit, and remediate critical SQL Injection and XSS vulnerabilities.
            </p>

            <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-800/60">
              <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
                <span>Track: <span className="text-slate-300 font-sans font-medium">AppSec</span></span>
                <span>Env: <span className="text-slate-300 font-sans font-medium">Browser</span></span>
              </div>
              <button
                onClick={() => navigate('/technical-user/guided-workflow/websec/roadmap')}
                className="flex items-center gap-2 bg-transparent hover:bg-purple-950/40 text-purple-400 border border-purple-800/50 hover:border-purple-500 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                <ChevronRight className="w-4 h-4" /> Start Track
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}