import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Smart Finance',
        short_name: 'Smart Finance',
        theme_color: '#0f172a',
        background_color: '#f8f9fb',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Basic offline support: cache app shell + assets, and use a network-first strategy for navigations.
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pwa-navigation',
              networkTimeoutSeconds: 8,
            },
          },
          {
            urlPattern: ({ request }) => {
              const dest = request.destination
              return dest === 'style' || dest === 'script' || dest === 'worker' || dest === 'image' || dest === 'font'
            },
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'pwa-assets',
            },
          },
        ],
      },
      // Better DX: disable PWA in dev mode to avoid caching issues during development.
      devOptions: {
        enabled: false,
      },
    }),
  ],
})


