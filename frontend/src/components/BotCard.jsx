import { useEffect, useState } from 'react'
import API from '../services/api'
import socket from '../services/socket'

export default function BotCard({ bot }) {
  const [logs, setLogs] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const handler = (data) => {
      setLogs(prev => [...prev.slice(-50), data])
    }

    socket.on(`log:${bot.id}`, handler)

    return () => socket.off(`log:${bot.id}`, handler)
  }, [bot.id])

  const sendCommand = async () => {
    if (!input) return
      await API.post('/command', { id: bot.id, cmd: input })
      setInput('')
  }

  const stopBot = async () => {
    await API.post('/stop', { id: bot.id })
  }

  return (
    <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40">

    <div className="flex justify-between items-center mb-3">
    <div>
    <h4 className="font-semibold">{bot.username}</h4>
    <p className="text-xs text-neutral-400">{bot.status}</p>
    </div>

    <button onClick={stopBot} className="text-xs bg-red-500 px-2 py-1 rounded">
    Stop
    </button>
    </div>

    {/* CHAT WINDOW */}
    <div className="border border-neutral-800 rounded-lg overflow-hidden">

    <div className="h-40 overflow-y-auto bg-black p-2 text-sm font-mono">
    {logs.map((log, i) => (
      <div key={i} className="text-white">
      <span className="text-neutral-500 mr-1">[{log.time}]</span>
      {log.message}
      </div>
    ))}
    </div>

    <div className="flex border-t border-neutral-800">
    <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type command..."
    className="flex-1 bg-black px-2 py-1 text-sm outline-none"
    />

    <button
    onClick={sendCommand}
    className="px-3 bg-white text-black text-xs"
    >
    Send
    </button>
    </div>

    </div>

    </div>
  )
}
