import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Release-Notes/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
