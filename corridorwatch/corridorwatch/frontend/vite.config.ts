import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api/* is forwarded to FastAPI so the browser never needs backend URLs or keys.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
});
