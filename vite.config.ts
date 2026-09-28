import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['EV_range_logo.webp'],
      manifest: {
        name: 'VoltRange',
        short_name: 'VoltRange',
        description: 'Electric vehicle range standard converter',
        theme_color: '#101419',
        background_color: '#101419',
        display: 'standalone',
        icons: [
          {
            src: '/EV_range_logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: '/EV_range_logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          },
          {
            src: '/EV_range_logo.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
