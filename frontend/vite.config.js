import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
  },
  // Speed up dev server by pre-bundling frequently used deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap', 'axios']
  }
})
