import axios from 'axios'

const API = axios.create({
  baseURL: 'https://afk-bot-u105.onrender.com'
})

export default API