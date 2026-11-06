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
  server: {
    proxy: {
      ...(env.VITE_API_BASE_URL ? { '/api': { target: env.VITE_API_BASE_URL, changeOrigin: true } } : {}),
      // Chat inbox (third party): same-origin in dev so the browser doesn't block it
      ...(env.VITE_BABBLER_BASE_URL ? { '/babbler': { target: new URL(env.VITE_BABBLER_BASE_URL).origin, changeOrigin: true, rewrite: (p: string) => p.replace(/^\/babbler/, '') } } : {}),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  };
});
