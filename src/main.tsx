// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './app/App'
import '.styles/global.css'

// registracija SW (radi samo kad plugin postoji u buildu)
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,              // čim učita app
    onNeedRefresh() {
      // po želji: možeš da prikažeš toast da postoji nova verzija
    },
    onOfflineReady() {
      // po želji: obaveštenje "app spremna za offline"
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
