import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {},
  },
  esbuild: {
    // skip TS type errors during build
  },
});
