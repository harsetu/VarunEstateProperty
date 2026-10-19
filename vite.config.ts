import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Pick the website: `vite --mode rworld`, or VITE_FLAVOR in .env (default: pahwa)
  const env = loadEnv(mode, process.cwd(), '');
  const flavor = env.VITE_FLAVOR || 'pahwa';
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@flavor': fileURLToPath(new URL(`./src/flavors/${flavor}`, import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // In dev, /api is proxied to the backend so no CORS setup is needed
  server: env.VITE_API_BASE_URL ? { proxy: { '/api': { target: env.VITE_API_BASE_URL, changeOrigin: true } } } : undefined,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  };
});
