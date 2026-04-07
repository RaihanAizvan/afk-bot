import { useState } from 'react'
import API from '../services/api'

export default function BotCard({ bot }) {
  const [cmd, setCmd] = useState('')

  const stop = () => API.post('/stop', { id: bot.id })

  const send = () => {
    if (!cmd) return
    API.post('/command', { id: bot.id, cmd })
    setCmd('')
  }

  const colorMap = {
    online: 'lime',
    connecting: 'orange',
    error: 'red',
    offline: 'gray'
  }

  return (
    <div className="card">
      <h4>{bot.id}</h4>

      <p>
        Status: <span style={{ color: colorMap[bot.status] }}>
          {bot.status}
        </span>
      </p>

      <div className="row">
        <input
          placeholder="Command..."
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>

      <button onClick={stop}>Stop</button>
    </div>
  )
}