import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      path: 'path-browserify',
      stream: './src/empty.ts',
      '@@/pkgs': process.env.VITE_PKG_MOD_ALIAS!,
    },
  },
  build: {
    rollupOptions: {
      input: process.env.VITE_HTML_ENTRY_FILEPATH,
    },
    target: 'esnext',
    emptyOutDir: false,
  },
  worker: {
    format: 'es',
  },
  plugins: [react()],
  server: {
    headers: {
      // We should use these headers only for WebContainers
      //"cross-origin-embedder-policy": "require-corp",
      //"cross-origin-opener-policy": "same-origin",
    },
  },
});
