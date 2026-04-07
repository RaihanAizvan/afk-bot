import { Power, Send, Cpu, Activity } from 'lucide-react';
import API from '../services/api';
import { useState } from 'react';

export default function BotCard({ bot }) {
  const [cmd, setCmd] = useState('');
  const isOnline = bot.status === 'online';

  const sendCommand = async () => {
    // Prevent sending if empty or if bot is offline
    if (!cmd.trim()) return;

    try {
      console.log(`Sending to ${bot.id}: ${cmd}`); // Debug check
      const response = await API.post('/command', {
        id: bot.id,
        cmd: cmd
      });

      console.log('Server response:', response.data);
      setCmd(''); // Clear input on success
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  // Allow pressing "Enter" to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendCommand();
    }
  };

  return (
    <div className="group relative bg-black border border-neutral-800 rounded-lg p-5 hover:border-neutral-500 transition-all duration-300">
    <div className="flex justify-between items-start">
    <div className="flex items-center gap-4">
    <div className="relative">
    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-neutral-700'}`} />
    {isOnline && <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />}
    </div>
    <div>
    <h3 className="font-bold text-lg text-neutral-100">{bot.username || bot.id.split('_')[0]}</h3>
    <p className="text-xs text-neutral-500 font-mono">{bot.id}</p>
    </div>
    </div>
    <button
    onClick={() => API.post('/stop', { id: bot.id })}
    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
    title="Stop Bot"
    >
    <Power size={18} />
    </button>
    </div>

    {/* Stats Grid */}
    <div className="mt-6 flex gap-8 items-center border-t border-neutral-900 pt-5">
    <div className="flex items-center gap-2">
    <Activity size={14} className="text-neutral-600" />
    <span className="text-xs text-neutral-400 font-medium">{bot.health || 20} HP</span>
    </div>
    <div className="flex items-center gap-2">
    <Cpu size={14} className="text-neutral-600" />
    <span className="text-xs text-neutral-400 font-medium">Stable</span>
    </div>
    <div className="ml-auto">
    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${isOnline ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
    {bot.status}
    </span>
    </div>
    </div>

    {/* Inline Command Input - CONNECTED TO STATE */}
    <div className="mt-5 flex gap-2">
    <input
    className="flex-1 bg-neutral-900 border border-neutral-800 text-sm rounded-md px-3 py-2 outline-none focus:border-white transition-colors placeholder:text-neutral-700 text-white"
    placeholder="Send command to bot..."
    value={cmd} // CONNECTED
    onChange={(e) => setCmd(e.target.value)} // CONNECTED
    onKeyDown={handleKeyDown} // ADDED ENTER SUPPORT
    />
    <button
    onClick={sendCommand} // CONNECTED
    disabled={!isOnline}
    className="bg-white text-black px-3 rounded-md hover:bg-neutral-200 transition-colors disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
    >
    <Send size={14} />
    </button>
    </div>
    </div>
  );
}
