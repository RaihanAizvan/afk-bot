const mineflayer = require('mineflayer')
const express = require('express')
const cors = require('cors')

const app = express()

// FORCE CORS (important)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

  // handle preflight RIGHT HERE
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(cors()) // keep it, but this alone isn't enough sometimes
app.use(express.json())

const PORT = process.env.PORT || 3000

let bot = null
let shouldReconnect = true

function createBot(config) {
    if (bot) return

    shouldReconnect = true

    bot = mineflayer.createBot({
        host: config.host,
        port: config.port || undefined,
        username: config.username
    })

    bot.on('spawn', () => {
        console.log('Bot joined')
    })

    bot.on('end', () => {
        console.log('Bot disconnected')
        bot = null

        if (shouldReconnect) {
            setTimeout(() => createBot(config), 5000)
        }
    })

    bot.on('error', (err) => {
        console.log('Error:', err.message)
    })
}

// --- API ROUTES ---



app.post('/start', (req, res) => {
    const { host, port, username } = req.body

    if (bot) return res.json({ msg: 'Bot already running' })

    createBot({ host, port, username })
    res.json({ msg: 'Bot starting...' })
})

app.post('/stop', (req, res) => {
    if (!bot) return res.json({ msg: 'No bot running' })

    shouldReconnect = false
    bot.quit()
    bot = null

    res.json({ msg: 'Bot stopped' })
})

app.post('/command', (req, res) => {
    const { cmd } = req.body

    if (!bot) return res.json({ msg: 'Bot not running' })

    bot.chat(cmd)
    res.json({ msg: 'Command sent' })
})

app.get('/', (req, res) => {
    res.send('Backend running')
})

app.listen(PORT, () => {
    console.log('Server running')
})