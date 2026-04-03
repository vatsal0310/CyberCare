import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Activity, Clock, Target, CheckCircle2, RotateCcw, Home, Lock, Trophy } from 'lucide-react';
import { api } from "../../../../services/api";

// 👇 ADDED: Import your Sidebar
import TechSidebar from '../../../../components/tech/TechSidebar';

const RoadmapView = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which track we are viewing based on the URL
  const isWebSec = location.pathname.includes('/websec');
  const activePathId = isWebSec ? 'path_ws_02' : 'path_pt_01';
  const urlPrefix = isWebSec ? '/technical-user/guided-workflow/websec' : '/technical-user/guided-workflow/pentest';

  // Dynamic storage keys so WebSec and Pentest don't overwrite each other!
  const progressKey = isWebSec ? 'cybercare_websec_progress' : 'cybercare_pentest_progress';
  const scoresKey   = isWebSec ? 'cybercare_websec_scores'   : 'cybercare_pentest_scores';
  const lootKey     = isWebSec ? 'cybercare_websec_loot'     : 'cybercare_pentest_loot';

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await api.get('/guided-workflow/paths');
        setPaths(response.data);
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaths();

    // Pull BOTH the new isolated progress and the old ghost progress
    const savedProgress = JSON.parse(sessionStorage.getItem(progressKey) || '[]');
    const ghostProgress = JSON.parse(sessionStorage.getItem('cybercare_progress') || '[]');
    
    // Merge them together so the UI knows you have stuff to reset!
    const mergedProgress = Array.from(new Set([...savedProgress, ...ghostProgress]));
    setCompletedModules(mergedProgress);
  }, [progressKey]);

  const handleReset = () => {
    sessionStorage.removeItem(progressKey);
    sessionStorage.removeItem(scoresKey);
    sessionStorage.removeItem(lootKey);
    sessionStorage.removeItem('cybercare_progress');
    sessionStorage.removeItem('cybercare_scores');
    sessionStorage.removeItem('cybercare_loot');
    
    setCompletedModules([]);
    setShowResetConfirm(false);
    window.location.reload();
  };

  const hasAnyProgress = completedModules.length > 0;

  if (loading) {
    return (
      <div className="flex h-screen bg-[#05070f]">
        <TechSidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-cyan-500 animate-pulse">
          <Activity className="w-8 h-8 mb-4 animate-spin" />
          <p className="text-xs tracking-widest uppercase font-semibold">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  const displayPaths = paths.filter(p => p.id === activePathId);

  return (
    // 👇 ADDED: The main layout wrapper to hold the Sidebar and content
    <div className="flex h-screen bg-[#05070f]">
      
      {/* 👇 ADDED: The Sidebar */}
      <TechSidebar />

      {/* 👇 ADDED: The scrollable container for the rest of the page */}
      <div className="flex-1 overflow-y-auto w-full">
        
        {/* We keep the max-w-4xl so your roadmap stays nicely centered and doesn't stretch too wide */}
        <div className="max-w-4xl mx-auto px-6 pb-24 text-slate-300 pt-8">
          
          <button 
            onClick={() => navigate('/technical-user/guided-workflow')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-400 mb-8 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Guided Workflows
          </button>

          {displayPaths.map((path) => {
            const totalModules       = path.modules.length;
            const completedInPath    = path.modules.filter(m => completedModules.includes(m.id)).length;
            const progressPercentage = totalModules === 0 ? 0 : Math.round((completedInPath / totalModules) * 100);

            return (
              <div key={path.id} className="mb-12 relative z-10">

                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Target className="w-3 h-3" /> Active Campaign
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {path.title}
                    </h2>

                    <div className="shrink-0 mt-1">
                      {showResetConfirm ? (
                        <div className="flex items-center gap-2 bg-slate-900 border border-red-500/30 rounded-xl px-4 py-2 animate-in fade-in duration-200">
                          <span className="text-xs text-slate-400">Reset all progress?</span>
                          <button
                            onClick={handleReset}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                          >
                            Yes, Reset
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowResetConfirm(true)}
                          disabled={!hasAnyProgress}
                          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                            hasAnyProgress 
                              ? 'text-slate-300 hover:text-red-400 bg-slate-900 border border-slate-700 hover:border-red-500/40 shadow-sm cursor-pointer' 
                              : 'text-slate-500 bg-slate-900/40 border border-slate-800/50 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reset Campaign
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm max-w-xl mb-6 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="flex gap-3 mb-8">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
                      <Activity className="w-3.5 h-3.5 text-cyan-500" /> {path.difficulty}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" /> {path.estimated_time}
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400 uppercase tracking-wider">Campaign Progress</span>
                      <span className="text-cyan-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    {/* Certificate Banner */}
                    {progressPercentage === 100 && (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-emerald-900/20 border border-emerald-500/30 p-5 rounded-xl animate-in fade-in zoom-in duration-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <div className="mb-4 sm:mb-0 text-center sm:text-left">
                          <h4 className="text-emerald-400 font-bold text-sm mb-1 flex items-center justify-center sm:justify-start gap-2 tracking-tight">
                            <CheckCircle2 className="w-4 h-4" /> CAMPAIGN COMPLETED
                          </h4>
                          <p className="text-slate-400 text-xs font-medium">All methodology phases executed successfully.</p>
                        </div>
                        <button
                          onClick={() => navigate('/technical-user/guided-workflow/mission-complete')}
                          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                        >
                          <Trophy className="w-4 h-4" /> View Final Badge
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                <div className="space-y-4">
                  {path.modules.map((module, index) => {
                    const isCompleted = completedModules.includes(module.id);
                    const isLocked = index > 0 && !completedModules.includes(path.modules[index - 1].id);

                    return (
                      <div
                        key={module.id}
                        onClick={() => !isLocked && navigate(`${urlPrefix}/module/${module.id}`)}
                        className={`group ${
                          isCompleted ? 'bg-cyan-950/20 border-cyan-900/40' 
                          : isLocked ? 'bg-slate-900/30 border-slate-800/50 cursor-not-allowed' 
                          : 'bg-slate-900/40 border-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-900/80 cursor-pointer'
                        } border rounded-2xl p-5 transition-all flex items-center justify-between shadow-sm relative overflow-hidden`}
                      >
                        {isCompleted && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />}
                        
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all shrink-0 shadow-inner ${
                            isCompleted ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50' 
                            : isLocked ? 'bg-slate-900 border border-slate-800 text-slate-500' 
                            : 'bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : index + 1}
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold mb-0.5 transition-colors ${
                              isCompleted ? 'text-white' : isLocked ? 'text-slate-400' : 'text-slate-200 group-hover:text-white' 
                            }`}>
                              {module.title}
                            </h3>
                            <p className={`text-xs font-medium ${isLocked ? 'text-slate-500' : 'text-slate-500'}`}> 
                              {isLocked ? 'Complete previous phase to unlock' : `${module.tasks?.length || 0} Interactive Tasks`}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 border ${
                          isCompleted ? 'bg-cyan-900/30 border-cyan-800/50 group-hover:bg-cyan-600' 
                          : isLocked ? 'bg-transparent border-transparent'
                          : 'bg-slate-950 border-slate-800 group-hover:border-cyan-500 group-hover:bg-cyan-600'
                        }`}>
                          {!isLocked && <ChevronRight className={`w-5 h-5 transition-colors ${isCompleted ? 'text-cyan-400 group-hover:text-white' : 'text-slate-500 group-hover:text-white'}`} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;