import { useState } from 'react'
import API from '../services/api'

export default function BotForm() {
  const [form, setForm] = useState({
    id: '',
    host: '',
    port: '',
    username: ''
  })

  const startBot = async () => {
    await API.post('/start', form)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Create Bot</h3>

      <input placeholder="ID" onChange={e => setForm({...form, id: e.target.value})} />
      <input placeholder="Host" onChange={e => setForm({...form, host: e.target.value})} />
      <input placeholder="Port" onChange={e => setForm({...form, port: e.target.value})} />
      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />

      <button onClick={startBot}>Start Bot</button>
    </div>
  )
}