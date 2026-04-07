import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
