import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    open: '/demo.html',
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
});
