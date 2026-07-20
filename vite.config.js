import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Optional: Add these for better compatibility
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
})
