import { useEffect, useState } from 'react'
import socket from '../services/socket'

export default function Logs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    socket.on('log', (data) => {
      setLogs(prev => [...prev.slice(-50), data.message])
    })
  }, [])

  return (
    <div style={{
      background: '#111',
      color: '#0f0',
      padding: 10,
      height: 200,
      overflow: 'auto'
    }}>
      {logs.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  )
}