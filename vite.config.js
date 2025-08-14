// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     host: "0.0.0.0",
//     port: 8989,
//     proxy: {
//       '/api': 'http://test-app.dotmagicinfotech.in',
//     },
//     allowedHosts: true,
//   },
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    plugins: [react()],
    server: isDev
      ? {
        host: "0.0.0.0",
        port: 8989,
        proxy: {
          '/api': 'http://test-app.dotmagicinfotech.in',
        },
        allowedHosts: true,
        headers: {
          'Content-Security-Policy': "frame-ancestors https://*.myshopify.com https://admin.shopify.com",
        }
      }
      : undefined,
    build: {
      outDir: 'dist', // Vercel will serve this in production
    }
  }
})
