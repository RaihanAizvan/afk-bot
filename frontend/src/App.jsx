import { useEffect, useState } from 'react'
import socket from './services/socket'

import BotForm from './components/BotForm'
import BotCard from './components/BotCard'
import Logs from './components/Logs'

function App() {
  const [bots, setBots] = useState([])

  useEffect(() => {
    const handler = (data) => setBots(data)

    socket.on('bots', handler)

    return () => socket.off('bots', handler)
  }, [])

  return (
    <div className="container">
      <h1>Bot Dashboard</h1>

      <BotForm />

      <div className="grid">
        {bots.map(b => <BotCard key={b.id} bot={b} />)}
      </div>

      <Logs />
    </div>
  )
}

export default App