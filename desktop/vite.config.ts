import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/budget-app/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
    },
    dedupe: ['react', 'react-dom', 'zustand'],
  },
})
