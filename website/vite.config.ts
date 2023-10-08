import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ssr } from 'vike/plugin';

export default defineConfig({
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
  plugins: [ssr({ prerender: true }), react()],
});
