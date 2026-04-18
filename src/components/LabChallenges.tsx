import React from 'react';
import { Target, CheckCircle2, AlertCircle, Trophy, Network, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { LAB_CHALLENGES } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    easy: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    hard: 'text-red-600 bg-red-50 border-red-200',
  };
  return (
    <span className={cn(
      "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
      colors[difficulty as keyof typeof colors]
    )}>
      {difficulty}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: string }) => {
  if (category === 'topology') return <Network size={16} className="text-cisco-blue" />;
  if (category === 'cli') return <Terminal size={16} className="text-slate-600" />;
  return <Target size={16} className="text-indigo-600" />;
};

export default function LabChallenges({ onChallengeStarted }: { onChallengeStarted?: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Trophy className="text-cisco-blue" />
            Skill Challenges
          </h2>
          <p className="text-slate-500 mt-1">Complete these scenarios to master complex network configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAB_CHALLENGES.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-card rounded-2xl p-6 border border-slate-200 hover:border-cisco-blue hover:shadow-xl transition-all h-full flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-cisco-blue/10 transition-colors">
                <CategoryIcon category={challenge.category} />
              </div>
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{challenge.title}</h3>
            <p className="text-sm text-slate-600 mb-6 flex-grow">{challenge.description}</p>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <Target size={12} />
                Objectives
              </h4>
              <ul className="space-y-2">
                {challenge.tasks.map((task, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {challenge.tips && (
              <div className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <AlertCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                  <span className="font-bold">Pro Tip:</span> {challenge.tips}
                </p>
              </div>
            )}
            
            <button 
              className="mt-6 w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-cisco-blue transition-colors flex items-center justify-center gap-2 group-hover:bg-cisco-blue"
              onClick={() => {
                if (onChallengeStarted) onChallengeStarted(challenge.id);
                window.alert(`Started Challenge: ${challenge.title}. Head over to the ${challenge.category === 'cli' ? 'Lab Simulation' : 'Topology Builder'} to complete it!`);
              }}
            >
              Start Mission
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-cisco-dark rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Want personalized help?</h3>
          <p className="text-white/70 max-w-md">Our AI Tutor is available to guide you through any of these challenges step-by-step.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/user${i}/100/100`}
                className="w-10 h-10 rounded-full border-2 border-cisco-dark ring-2 ring-white/20"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <p className="text-sm font-medium pr-4">500+ students studying now</p>
        </div>
      </div>
    </div>
  );
}
