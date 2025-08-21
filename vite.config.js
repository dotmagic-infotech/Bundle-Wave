import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/home',
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    host: "0.0.0.0",
    port: 8989,
    headers: {
      'Content-Security-Policy': 'frame-ancestors https://*.myshopify.com https://admin.shopify.com',
      'X-Frame-Options': 'ALLOWALL',
    },
    allowedHosts: true,
  },
})

