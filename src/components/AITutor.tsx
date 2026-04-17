import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Move the AI initialization to be lazy or inside the component to prevent top-level crashes
const getAI = () => {
  if (typeof process === 'undefined' || !process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const SYSTEM_PROMPT = `You are a world-class Cisco Certified Network Professional (CCNP) and CCNA Instructor.
Your goal is to help the user prepare for their CCNA exam.
- Be technical but clear.
- Use analogies when appropriate.
- If the user asks about a command, provide the exact syntax and explain the parameters.
- Provide practical examples.
- Encourage best practices (e.g., using "no shutdown", proper VLAN tagging, security first).
- You can explain topics like: Network Fundamentals, Network Access, IP Connectivity (OSPF, static routing), IP Services (NAT, DHCP), Security Fundamentals (ACLs), and Automation/Programmability.
Keep responses concise but thorough. Use markdown for better readability.`;

export default function AITutor() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const aiRef = useRef<GoogleGenAI | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!aiRef.current) {
        aiRef.current = getAI();
    }
    
    if (!aiRef.current) {
        setMessages(prev => [...prev, { role: 'model', text: "AI initialization failed. Please check if the API key is configured." }]);
        return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const responseText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Service unavailable. Please check your network or try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-2xl overflow-hidden border border-slate-200">
      <div className="bg-cisco-dark p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">CCNA AI Tutor</h3>
            <p className="text-[10px] opacity-70">Expert Cisco Instruction</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-full text-[10px] font-medium">
          <Sparkles size={12} />
          AI Powered
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-cisco-blue/10 rounded-full flex items-center justify-center text-cisco-blue">
                <Bot size={32} />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800">Ready to study?</h4>
                <p className="text-sm text-slate-500">Ask me anything about CCNA topics, from subnetting to OSPF configuration.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                {["Explain VLAN trunks", "How does OSPF work?", "Calculate this subnet mask"].map((suggestion) => (
                    <button 
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="text-xs p-2 rounded-lg bg-white border border-slate-200 hover:border-cisco-blue hover:text-cisco-blue transition-colors text-left"
                    >
                        "{suggestion}"
                    </button>
                ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-cisco-blue text-white" : "bg-white border border-slate-200 text-cisco-dark"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-cisco-blue text-white rounded-tr-none" : "bg-white border border-slate-200 shadow-sm rounded-tl-none text-slate-700"
            )}>
              <div className={cn(
                  "prose prose-sm max-w-none",
                  msg.role === 'user' ? "prose-invert" : "prose-slate"
              )}>
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-cisco-dark flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <Loader2 className="animate-spin text-cisco-blue" size={20} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a CCNA question..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cisco-blue transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-cisco-blue text-white p-2 rounded-xl hover:bg-cisco-dark disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
