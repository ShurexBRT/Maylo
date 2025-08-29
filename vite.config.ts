import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'robots.txt'],
      manifest: {
        name: 'Maylo',
        short_name: 'Maylo',
        description: 'Local services in the language you understand.',
        theme_color: '#0057ff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/welcome',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          // statički asseti (CSS/JS/fonts/images) – cache-first
          {
            urlPattern: ({ request }) =>
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'worker' ||
              request.destination === 'font' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-v1',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Supabase REST/Storage – network-first (da ne keširamo auth/problematične stvari)
          {
            urlPattern: /^https:\/\/([a-z0-9-]+)\.supabase\.co\/(rest|storage)\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,           // omogući PWA u dev-u
        navigateFallback: 'index.html',
      },
    }),
  ],
})
