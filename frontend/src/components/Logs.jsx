import { useEffect, useState, useRef } from 'react';
import socket from '../services/socket';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    const handler = (data) => setLogs(prev => [...prev.slice(-100), data.message]);
    socket.on('log', handler);
    return () => socket.off('log', handler);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-black border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[400px]">
    <div className="p-3 border-b border-neutral-800 bg-neutral-900/20 flex justify-between items-center">
    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Realtime Stream</span>
    <div className="flex gap-1.5">
    <div className="w-2 h-2 rounded-full bg-neutral-800" />
    <div className="w-2 h-2 rounded-full bg-neutral-800" />
    </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
    {logs.map((log, i) => (
      <div key={i} className="font-mono text-[11px] leading-relaxed group flex gap-3">
      <span className="text-neutral-700 shrink-0 select-none">
      {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="text-neutral-300 break-all">{log}</span>
      </div>
    ))}
    <div ref={logEndRef} />
    </div>
    </div>
  );
}
