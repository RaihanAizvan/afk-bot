const mineflayer = require('mineflayer')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

app.use(cors())
app.use(express.json())

// ---- CONFIG ----
const PORT = process.env.PORT || 3000

// ---- STATE ----
const bots = {} // id → { bot, status, config }

// ---- LOG SYSTEM ----
function log(id, message) {
  const time = new Date().toLocaleTimeString()
  const logMsg = `[${time}] [${id}] ${message}`
  console.log(logMsg)

  io.emit('log', { id, message: logMsg })
}

function broadcast() {
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status
  }))
  io.emit('bots', state)
}

// ---- BOT CREATION ----
function createBot(id, config) {
  if (bots[id]) return

  log(id, 'Creating bot...')

  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port || undefined,
    username: config.username,
    version: '1.20.1'
  })

  bots[id] = {
    bot,
    status: 'connecting',
    config,
    shouldReconnect: true
  }

  broadcast()

  bot.on('spawn', () => {
    bots[id].status = 'online'
    log(id, 'Joined server')
    broadcast()
  })

  bot.on('end', () => {
    log(id, 'Disconnected')
    bots[id].status = 'offline'
    broadcast()

    if (bots[id].shouldReconnect) {
      log(id, 'Reconnecting in 5s...')
      setTimeout(() => {
        createBot(id, config)
      }, 5000)
    } else {
      delete bots[id]
    }
  })

  bot.on('error', (err) => {
    bots[id].status = 'error'
    log(id, `Error: ${err.message}`)
    broadcast()
  })

  bot.on('kicked', (reason) => {
    log(id, `Kicked: ${reason}`)
  })

  bot.on('chat', (username, message) => {
    log(id, `<${username}> ${message}`)
  })
}

// ---- API ROUTES ----

// Start bot
app.post('/start', (req, res) => {
  const { id, host, port, username } = req.body

  if (!id || !host || !username) {
    return res.json({ msg: 'Missing fields' })
  }

  if (bots[id]) {
    return res.json({ msg: 'Bot already exists' })
  }

  createBot(id, { host, port, username })

  res.json({ msg: 'Bot starting...' })
})

// Stop bot
app.post('/stop', (req, res) => {
  const { id } = req.body

  if (!bots[id]) {
    return res.json({ msg: 'Bot not found' })
  }

  bots[id].shouldReconnect = false
  bots[id].bot.quit()

  log(id, 'Stopped manually')

  delete bots[id]
  broadcast()

  res.json({ msg: 'Bot stopped' })
})

// Send command
app.post('/command', (req, res) => {
  const { id, cmd } = req.body

  if (!bots[id]) {
    return res.json({ msg: 'Bot not found' })
  }

  bots[id].bot.chat(cmd)
  log(id, `Command sent: ${cmd}`)

  res.json({ msg: 'Command sent' })
})

// Get status
app.get('/bots', (req, res) => {
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status
  }))
  res.json(state)
})

// Health check
app.get('/', (req, res) => {
  res.send('Backend running')
})

// ---- SOCKET ----
io.on('connection', (socket) => {
  console.log('Frontend connected')

  // send initial state
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status
  }))

  socket.emit('bots', state)
})

// ---- START ----
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})