import { useState, useMemo, useEffect } from 'react';
import { PRACTICE_QUESTIONS, Question, Difficulty, CCNA_DOMAINS } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  HelpCircle, 
  Settings2, 
  Trophy,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PracticeQuizProps {
  onComplete?: () => void;
  initialDomainId?: string | null;
}

export default function PracticeQuiz({ onComplete, initialDomainId }: PracticeQuizProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string | 'all'>('all');
  const [questionLimit, setQuestionLimit] = useState(5);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Auto-start if initialDomainId is provided and hasn't started yet
  useEffect(() => {
    if (initialDomainId) {
      setSelectedDomain(initialDomainId);
      // Auto-start the quiz if we just came from a domain click
      if (!isStarted && !isFinished) {
          // We wait a tiny bit for the state to settle
          const timer = setTimeout(() => {
            startQuizWithParams(initialDomainId, difficulty, questionLimit);
          }, 100);
          return () => clearTimeout(timer);
      }
    }
  }, [initialDomainId]);

  const startQuizWithParams = (domain: string, diff: string, limit: number) => {
    let filtered = [...PRACTICE_QUESTIONS];
    if (diff !== 'all') {
      filtered = filtered.filter(q => q.difficulty === diff);
    }
    if (domain !== 'all') {
      filtered = filtered.filter(q => q.domainId === domain);
    }
    
    if (filtered.length === 0) {
        window.alert("No questions found for this specific combination. Resetting filters.");
        return;
    }

    // Shuffle and limit
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, Math.min(limit, shuffled.length));
    
    setQuizQuestions(limited);
    setIsStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setShowResult(false);
    setSelectedOption(null);
  };

  const startQuiz = () => {
    startQuizWithParams(selectedDomain, difficulty, questionLimit);
  };

  const currentQuestion = quizQuestions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  const resetQuiz = () => {
    setIsStarted(false);
    setIsFinished(false);
    setQuizQuestions([]);
  };

  if (!isStarted) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-cisco-blue/10 rounded-xl flex items-center justify-center text-cisco-blue">
                <Settings2 size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Quiz Configuration</h2>
                <p className="text-sm text-slate-500">Customize your practice session</p>
            </div>
        </div>

        <div className="space-y-8">
            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={14} />
                    Select Domain Focus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        onClick={() => setSelectedDomain('all')}
                        className={cn(
                            "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between",
                            selectedDomain === 'all' 
                                ? "bg-cisco-blue/5 border-cisco-blue text-cisco-blue" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        )}
                    >
                        Comprehensive (All Domains)
                        {selectedDomain === 'all' && <div className="w-2 h-2 bg-cisco-blue rounded-full" />}
                    </button>
                    {CCNA_DOMAINS.map(domain => (
                        <button
                            key={domain.id}
                            onClick={() => setSelectedDomain(domain.id)}
                            className={cn(
                                "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between",
                                selectedDomain === domain.id 
                                    ? "bg-cisco-blue/5 border-cisco-blue text-cisco-blue" 
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            )}
                        >
                            <span className="truncate pr-2">{domain.title}</span>
                            {selectedDomain === domain.id && <div className="w-2 h-2 bg-cisco-blue rounded-full shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={14} />
                    Select Difficulty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['all', 'easy', 'medium', 'hard'].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d as any)}
                            className={cn(
                                "py-3 rounded-xl border text-sm font-medium transition-all capitalize",
                                difficulty === d 
                                    ? "bg-cisco-blue border-cisco-blue text-white shadow-md shadow-cisco-blue/20" 
                                    : "bg-white border-slate-200 text-slate-600 hover:border-cisco-blue/30"
                            )}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle size={14} />
                    Number of Questions
                </label>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="5" 
                        max="20"
                        value={questionLimit}
                        onChange={(e) => setQuestionLimit(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cisco-blue"
                    />
                    <span className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700 border border-slate-200">
                        {questionLimit}
                    </span>
                </div>
            </div>

            <button
                onClick={startQuiz}
                className="w-full py-4 bg-cisco-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cisco-dark transition-all transform hover:-translate-y-0.5 shadow-xl shadow-cisco-blue/20"
            >
                Start Practice Session
                <ChevronRight size={20} />
            </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="glass-card rounded-2xl p-8 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-cisco-green"
            />
        </div>
        
        <div className="space-y-4">
            <div className="w-24 h-24 bg-cisco-green/10 text-cisco-green rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trophy size={48} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-800">Review Result</h2>
                <p className="text-slate-500 font-medium">Domain Mastery Session</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Score</p>
                <p className="text-2xl font-bold text-slate-800">{score}/{quizQuestions.length}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Percentage</p>
                <p className="text-2xl font-bold text-slate-800">{percentage}%</p>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
                onClick={resetQuiz}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-cisco-blue text-white rounded-2xl font-bold hover:bg-cisco-dark transition-all"
            >
                <RotateCcw size={18} />
                New Practice Session
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cisco-blue/10 rounded-xl flex items-center justify-center text-cisco-blue">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">CCNA Exam Prep</h3>
            <span className="text-[10px] font-bold text-cisco-blue uppercase tracking-widest">{difficulty} mode</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-cisco-blue transition-all duration-300" 
                    style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                />
            </div>
            <span className="text-xs font-bold text-slate-600">{currentIndex + 1}/{quizQuestions.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-bold text-slate-800 leading-snug">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              disabled={showResult}
              className={cn(
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden",
                selectedOption === i 
                  ? showResult 
                    ? i === currentQuestion.correctAnswer 
                      ? 'bg-cisco-green/5 border-cisco-green text-cisco-green' 
                      : 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-cisco-blue/5 border-cisco-blue text-cisco-blue'
                  : showResult && i === currentQuestion.correctAnswer
                    ? 'bg-cisco-green/5 border-cisco-green text-cisco-green'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
              )}
            >
              <div className="flex items-center gap-4 z-10">
                <div className={cn(
                    "w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                    selectedOption === i 
                        ? "border-current" 
                        : "border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500"
                )}>
                    {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium text-sm sm:text-base">{option}</span>
              </div>
              
              <div className="z-10">
                {showResult && i === currentQuestion.correctAnswer && <CheckCircle2 size={24} className="text-cisco-green" />}
                {showResult && selectedOption === i && i !== currentQuestion.correctAnswer && <XCircle size={24} className="text-red-500" />}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-cisco-blue rounded-full" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rational & Explanation</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-6 flex justify-end">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-10 py-4 bg-cisco-blue text-white rounded-2xl font-bold hover:bg-cisco-dark disabled:opacity-50 transition-all shadow-lg shadow-cisco-blue/20"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
            >
              {currentIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
