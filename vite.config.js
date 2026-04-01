import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ensures all paths in index.html start with /
  base: '/', 
  build: {
    // Explicitly define output for Vercel
    outDir: 'dist',
    // Clean the folder before building to prevent stale hashes
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // This ensures a predictable structure for your assets
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
