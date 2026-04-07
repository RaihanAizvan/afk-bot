const mineflayer = require('mineflayer')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// ---- STATE ----
const bots = {} // id → { bot, status, config, reconnectTimeout }

// ---- LOG ----
function log(id, message) {
  const time = new Date().toLocaleTimeString()
  const msg = `[${time}] [${id}] ${message}`
  console.log(msg)
  io.emit('log', { id, message: msg })
}

function broadcast() {
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status,
    username: bots[id].config.username,
    health: bots[id].bot?.health || 20,
    food: bots[id].bot?.food || 20,
    pos: bots[id].bot?.entity?.position || { x: 0, y: 0, z: 0 }
  }));
  io.emit('bots', state);
}

// ---- CLEANUP ----
function cleanupBot(id) {
  if (!bots[id]) return

  const { bot, reconnectTimeout } = bots[id]

  if (bot) {
    bot.removeAllListeners()
    try { bot.quit() } catch {}
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
  }

  delete bots[id]
}

// ---- CREATE BOT ----
function createBot(id, config) {
  cleanupBot(id) // important fix

  log(id, 'Creating bot...')

  const bot = mineflayer.createBot({
    host: config.host,
    port: Number(config.port) || undefined,
    username: config.username,
  })

  bots[id] = {
    bot,
    status: 'connecting',
    config,
    shouldReconnect: true,
    reconnectTimeout: null
  }

  broadcast()

  bot.once('spawn', () => {
    bots[id].status = 'online'
    log(id, 'Joined server')
    broadcast()
  })

  bot.on('chat', (username, message) => {
    log(id, `<${username}> ${message}`)
  })

  bot.once('end', () => {
    if (!bots[id]) return

    log(id, 'Disconnected')
    bots[id].status = 'offline'
    broadcast()

    if (bots[id].shouldReconnect) {
      log(id, 'Reconnecting in 5s...')

      bots[id].reconnectTimeout = setTimeout(() => {
        createBot(id, config)
      }, 5000)
    } else {
      cleanupBot(id)
    }
  })

  bot.once('error', (err) => {
    if (!bots[id]) return
    bots[id].status = 'error'
    log(id, `Error: ${err.message}`)
    broadcast()
  })

  bot.on('kicked', (reason) => {
    log(id, `Kicked: ${reason}`)
  })
  bot.on('health', () => broadcast());
  bot.on('move', () => broadcast());
}

// ---- VALIDATION ----
function isValid(data) {
  if (!data.id || !data.host || !data.username) return false
  if (data.id.length > 20) return false
  return true
}

// ---- ROUTES ----
app.post('/start', (req, res) => {
  const { host, port, username } = req.body

  if (!host || !username) {
    return res.json({ msg: 'Missing fields' })
  }

  const id = username + '_' + Date.now()

  createBot(id, { host, port, username })

  res.json({ msg: 'Bot starting...' })
})

app.post('/stop', (req, res) => {
  const { id } = req.body

  if (!bots[id]) {
    return res.json({ msg: 'Bot not found' })
  }

  bots[id].shouldReconnect = false
  cleanupBot(id)

  log(id, 'Stopped manually')
  broadcast()

  res.json({ msg: 'Bot stopped' })
})

app.post('/command', (req, res) => {
  const { id, cmd } = req.body

  if (!bots[id]) return res.json({ msg: 'Bot not found' })

  bots[id].bot.chat(cmd)
  log(id, `Command: ${cmd}`)

  res.json({ msg: 'Command sent' })
})

app.get('/bots', (req, res) => {
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status
  }))
  res.json(state)
})

app.get('/', (req, res) => {
  res.send('Backend running')
})

// ---- SOCKET ----
io.on('connection', (socket) => {
  const state = Object.keys(bots).map(id => ({
    id,
    status: bots[id].status
  }))
  socket.emit('bots', state)
})

// ---- START ----
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`)
})
