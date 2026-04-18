import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Activity, 
  ChevronRight, 
  AlertCircle,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReadinessTrackerProps {
  score: number;
  onScoreChange: (newScore: number) => void;
}

export default function ReadinessTracker({ score, onScoreChange }: ReadinessTrackerProps) {
  const [activeDomain, setActiveDomain] = useState<number | null>(null);

  const skills = [
    { title: "IP Subnetting", level: 85, color: "bg-blue-500" },
    { title: "OSPF Configuration", level: 60, color: "bg-indigo-500" },
    { title: "VLAN & Trunking", level: 90, color: "bg-cyan-500" },
    { title: "Network Security", level: 45, color: "bg-red-500" },
    { title: "Automation Basics", level: 30, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Score Card */}
        <div className="flex-1 glass-card rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cisco-blue/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Exam Readiness</h3>
                <p className="text-xs text-slate-500 mt-1">Based on self-assessment and simulated performance.</p>
              </div>
              <div className="bg-cisco-blue/10 p-3 rounded-2xl text-cisco-blue">
                <BarChart3 size={24} />
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-7xl font-black text-slate-900 leading-none">{score}%</span>
              <div className="mb-2">
                <div className="flex items-center gap-1 text-cisco-green font-bold text-sm">
                  <TrendingUp size={16} />
                  <span>+4% this week</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>MANUAL OVERRIDE / CALIBRATION</span>
                <span>{score}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={score} 
                onChange={(e) => onScoreChange(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-cisco-blue hover:accent-cisco-dark transition-all"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                 <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">How to earn points:</h5>
                    <ul className="text-[10px] text-slate-500 space-y-1">
                       <li>• Explore a Domain: +5%</li>
                       <li>• Finish a Quiz: +4%</li>
                       <li>• Start a Lab Challenge: +10%</li>
                    </ul>
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium italic">Your score automatically increases as you interact with the platform, or you can use the slider above to set it manually.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="w-full md:w-80 space-y-4">
           <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                 <ShieldCheck size={20} className="text-cisco-green" />
              </div>
              <div>
                 <p className="text-[10px] font-bold opacity-50 uppercase">Security Status</p>
                 <p className="text-sm font-bold">Hardened</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
              <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                 <Clock size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Study Time</p>
                 <p className="text-sm font-bold text-slate-800">42 Hours</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
              <div className="bg-slate-100 p-3 rounded-xl text-cisco-blue">
                 <Activity size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Quiz Score</p>
                 <p className="text-sm font-bold text-slate-800">78%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-cisco-blue" />
            Core Competencies
          </h4>
          <div className="space-y-5">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span className="uppercase">{skill.title}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    className={cn("h-full rounded-full transition-all duration-1000", skill.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            Improvement Areas
          </h4>
          <div className="space-y-3">
             {[
               "Automation & Programmability (DNA Center queries)",
               "IPv6 Routing Patterns (Multicast/Link-Local)",
               "Advanced Access Lists (ACL 100-199 range)"
             ].map((text, i) => (
               <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-cisco-blue transition-all cursor-pointer shadow-sm">
                  <span className="text-sm text-slate-600 font-medium">{text}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-cisco-blue transition-all group-hover:translate-x-1" />
               </div>
             ))}
          </div>
          
          <div className="bg-indigo-600 rounded-3xl p-6 text-white text-center">
             <h5 className="font-bold mb-2">Ready for a Full Simulation?</h5>
             <p className="text-xs text-white/70 mb-4">Take a 100-question mock exam to truly test your readiness.</p>
             <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors shadow-lg">
                Start Exam Simulation
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
