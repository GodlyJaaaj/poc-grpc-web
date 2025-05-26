import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.ts', '.js', '.vue', '.json'],
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT || '4200'),
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      open: 'http://localhost:8080',
    },
  };
});
