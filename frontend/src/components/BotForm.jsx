import { useState } from 'react';
import { Plus, Server, User, Hash, Layers } from 'lucide-react';
import API from '../services/api';

export default function BotForm() {
  const [config, setConfig] = useState({
    host: '',
    port: '25565',
    username: 'Bot',
    count: 1
  });

  const [loading, setLoading] = useState(false);

  const startDeployment = async () => {
    setLoading(true);
    const { host, port, username, count } = config;
    try {
      for (let i = 0; i < count; i++) {
        const finalName = count > 1 ? `${username}_${i + 1}` : username;
        await API.post('/start', { host, port, username: finalName });
      }
    } catch (err) {
      console.error("Deployment failed", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
    {/* Input Group */}
    <div className="space-y-4">
    {/* Host Input */}
    <div className="space-y-2">
    <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 ml-1">
    Server Address
    </label>
    <div className="relative group">
    <Server className="absolute left-3 top-2.5 text-neutral-600 group-focus-within:text-white transition-colors" size={16} />
    <input
    className="w-full bg-black border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-neutral-500 transition-all placeholder:text-neutral-700"
    placeholder="e.g. mc.hypixel.net"
    onChange={e => setConfig({...config, host: e.target.value})}
    />
    </div>
    </div>

    {/* Port & Username Row */}
    <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
    <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 ml-1">
    Port
    </label>
    <div className="relative">
    <Hash className="absolute left-3 top-2.5 text-neutral-600" size={16} />
    <input
    className="w-full bg-black border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-neutral-500 transition-all"
    defaultValue="25565"
    onChange={e => setConfig({...config, port: e.target.value})}
    />
    </div>
    </div>
    <div className="space-y-2">
    <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 ml-1">
    Username
    </label>
    <div className="relative">
    <User className="absolute left-3 top-2.5 text-neutral-600" size={16} />
    <input
    className="w-full bg-black border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-neutral-500 transition-all"
    placeholder="Steve"
    onChange={e => setConfig({...config, username: e.target.value})}
    />
    </div>
    </div>
    </div>

    {/* Batch Count */}
    <div className="space-y-2">
    <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 ml-1">
    Instance Count
    </label>
    <div className="relative">
    <Layers className="absolute left-3 top-2.5 text-neutral-600" size={16} />
    <input
    type="number"
    className="w-full bg-black border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-neutral-500 transition-all"
    defaultValue="1"
    min="1"
    max="10"
    onChange={e => setConfig({...config, count: parseInt(e.target.value)})}
    />
    </div>
    </div>
    </div>

    {/* Action Footer */}
    <div className="pt-4 border-t border-neutral-800">
    <button
    onClick={startDeployment}
    disabled={loading || !config.host}
    className="w-full bg-white text-black font-bold py-2.5 rounded-md text-xs uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
    {loading ? (
      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
    ) : (
      <>
      <Plus size={14} strokeWidth={3} />
      Deploy Cluster
      </>
    )}
    </button>
    <p className="text-[10px] text-neutral-600 text-center mt-3 italic">
    Provisioning may take up to 5s per instance.
    </p>
    </div>
    </div>
  );
}
