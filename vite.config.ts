import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        // Main entry (React - backward compatible)
        index: resolve('src/index.ts'),
        // Core services
        'core/index': resolve('src/core/index.ts'),
        // Vanilla JavaScript
        'vanilla/index': resolve('src/vanilla/index.ts'),
        // Angular
        'angular/index': resolve('src/angular/index.ts'),
        // Vue
        'vue/index': resolve('src/vue/index.ts'),
        // jQuery
        'jquery/jquery.naxie': resolve('src/jquery/jquery.naxie.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@angular/core',
        '@angular/common',
        'vue',
        'jquery',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          vue: 'Vue',
          jquery: 'jQuery',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'style.css';
          }
          if (assetInfo.name === 'style.css') {
            return 'vanilla/style.css';
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
});
