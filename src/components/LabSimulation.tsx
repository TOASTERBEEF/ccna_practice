import { useState, useRef, useEffect } from 'react';
import { Terminal, RefreshCcw, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface LabState {
  hostname: string;
  mode: 'user' | 'privileged' | 'config' | 'config-if';
  interfaces: { [key: string]: { status: string; description: string; vlan: number } };
  config: string[];
}

export default function LabSimulation() {
  const [history, setHistory] = useState<string[]>(["Cisco IOS Software, Catalyst L3 Switch Software (CAT3K_CAA-UNIVERSALK9-M), Version 16.6.4, RELEASE SOFTWARE (fc1)"]);
  const [input, setInput] = useState('');
  const [state, setState] = useState<LabState>({
    hostname: 'Switch',
    mode: 'user',
    interfaces: {
      'Gig0/1': { status: 'down', description: '', vlan: 1 },
      'Gig0/2': { status: 'down', description: '', vlan: 1 },
    },
    config: []
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const getPrompt = () => {
    switch (state.mode) {
      case 'user': return `${state.hostname}>`;
      case 'privileged': return `${state.hostname}#`;
      case 'config': return `${state.hostname}(config)#`;
      case 'config-if': return `${state.hostname}(config-if)#`;
      default: return `${state.hostname}>`;
    }
  };

  const processCommand = (cmd: string) => {
    const fullCmd = `${getPrompt()} ${cmd}`;
    let output = '';
    const parts = cmd.toLowerCase().trim().split(' ');
    const base = parts[0];

    if (base === 'enable' || base === 'en') {
      setState(s => ({ ...s, mode: 'privileged' }));
    } else if (base === 'disable') {
      setState(s => ({ ...s, mode: 'user' }));
    } else if ((base === 'configure' && parts[1] === 'terminal') || base === 'conf' || base === 'config' || (base === 'conf' && parts[1] === 't')) {
      if (state.mode === 'privileged') {
        setState(s => ({ ...s, mode: 'config' }));
        output = 'Enter configuration commands, one per line. End with CNTL/Z.';
      } else {
        output = '% Invalid input detected at \'^\' marker.';
      }
    } else if (base === 'hostname' && state.mode === 'config') {
      const newName = cmd.split(' ')[1] || 'Switch';
      setState(s => ({ ...s, hostname: newName }));
    } else if (base === 'interface' || base === 'int') {
      if (state.mode === 'config') {
        const intName = parts[1] || 'Gig0/1';
        setState(s => ({ ...s, mode: 'config-if' }));
        // Ensure interface exists in state
        if (!state.interfaces[intName]) {
            setState(s => ({
                ...s,
                interfaces: { ...s.interfaces, [intName]: { status: 'down', description: '', vlan: 1 } }
            }));
        }
      } else {
        output = '% Invalid command for this mode.';
      }
    } else if ((base === 'shutdown' || base === 'shut') && state.mode === 'config-if') {
        output = '%% Line protocol on Interface, changed state to down';
    } else if (base === 'no' && parts[1] === 'shutdown' && state.mode === 'config-if') {
        output = '%% Line protocol on Interface, changed state to up';
    } else if (base === 'ip' && parts[1] === 'address' && state.mode === 'config-if') {
        output = `IP address ${parts[2]} configured with mask ${parts[3]}`;
    } else if (base === 'vlan' && state.mode === 'config') {
        output = `VLAN ${parts[1]} created.`;
    } else if (base === 'exit') {
      if (state.mode === 'config-if') setState(s => ({ ...s, mode: 'config' }));
      else if (state.mode === 'config') setState(s => ({ ...s, mode: 'privileged' }));
      else if (state.mode === 'privileged') setState(s => ({ ...s, mode: 'user' }));
    } else if (base === 'show' || base === 'sh') {
      const target = parts[1];
      if (target === 'ip' && parts[2] === 'int' && parts[3] === 'brief') {
        output = 'Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/1     unassigned      YES unset  up                    up\nGigabitEthernet0/2     unassigned      YES unset  down                  down';
      } else if (target === 'vlan') {
        output = 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1, Gi0/2\n10   GUESTS                           active    \n20   VOICE                            active    ';
      } else if (target === 'run' || target === 'running-config') {
          output = `Building configuration...\n\nCurrent configuration : 124 bytes\n!\nversion 16.6\nhostname ${state.hostname}\n!\ninterface GigabitEthernet0/1\n!\nend`;
      }
    } else if (base === '?' || base === 'help') {
        output = 'Available: enable, disable, configure terminal, hostname, show ip int brief, show vlan, interface, ip address, shutdown, no shutdown, exit, clear';
    } else if (base === 'clear') {
        setHistory([]);
        return;
    } else if (base === '') {
        // Just new prompt
    } else {
      output = `% Ambiguous command:  "${cmd}"`;
    }

    setHistory(prev => [...prev, fullCmd, ...(output ? [output] : [])]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl font-mono text-sm border-4 border-slate-700">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Cisco IOS SwitchConsole</span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setHistory([])}
                className="text-slate-400 hover:text-white transition-colors"
                title="Clear screen"
            >
                <RefreshCcw size={14} />
            </button>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-green-500 whitespace-pre-wrap selection:bg-green-500/30">
        <div className="mb-4 text-white/50 border-b border-white/10 pb-2">
            <Info size={12} className="inline mr-2" />
            <span className="text-[10px]">PRACTICE: Try commands like 'en', 'conf t', 'hostname CCNA-Switch', 'sh ip int brief'</span>
        </div>
        {history.map((line, i) => (
          <div key={i} className="mb-0.5">{line}</div>
        ))}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-white font-bold">{getPrompt()}</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 caret-white"
          />
        </div>
      </div>
      
      <div className="bg-slate-900 px-4 py-1 text-[10px] text-slate-500 flex justify-between">
        <span>Connected to console: COM1</span>
        <span>9600 8N1</span>
      </div>
    </div>
  );
}
