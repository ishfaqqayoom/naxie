import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    lib: {
      entry: resolve('src/vanilla/index.ts'),
      name: 'Naxie',
      fileName: (format) => `naxie.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'umd'],
    },
    outDir: 'dist-vanilla',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Ensure everything is bundled into a single file
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'naxie.css';
          return assetInfo.name;
        },
      },
    },
  },
});
