import { io } from 'socket.io-client'

const socket = io('https://afk-bot-u105.onrender.com')

// const socket = io('http://localhost:3000')

export default socket
