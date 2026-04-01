import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 1. Set explicit base for Vercel deployment
  base: '/', 
  build: {
    // 2. Ensure the output directory matches Vercel's expectations
    outDir: 'dist',
    // 3. Ensure assets are cleaned before every build
    emptyOutDir: true,
    // 4. Sometimes helpful for Rolldown's asset mapping
    assetsDir: 'assets',
  },
})
