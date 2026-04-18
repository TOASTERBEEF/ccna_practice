/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CCNA_DOMAINS } from './types';
import AITutor from './components/AITutor';
import LabSimulation from './components/LabSimulation';
import PracticeQuiz from './components/PracticeQuiz';
import NetworkMapper from './components/NetworkMapper';
import LabChallenges from './components/LabChallenges';
import ReadinessTracker from './components/ReadinessTracker';
import { 
  Network, 
  Terminal, 
  BookOpen, 
  MessageSquare, 
  Target, 
  Shield, 
  Settings,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  CheckCircle,
  Menu,
  X,
  Cpu,
  Map as MapIcon,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutor' | 'lab' | 'quiz' | 'topology' | 'challenges' | 'readiness'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedQuizDomain, setSelectedQuizDomain] = useState<string | null>(null);
  
  // Progress tracking state with persistence
  const [readinessScore, setReadinessScore] = useState(() => {
    const saved = localStorage.getItem('ccna-readiness-score');
    return saved ? parseInt(saved) : 0;
  });

  const [exploredDomains, setExploredDomains] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ccna-explored-domains');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [quizzesTaken, setQuizzesTaken] = useState(() => {
    const saved = localStorage.getItem('ccna-quizzes-taken');
    return saved ? parseInt(saved) : 0;
  });

  const [challengesStarted, setChallengesStarted] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ccna-challenges-started');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ccna-readiness-score', readinessScore.toString());
  }, [readinessScore]);

  useEffect(() => {
    localStorage.setItem('ccna-explored-domains', JSON.stringify(Array.from(exploredDomains)));
  }, [exploredDomains]);

  useEffect(() => {
    localStorage.setItem('ccna-quizzes-taken', quizzesTaken.toString());
  }, [quizzesTaken]);

  useEffect(() => {
    localStorage.setItem('ccna-challenges-started', JSON.stringify(Array.from(challengesStarted)));
  }, [challengesStarted]);

  const readinessLabel = 
    readinessScore < 30 ? 'Low' :
    readinessScore < 70 ? 'Medium' : 'High';

  const updateScore = (type: 'domain' | 'quiz' | 'challenge', id?: string) => {
    if (type === 'domain' && id) {
        setSelectedQuizDomain(id);
        setActiveTab('quiz');
    }

    setReadinessScore(prev => {
      let newScore = prev;
      if (type === 'domain' && id && !exploredDomains.has(id)) {
        setExploredDomains(prevSet => {
          const next = new Set(prevSet);
          next.add(id);
          return next;
        });
        newScore += 5;
      } else if (type === 'quiz') {
        setQuizzesTaken(q => q + 1);
        if (quizzesTaken < 10) newScore += 4; // Max 40% from quizzes
      } else if (type === 'challenge' && id && !challengesStarted.has(id)) {
        setChallengesStarted(prevSet => {
          const next = new Set(prevSet);
          next.add(id);
          return next;
        });
        newScore += 10; // 10% per unique challenge
      }
      return Math.min(newScore, 100);
    });
  };

  const NavItem = ({ id, icon: Icon, label }: { id: any; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative",
        activeTab === id 
          ? "bg-cisco-blue text-white shadow-lg shadow-cisco-blue/20" 
          : "text-slate-500 hover:bg-white hover:text-cisco-blue"
      )}
    >
      <Icon size={20} className={cn(activeTab === id ? "text-white" : "group-hover:scale-110 transition-transform")} />
      <span className={cn("font-medium text-sm", !isSidebarOpen && "hidden")}>{label}</span>
      {activeTab === id && (
        <motion.div 
            layoutId="active-pill"
            className="absolute -left-1 w-1 h-6 bg-white rounded-r-full" 
        />
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F7F9FB] technical-grid">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-cisco-blue rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-cisco-blue/30">
              <Network size={24} />
            </div>
            {isSidebarOpen && (
              <div className="whitespace-nowrap">
                <h1 className="font-bold text-slate-900 leading-none">CCNA</h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Mastery Pro</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 px-3 space-y-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="topology" icon={MapIcon} label="Topology Builder" />
          <NavItem id="lab" icon={Terminal} label="Config Lab" />
          <button onClick={() => { setSelectedQuizDomain(null); setActiveTab('quiz'); }} className="w-full text-left">
            <NavItem id="quiz" icon={Target} label="Practice Quiz" />
          </button>
          <NavItem id="challenges" icon={Trophy} label="Lab Challenges" />
          <NavItem id="readiness" icon={TrendingUp} label="Readiness" />
          <NavItem id="tutor" icon={MessageSquare} label="AI Mentor" />
        </div>

        <div className="p-4 border-t border-slate-100">
           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
           >
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="sticky top-0 bg-[#F7F9FB]/80 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
            <p className="text-xs text-slate-500">Welcome back, Engineer. Ready to lab?</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('readiness')}
              className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm hover:border-cisco-blue transition-colors group"
            >
              <TrendingUp size={14} className="text-cisco-green group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-slate-600 uppercase">Preparation Score: {readinessScore}%</span>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full border border-white shadow-sm overflow-hidden">
               <img src="https://picsum.photos/seed/toasterbeef/100/100" alt="Profile" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <BookOpen size={64} />
                    </div>
                     <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Domains</p>
                    <h3 className="text-3xl font-bold text-slate-900">{exploredDomains.size.toString().padStart(2, '0')}</h3>
                    <div className="mt-4 flex gap-1">
                      {CCNA_DOMAINS.map((domain, i) => (
                        <div key={i} title={domain.title} className={cn("h-1 w-full rounded-full transition-colors", exploredDomains.has(domain.id) ? "bg-cisco-blue" : "bg-slate-200")} />
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Terminal size={64} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Labs Completed</p>
                    <h3 className="text-3xl font-bold text-slate-900">{challengesStarted.size.toString().padStart(2, '0')}</h3>
                    <p className="text-xs text-cisco-green mt-2 font-medium">↑ {challengesStarted.size} total</p>
                  </div>
                  <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Shield size={64} />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Exam Readiness</p>
                    <h3 className={cn(
                      "text-3xl font-bold",
                      readinessLabel === 'High' ? "text-cisco-green" : readinessLabel === 'Medium' ? "text-amber-500" : "text-red-500"
                    )}>{readinessLabel}</h3>
                    <p className="text-xs text-slate-500 mt-2">Predicted score: {Math.round(readinessScore * 8.4 + 160)}/1000</p>
                  </div>
                </div>

                {/* Domains List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Exam Domains</h3>
                    <button className="text-xs font-bold text-cisco-blue hover:underline">View Roadmap</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CCNA_DOMAINS.map((domain) => (
                      <div 
                        key={domain.id}
                        onClick={() => updateScore('domain', domain.id)}
                        className="glass-card rounded-2xl p-5 hover:border-cisco-blue/50 hover:shadow-xl hover:shadow-cisco-blue/5 transition-all group cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner", domain.color)}>
                             <Cpu size={20} />
                          </div>
                          <span className="text-xs font-bold text-slate-400">{domain.percentage}% weight</span>
                        </div>
                        <h4 className="font-bold text-slate-800 group-hover:text-cisco-blue transition-colors mb-2">{domain.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{domain.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                           {domain.topics.slice(0, 3).map(topic => (
                             <span key={topic} className="text-[9px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                               {topic}
                             </span>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Start Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                   <div className="bg-cisco-dark rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between h-64">
                       <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                       <div className="z-10">
                          <h3 className="text-2xl font-bold mb-2">Practice CLI Commands</h3>
                          <p className="text-white/60 text-sm max-w-xs mb-6">Master the Cisco IOS in our sandbox environment with real Switch and Router simulations.</p>
                       </div>
                       <button 
                        onClick={() => setActiveTab('lab')}
                        className="z-10 self-start px-6 py-2.5 bg-white text-cisco-dark rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cisco-blue hover:text-white transition-all shadow-lg overflow-hidden relative group"
                       >
                         Launch IOS Sandbox
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-64">
                       <div className="z-10">
                          <h3 className="text-2xl font-bold text-slate-800 mb-2">Ask the AI Mentor</h3>
                          <p className="text-slate-500 text-sm max-w-xs mb-6">Stuck on subnetting? Need OSPF clarified? Your AI CCNP is ready to assist you 24/7.</p>
                       </div>
                       <button 
                        onClick={() => setActiveTab('tutor')}
                        className="z-10 self-start px-6 py-2.5 bg-cisco-blue text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cisco-dark transition-all shadow-lg group"
                       >
                         Open AI Tutor
                         <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                       </button>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'topology' && (
              <motion.div
                key="topology"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Network Topology Builder</h3>
                    <p className="text-sm text-slate-500">Design your network and plan your IP addressing scheme.</p>
                </div>
                <NetworkMapper />
              </motion.div>
            )}

            {activeTab === 'lab' && (
              <motion.div
                key="lab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">IOS Configuration Sandbox</h3>
                    <p className="text-sm text-slate-500">Practice your configuration skills. The state is preserved for this session.</p>
                </div>
                <LabSimulation />
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <PracticeQuiz onComplete={() => updateScore('quiz')} initialDomainId={selectedQuizDomain} />
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto"
              >
                <LabChallenges onChallengeStarted={(id) => updateScore('challenge', id)} />
              </motion.div>
            )}

            {activeTab === 'readiness' && (
              <motion.div
                key="readiness"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto"
              >
                <ReadinessTracker score={readinessScore} onScoreChange={setReadinessScore} />
              </motion.div>
            )}

            {activeTab === 'tutor' && (
              <motion.div
                key="tutor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <AITutor />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
