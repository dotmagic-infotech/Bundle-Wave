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

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    base: './', // important for Vercel deploy
    plugins: [react()],
    server: isDev
      ? {
        host: "0.0.0.0",
        port: 8989,
        headers: {
          'Content-Security-Policy': "frame-ancestors https://*.myshopify.com https://admin.shopify.com",
          'X-Frame-Options': 'ALLOWALL',
        },
        proxy: {
          '/api': 'http://test-app.dotmagicinfotech.in'
        }
      }
      : undefined,
    build: {
      outDir: 'dist'
    }
  }
})

