// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // ako koristiš '/maylo' pod-stazu na Vercel-u, stavi base ovde ili u defineConfig({ base:'/maylo/' })
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-512.png',
        'favicon.ico',
        'robots.txt'
      ],
      manifest: {
        name: 'Maylo',
        short_name: 'Maylo',
        description: 'Local services in the language you understand',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0057ff',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html'
      },
      devOptions: {
        enabled: true // da radi i u `npm run dev`
      }
    })
  ]
})
