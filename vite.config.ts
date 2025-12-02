import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-16.png",
        "favicon-32.png",
        "favicon-48.png",
        "apple-touch-icon.png",
        "icons/maylo-48.png",
        "icons/maylo-72.png",
        "icons/maylo-96.png",
        "icons/maylo-144.png",
        "icons/maylo-168.png",
        "icons/maylo-192.png",
        "icons/maylo-256.png",
        "icons/maylo-384.png",
        "icons/maylo-512.png",
        "icons/maylo-512-maskable.png",
        "splash/splash-640x1136.png",
        "splash/splash-750x1334.png",
        "splash/splash-828x1792.png",
        "splash/splash-1125x2436.png",
        "splash/splash-1170x2532.png",
        "splash/splash-1284x2778.png",
        "splash/splash-1536x2048.png",
        "splash/splash-2048x2732.png"
      ],

      manifest: {
        name: "Maylo",
        short_name: "Maylo",
        description: "Maylo — Find trusted local services quickly and easily.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#0057ff",
        icons: [
          { "src": "/icons/maylo-48.png", "sizes": "48x48", "type": "image/png" },
          { "src": "/icons/maylo-72.png", "sizes": "72x72", "type": "image/png" },
          { "src": "/icons/maylo-96.png", "sizes": "96x96", "type": "image/png" },
          { "src": "/icons/maylo-144.png", "sizes": "144x144", "type": "image/png" },
          { "src": "/icons/maylo-168.png", "sizes": "168x168", "type": "image/png" },
          { "src": "/icons/maylo-192.png", "sizes": "192x192", "type": "image/png" },
          { "src": "/icons/maylo-256.png", "sizes": "256x256", "type": "image/png" },
          { "src": "/icons/maylo-384.png", "sizes": "384x384", "type": "image/png" },
          { "src": "/icons/maylo-512.png", "sizes": "512x512", "type": "image/png" },
          {
            "src": "/icons/maylo-512-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      },

      workbox: {
        navigateFallback: "/index.html",
      }
    }),
  ],

  resolve: {
    alias: { "@": "/src" },
  }
});
