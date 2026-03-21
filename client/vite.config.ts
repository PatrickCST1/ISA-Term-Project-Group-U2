import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/IsaAsgn1/',
    root: '.',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_BASE_PATH': JSON.stringify(env.VITE_BASE_PATH || '/IsaAsgn1')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: '../../dist'
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/IsaAsgn1/client': 'http://server:3000',
        '/IsaAsgn1/api': 'http://server:3000'
      }
    },
  };
});