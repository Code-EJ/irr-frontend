import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 4173,
      allowedHosts: [
        'front-irr-production.up.railway.app',
      ],
    },
  };
});
