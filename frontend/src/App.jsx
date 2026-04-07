import { useEffect, useState } from 'react'
import socket from './services/socket'

import BotForm from './components/BotForm'
import BotCard from './components/BotCard'
import Logs from './components/Logs'

function App() {
  const [bots, setBots] = useState([])

  useEffect(() => {
    socket.on('bots', (data) => {
      setBots(data)
    })
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Bot Dashboard</h2>

      <BotForm />

      <h3>Active Bots</h3>
      {bots.map(b => <BotCard key={b.id} bot={b} />)}

      <h3>Logs</h3>
      <Logs />
    </div>
  )
}

export default App