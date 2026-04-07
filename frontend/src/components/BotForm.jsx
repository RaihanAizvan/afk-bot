import { useState } from 'react'
import API from '../services/api'

export default function BotForm() {
  const [form, setForm] = useState({
    id: '',
    host: '',
    port: '',
    username: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const startBot = async () => {
    await API.post('/start', form)
  }

  return (
    <div className="card">
      <h3>Create Bot</h3>

      <input name="id" placeholder="ID" onChange={handleChange} />
      <input name="host" placeholder="Host" onChange={handleChange} />
      <input name="port" placeholder="Port" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />

      <button onClick={startBot}>Start</button>
    </div>
  )
}