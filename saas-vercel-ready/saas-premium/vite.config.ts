import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js', '@tanstack/react-query'],
          'vendor-editor': ['@dnd-kit/core', '@dnd-kit/sortable', 'wavesurfer.js'],
          'vendor-sentry': ['@sentry/react'],
        },
      },
    },
  },
})
