import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    // esto apunta todas las referencias a "global" al objeto window
    global: 'window'
  },
  plugins: [react()]
});