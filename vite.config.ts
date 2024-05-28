/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    root: __dirname,
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    //dir: './src',
  },
});
