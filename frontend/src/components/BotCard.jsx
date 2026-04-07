import API from '../services/api'

export default function BotCard({ bot }) {

  const stopBot = async () => {
    await API.post('/stop', { id: bot.id })
  }

  const sendCommand = async () => {
    const cmd = prompt("Command?")
    if (!cmd) return

    await API.post('/command', { id: bot.id, cmd })
  }

  const color =
    bot.status === 'online' ? 'green' :
    bot.status === 'connecting' ? 'orange' :
    bot.status === 'error' ? 'red' : 'gray'

  return (
    <div style={{
      border: '1px solid #444',
      padding: 10,
      marginBottom: 10
    }}>
      <h4>{bot.id}</h4>
      <p>Status: <span style={{ color }}>{bot.status}</span></p>

      <button onClick={sendCommand}>Command</button>
      <button onClick={stopBot}>Stop</button>
    </div>
  )
}