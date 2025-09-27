// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // General src alias
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Alias pointing to your folder with a SPACE in its name
      'auth-hooks': fileURLToPath(
        new URL('./src/hooks/Authentication hooks', import.meta.url)
      ),
    },
  },
})
