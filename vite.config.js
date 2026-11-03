import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Verzoeken naar /api/... gaan tijdens het ontwikkelen door naar de
    // PHP-backend. Voorbeeld: fetch("/api/employees") wordt
    // http://localhost:3333/employees. Zo is er geen CORS nodig.
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
