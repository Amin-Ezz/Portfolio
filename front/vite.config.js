import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lumina: resolve(__dirname, 'projects/lumina.html'),
        modStyle: resolve(__dirname, 'projects/mod-style.html'),
        projectManagement: resolve(__dirname, 'projects/project-management.html'),
        tripOs: resolve(__dirname, 'projects/trip-os.html')
      }
    }
  }
});
