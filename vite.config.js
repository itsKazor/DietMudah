import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'DietMudah',
        short_name: 'DietMudah',
        description: 'Tracking kalori dan makronutrisi harian mudah dan praktis',
        theme_color: '#1B4332',
        background_color: '#F5F5F0',
        display: 'standalone',
        icons: [
          {
            src: '/icons/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
