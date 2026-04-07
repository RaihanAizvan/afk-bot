const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Bot is running')
})

app.listen(PORT, () => {
  console.log('Web server running')
})

function createBot() {
  const bot = mineflayer.createBot({
    host: 'YOUR_SERVER_IP',   // e.g. play.example.com
    port: 25565,
    username: 'AFK_Bot_123'   // anything if cracked
  })

  bot.on('spawn', () => {
    console.log('Bot joined the server')

    // If your server needs login/register, uncomment:
    // bot.chat('/login password')
    // bot.chat('/register password password')
  })

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...')
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })
}

createBot()