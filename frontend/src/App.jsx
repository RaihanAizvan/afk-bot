import { Plus, Terminal as TerminalIcon, Activity, ChevronRight } from 'lucide-react';
import BotForm from './components/BotForm';
import BotCard from './components/BotCard';
import Logs from './components/Logs';
import { useState, useEffect } from 'react';
import socket from './services/socket';

export default function App() {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    socket.connect()

    const handler = (data) => setBots(data)

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.log('❌ Socket error:', err.message)
    })

    socket.on('bots', handler)

    return () => {
      socket.off('bots', handler)
      socket.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
    {/* Navigation */}
    <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
    <div className="flex items-center gap-4">
    <svg width="26" height="26" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white"/>
    </svg>
    <div className="h-5 w-[1px] bg-neutral-800 mx-2" />
    <h1 className="text-sm font-medium tracking-tight text-neutral-300 flex items-center gap-2">
    User <ChevronRight size={14} className="text-neutral-600" />
    <span className="text-white font-semibold">BOT-Console</span>
    </h1>
    </div>
    <div className="flex gap-6 items-center text-sm">
    <button className="text-neutral-400 hover:text-white transition-colors">Feedback</button>
    <button className="bg-white text-black px-4 py-1.5 rounded-md font-medium hover:bg-neutral-200 transition-all text-xs">
    Deploy New Instance
    </button>
    </div>
    </div>
    </nav>

    {/* Content Wrapper */}
    <main className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

    {/* Main Dashboard Area */}
    <div className="lg:col-span-8">
    <header className="mb-8">
    <h2 className="text-2xl font-bold tracking-tight">Deployments</h2>
    <p className="text-neutral-500 text-sm mt-1">Real-time status of your mineflayer swarm.</p>
    </header>

    <div className="space-y-4">
    {bots.length === 0 ? (
      <div className="border border-neutral-800 rounded-lg p-20 flex flex-col items-center justify-center bg-neutral-900/30">
      <p className="text-neutral-500 text-sm">No active bots found on this project.</p>
      </div>
    ) : (
      bots.map(b => <BotCard key={b.id} bot={b} />)
    )}
    </div>
    </div>

    {/* Side Panels */}
    <div className="lg:col-span-4 space-y-10">
    <section>
    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 px-1">Configurator</h3>
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
    <BotForm />
    </div>
    </section>

    <section>
    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 px-1">Global Events</h3>
    <Logs />
    </section>
    </div>

    </div>
    </main>
    </div>
  );
}
