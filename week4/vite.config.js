import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/submit-resume': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/rankings': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/score-preview': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/stats': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/toggle-secure-mode': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/reset-database': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
