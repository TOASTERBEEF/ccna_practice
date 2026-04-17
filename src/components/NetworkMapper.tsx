import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group, Arrow } from 'react-konva';
import { 
  Plus, 
  Trash2, 
  Share2, 
  MousePointer2, 
  Link2, 
  Router as RouterIcon, 
  Monitor, 
  Database,
  Info,
  Save,
  Undo
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DeviceType = 'router' | 'switch' | 'pc';

interface NetworkNode {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  name: string;
  ip?: string;
}

interface NetworkLink {
  id: string;
  fromId: string;
  toId: string;
}

export default function NetworkMapper() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'select' | 'connect' | 'add-router' | 'add-switch' | 'add-pc'>('select');
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [packetAnimation, setPacketAnimation] = useState<{ x: number, y: number, active: boolean }>({ x: 0, y: 0, active: false });

  const stageRef = useRef<any>(null);

  const simulatePing = () => {
    if (links.length === 0) return;
    const link = links[0]; // Just simulate the first link for demo
    const from = nodes.find(n => n.id === link.fromId);
    const to = nodes.find(n => n.id === link.toId);
    if (!from || !to) return;

    setPacketAnimation({ x: from.x, y: from.y, active: true });
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.02;
        if (progress >= 1) {
            clearInterval(interval);
            setTimeout(() => setPacketAnimation(prev => ({ ...prev, active: false })), 500);
        } else {
            setPacketAnimation({
                x: from.x + (to.x - from.x) * progress,
                y: from.y + (to.y - from.y) * progress,
                active: true
            });
        }
    }, 20);
  };

  const addNode = (type: DeviceType, x: number, y: number) => {
    const newNode: NetworkNode = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      name: `${type.charAt(0).toUpperCase()}${type.slice(1)} ${nodes.filter(n => n.type === type).length + 1}`,
      ip: type === 'router' ? '192.168.1.1' : undefined
    };
    setNodes([...nodes, newNode]);
    setMode('select');
  };

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (mode === 'add-router') addNode('router', pos.x, pos.y);
    else if (mode === 'add-switch') addNode('switch', pos.x, pos.y);
    else if (mode === 'add-pc') addNode('pc', pos.x, pos.y);

    if (e.target === stage) {
      setSelectedId(null);
      setConnectingFrom(null);
    }
  };

  const handleNodeClick = (id: string) => {
    if (mode === 'connect') {
      if (!connectingFrom) {
        setConnectingFrom(id);
      } else if (connectingFrom !== id) {
        // Prevent duplicate links
        const exists = links.find(l => 
          (l.fromId === connectingFrom && l.toId === id) || 
          (l.fromId === id && l.toId === connectingFrom)
        );
        if (!exists) {
          setLinks([...links, { id: `link-${Date.now()}`, fromId: connectingFrom, toId: id }]);
        }
        setConnectingFrom(null);
      }
    } else {
      setSelectedId(id);
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setNodes(nodes.filter(n => n.id !== selectedId));
    setLinks(links.filter(l => l.fromId !== selectedId && l.toId !== selectedId));
    setSelectedId(null);
  };

  const updateNodePos = (id: string, x: number, y: number) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const renderIcon = (type: DeviceType) => {
    switch (type) {
      case 'router':
        return (
          <Group>
            <Circle radius={25} fill="#00BCEB" stroke="#017AAD" strokeWidth={2} />
            {/* Simple Cisco Router arrows */}
            <Line points={[-15, 0, 15, 0]} stroke="white" strokeWidth={2} />
            <Line points={[0, -15, 0, 15]} stroke="white" strokeWidth={2} />
            <Arrow points={[-10, -10, -5, -5]} pointerLength={5} pointerWidth={5} fill="white" stroke="white" />
            <Arrow points={[10, 10, 5, 5]} pointerLength={5} pointerWidth={5} fill="white" stroke="white" />
          </Group>
        );
      case 'switch':
        return (
          <Group>
            <Rect width={50} height={30} x={-25} y={-15} fill="#63B521" stroke="#4a8a18" strokeWidth={2} cornerRadius={4} />
            <Line points={[-15, -5, 15, -5]} stroke="white" strokeWidth={1.5} />
            <Line points={[-15, 5, 15, 5]} stroke="white" strokeWidth={1.5} />
            <Arrow points={[-18, -5, -22, -5]} pointerLength={4} pointerWidth={4} fill="white" stroke="white" />
            <Arrow points={[18, -5, 22, -5]} pointerLength={4} pointerWidth={4} fill="white" stroke="white" />
          </Group>
        );
      case 'pc':
        return (
          <Group>
            <Rect width={40} height={30} x={-20} y={-20} fill="#64748b" stroke="#334155" strokeWidth={2} cornerRadius={2} />
            <Rect width={10} height={5} x={-5} y={10} fill="#334155" />
            <Rect width={20} height={2} x={-10} y={15} fill="#334155" />
          </Group>
        );
    }
  };

  return (
    <div className="flex flex-col h-[650px] glass-card rounded-2xl overflow-hidden border border-slate-200">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <ToolbarButton 
            active={mode === 'select'} 
            onClick={() => setMode('select')} 
            icon={MousePointer2} 
            label="Select" 
          />
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <ToolbarButton 
            active={mode === 'add-router'} 
            onClick={() => setMode('add-router')} 
            icon={RouterIcon} 
            label="Router" 
          />
          <ToolbarButton 
            active={mode === 'add-switch'} 
            onClick={() => setMode('add-switch')} 
            icon={Database} 
            label="Switch" 
          />
          <ToolbarButton 
            active={mode === 'add-pc'} 
            onClick={() => setMode('add-pc')} 
            icon={Monitor} 
            label="End Device" 
          />
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <ToolbarButton 
            active={mode === 'connect'} 
            onClick={() => setMode('connect')} 
            icon={Link2} 
            label="Connect" 
          />
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={deleteSelected}
                disabled={!selectedId}
                className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                title="Delete Selected"
            >
                <Trash2 size={20} />
            </button>
            <button 
                onClick={simulatePing}
                disabled={links.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 disabled:opacity-30 transition-all border border-slate-200"
            >
                <Share2 size={14} />
                Test Connectivity
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-cisco-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-cisco-dark transition-all">
                <Save size={14} />
                Save Topology
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 bg-slate-50 relative technical-grid cursor-crosshair overflow-hidden">
          {mode !== 'select' && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-cisco-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                Action: {mode.replace('-', ' ')}
            </div>
          )}
          
          <Stage 
            width={800} 
            height={600} 
            onClick={handleStageClick}
            ref={stageRef}
            className="cursor-default"
          >
            <Layer>
              {/* Draw Links */}
              {links.map(link => {
                const from = nodes.find(n => n.id === link.fromId);
                const to = nodes.find(n => n.id === link.toId);
                if (!from || !to) return null;
                return (
                  <Line
                    key={link.id}
                    points={[from.x, from.y, to.x, to.y]}
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    lineCap="round"
                    dash={[10, 5]}
                  />
                );
              })}

              {/* Draw Packet Animation */}
              {packetAnimation.active && (
                <Circle 
                    x={packetAnimation.x} 
                    y={packetAnimation.y} 
                    radius={6} 
                    fill="#63B521" 
                    stroke="white" 
                    strokeWidth={1}
                    shadowBlur={10}
                    shadowColor="#63B521"
                />
              )}

              {/* Draw Nodes */}
              {nodes.map(node => (
                <Group
                  key={node.id}
                  x={node.x}
                  y={node.y}
                  draggable={mode === 'select'}
                  onDragEnd={(e) => updateNodePos(node.id, e.target.x(), e.target.y())}
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Selection Glow */}
                  {(selectedId === node.id || connectingFrom === node.id) && (
                    <Circle
                      radius={35}
                      fill={connectingFrom === node.id ? "rgba(0,188,235,0.2)" : "rgba(0,0,0,0.05)"}
                      stroke={connectingFrom === node.id ? "#00BCEB" : "#cbd5e1"}
                      strokeWidth={2}
                      dash={[5, 2]}
                    />
                  )}
                  
                  {renderIcon(node.type)}
                  
                  <Text
                    text={node.name}
                    y={35}
                    x={-40}
                    width={80}
                    align="center"
                    fontSize={10}
                    fontStyle="bold"
                    fill="#475569"
                  />
                  {node.ip && (
                    <Text
                        text={node.ip}
                        y={48}
                        x={-40}
                        width={80}
                        align="center"
                        fontSize={9}
                        fill="#94a3b8"
                    />
                  )}
                </Group>
              ))}
            </Layer>
          </Stage>
        </div>

        {/* Sidebar Info */}
        <div className="w-64 border-l border-slate-200 bg-white p-4 overflow-y-auto">
          {selectedId ? (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Device Properties</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Node ID: {selectedId.split('-')[1]}</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Hostname</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-cisco-blue outline-none"
                            value={nodes.find(n => n.id === selectedId)?.name || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setNodes(nodes.map(n => n.id === selectedId ? { ...n, name: val } : n));
                            }}
                        />
                    </div>
                    {nodes.find(n => n.id === selectedId)?.type !== 'switch' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">IP Address</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-cisco-blue outline-none"
                                value={nodes.find(n => n.id === selectedId)?.ip || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setNodes(nodes.map(n => n.id === selectedId ? { ...n, ip: val } : n));
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 italic text-[11px] text-blue-700 leading-relaxed">
                    <Info size={14} className="mb-2" />
                    Configure this device in the Lab section by selecting its corresponding hostname.
                </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                    <MousePointer2 size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-700 text-sm">No Device Selected</h4>
                    <p className="text-xs text-slate-500">Pick a tool from the top and click on the canvas to build your network topology.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all gap-1 group",
        active 
          ? "bg-white text-cisco-blue shadow-sm border border-slate-200" 
          : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
      )}
    >
      <Icon size={18} className={cn(active ? "scale-110" : "group-hover:scale-110 transition-transform")} />
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}
