import { io } from 'socket.io-client'

const socket = io('https://afk-bot-u105.onrender.com', {
    autoConnect: false,
    transports: ['polling','websocket'],
})


// const socket = io('http://localhost:3000', {
//     autoConnect: false,
//     transports: ['websocket'],
// })


export default socket
