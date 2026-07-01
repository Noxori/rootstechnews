import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api/rss/theverge': {
        target: 'https://www.theverge.com',
        changeOrigin: true,
        rewrite: () => '/rss/index.xml',
      },
      '/api/rss/techcrunch': {
        target: 'https://techcrunch.com',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
      '/api/rss/arstechnica': {
        target: 'https://feeds.arstechnica.com',
        changeOrigin: true,
        rewrite: () => '/arstechnica/index',
      },
      '/api/rss/techcabal': {
        target: 'https://techcabal.com',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
      '/api/rss/technext': {
        target: 'https://technext24.com',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
      '/api/rss/restofworld': {
        target: 'https://restofworld.org',
        changeOrigin: true,
        rewrite: () => '/feed/',
      },
    },
  },
})