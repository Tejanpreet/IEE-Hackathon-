import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api/* is forwarded to FastAPI so the browser never needs backend URLs or keys.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // TEMP for local testing: corridorwatch backend moved to 8001 because
      // the AI microservice (service/) was already running on 8000. Needs a
      // real decision (stop one, or permanently repoint) - see chat.
      '/api': { target: 'http://localhost:8001', changeOrigin: true },
    },
  },
});
