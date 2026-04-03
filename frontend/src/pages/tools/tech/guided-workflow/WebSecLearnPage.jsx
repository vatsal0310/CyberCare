// Save this at: frontend/src/pages/WebSecLearnPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Loader2, Play, Square, Activity, Briefcase } from 'lucide-react';
import { api } from '../../../../services/api';
import MethodologyPanel from '../../../../components/tech/guided-workflow/shared/MethodologyPanel';
import SimulatedBrowser from '../../../../components/tech/guided-workflow/workflows/websec/SimulatedBrowser'; 
import LootBoard from '../../../../components/tech/guided-workflow/shared/LootBoard';
import ThreatIntelWidget from '../../../../components/tech/guided-workflow/shared/ThreatIntelWidget';
import ReportBuilder from "../../../../components/tech/guided-workflow/workflows/websec/ReportBuilder";

// 🌐 MASTER LOOT DICTIONARY (Web Security Specific)
const LOOT_DICTIONARY = {
  'task_ws_recon_2': { 
    id: 'task_ws_recon_2', 
    type: 'credential', 
    title: 'Developer API Key', 
    value: 'ak_99x81m', 
    description: 'Found hardcoded in the HTML source code comments of the login page.' 
  },
  'task_ws_enum_2':  { 
    id: 'task_ws_enum_2', 
    type: 'file', 
    title: 'master_users.csv', 
    value: "id,username,role,password_hash,plaintext_fallback\n1,admin,Administrator,7c4a8d09ca3762af61e59520943dc26494f8941b,AdminP@ssw0rd!\n2,dave,Doctor,5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8,dave_secure99\n3,sarah,Nurse,9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684,nurse_sarah_123", 
    description: 'Complete user database extracted via SQL Injection on the Admin Login portal.' 
  }
};

const WebSecLearnPage = () => {
  const { moduleId } = useParams();
  const navigate     = useNavigate();

  const [moduleData,     setModuleData]     = useState(null);
  const [nextModule,     setNextModule]     = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [activeStep,     setActiveStep]     = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [vmStatus,       setVmStatus]       = useState('offline'); 

  const [isLootBoardOpen, setIsLootBoardOpen] = useState(false);
  const [isThreatIntelOpen, setIsThreatIntelOpen] = useState(false);
  const [unlockedLoot, setUnlockedLoot] = useState([]);

  useEffect(() => {
    const savedLoot = JSON.parse(sessionStorage.getItem('cybercare_websec_loot') || '[]');
    setUnlockedLoot(savedLoot);
  }, []);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/guided-workflow/paths');
        const paths = response.data;
        let foundModule = null, foundNext = null;

        for (const path of paths) {
          const modIndex = path.modules.findIndex(m => m.id === moduleId);
          if (modIndex !== -1) {
            foundModule = path.modules[modIndex];
            foundNext   = path.modules[modIndex + 1] || null;
            break;
          }
        }
        setModuleData(foundModule);
        setNextModule(foundNext);
        setCompletedSteps([]);
        setActiveStep(1);
        setVmStatus('offline');
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleData();
  }, [moduleId]);

  useEffect(() => {
    if (moduleData && completedSteps.length === moduleData.tasks.length && moduleData.tasks.length > 0) {
      const savedProgress = JSON.parse(sessionStorage.getItem('cybercare_websec_progress') || '[]');
      if (!savedProgress.includes(moduleData.id)) {
        sessionStorage.setItem('cybercare_websec_progress', JSON.stringify([...savedProgress, moduleData.id]));
      }
    }
  }, [completedSteps, moduleData]);

  // 🎯 Cleaned up handleTaskScored (No more points!)
  const handleTaskScored = (taskId) => {
    if (LOOT_DICTIONARY[taskId]) {
      setUnlockedLoot(prev => {
        if (prev.some(item => item.id === taskId)) return prev;
        
        const newLoot = [...prev, LOOT_DICTIONARY[taskId]];
        sessionStorage.setItem('cybercare_websec_loot', JSON.stringify(newLoot));
        
        setTimeout(() => setIsLootBoardOpen(true), 800); 
        
        return newLoot;
      });
    }
  };

  if (loading)        return <div className="text-cyan-500 flex items-center gap-3 justify-center min-h-[50vh] font-mono bg-slate-950 h-screen w-full"><Loader2 className="animate-spin" /> INITIALIZING RANGE...</div>;
  if (!moduleData)    return <div className="text-red-500 p-8 bg-slate-950 h-screen w-full">Workflow data corrupted.</div>;

  const requiresVM = moduleData && !['Vulnerability Analysis', 'Reporting'].includes(moduleData.title);
  const isReporting = moduleData && moduleData.title === 'Reporting';
  const isSplit = (requiresVM && vmStatus !== 'offline') || isReporting;

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-300 flex flex-col overflow-hidden relative">

      <header className="h-20 border-b border-slate-800 bg-slate-950 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/technical-user/guided-workflow')} className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
            <ChevronLeft className="w-6 h-6 text-slate-500 group-hover:text-cyan-400" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-0.5">
              <Target className="w-3 h-3 text-purple-500" /> Web Security Mission
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{moduleData.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {requiresVM && (
            <div className="h-10 px-4 flex items-center gap-4 bg-slate-900 rounded-lg border border-slate-800 shadow-inner">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  vmStatus === 'online'  ? 'bg-emerald-500 animate-pulse'
                : vmStatus === 'booting' ? 'bg-amber-500 animate-bounce'
                :                          'bg-slate-700'
                }`} />
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Browser: {vmStatus}</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              {vmStatus === 'offline' ? (
                <button
                  onClick={() => setVmStatus('online')}
                  className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  <Play className="w-3 h-3 fill-current" /> Open Tools
                </button>
              ) : (
                <button
                  onClick={() => setVmStatus('offline')}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  <Square className="w-3 h-3 fill-current" /> Close Tools
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className={`h-full transition-all duration-500 ease-in-out ${isSplit ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'w-full block'}`}>
          <div className="h-full overflow-hidden w-full">
            <MethodologyPanel
              moduleData={moduleData}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              completedSteps={completedSteps}
              setCompletedSteps={setCompletedSteps}
              vmStatus={vmStatus}
              requiresVM={requiresVM}
              nextModule={nextModule}
              onNextModule={() => navigate(`/websec/module/${nextModule.id}`)}
              onReturnHome={() => navigate('/mission-complete')}
              onTaskScored={handleTaskScored}
            />
          </div>
          {isSplit && (
            <div className="h-full animate-in slide-in-from-right-full duration-500 ease-out">
              {isReporting ? (
                <ReportBuilder />
              ) : (
                <SimulatedBrowser targetUrl="portal.cybercare-health.local" />
              )}
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={() => setIsThreatIntelOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white p-4 rounded-full shadow-lg transition-all group"
        title="Threat Intelligence Database"
      >
        <Activity className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
      </button>

      <button 
        onClick={() => setIsLootBoardOpen(true)}
        className="fixed bottom-8 right-6 z-40 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white p-4 rounded-full shadow-lg transition-all group"
        title="Evidence Locker"
      >
        <div className="relative">
          <Briefcase className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          {unlockedLoot.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
              {unlockedLoot.length}
            </span>
          )}
        </div>
      </button>

      <ThreatIntelWidget 
        isOpen={isThreatIntelOpen} 
        setIsOpen={setIsThreatIntelOpen} 
      />

      <LootBoard 
        isOpen={isLootBoardOpen} 
        setIsOpen={setIsLootBoardOpen} 
        lootData={unlockedLoot} 
      />

    </div>
  );
};

export default WebSecLearnPage;