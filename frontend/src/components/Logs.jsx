import { useEffect, useState } from 'react'
import socket from '../services/socket'

export default function Logs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const handler = (data) => {
      setLogs(prev => [...prev.slice(-100), data.message])
    }

    socket.on('log', handler)

    return () => socket.off('log', handler)
  }, [])

  return (
    <div className="logs">
      {logs.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  )
}