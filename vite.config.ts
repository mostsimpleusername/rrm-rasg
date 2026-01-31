import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: process.env.VITE_BASE_URL || '/rrm-rasg',
    define: {
      // This maps the Vercel/Vite env var (VITE_API_KEY) to what your code expects (process.env.API_KEY)
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  };
});