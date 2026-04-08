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
    socket.on('log', (data) => {
      setLogs(prev => [...prev.slice(-100), data])
    })

    return () => socket.off('log')
  }, [])

  const getColor = (type) => {
    switch (type) {
      case 'chat': return 'text-white'
      case 'system': return 'text-yellow-400'
      case 'game_info': return 'text-cyan-400'
      default: return 'text-neutral-400'
    }
  }

  return (
    <div className="bg-black border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[400px]">
    <div className="p-3 border-b border-neutral-800 bg-neutral-900/20 flex justify-between items-center">
    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Realtime Stream</span>
    <div className="flex gap-1.5">
    <div className="w-2 h-2 rounded-full bg-neutral-800" />
    <div className="w-2 h-2 rounded-full bg-neutral-800" />
    </div>
    </div>
    <div className="bg-black p-3 h-64 overflow-y-auto font-mono text-sm">
    {logs.map((log, i) => (
      <div key={i} className={getColor(log.type)}>

      <span className="text-neutral-500 mr-2">
      [{log.time}]
      </span>

      <span className="text-blue-400 mr-2">
      [{log.id}]
      </span>

      {log.message}

      </div>
    ))}
    </div>
    <div ref={logEndRef} />
    </div>
    </div>
  );
}
