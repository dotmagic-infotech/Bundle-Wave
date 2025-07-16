import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8989,
    proxy: {
      '/api': 'http://test-app.dotmagicinfotech.in',
    },
    allowedHosts: true,
  },
  plugins: [react()],
})
