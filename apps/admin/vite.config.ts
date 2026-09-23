import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
// En producción el panel se sirve en hleon.dev/panel (ver ADR 0012), así que
// el build genera rutas de assets bajo /panel/. En dev sigue en la raíz de
// localhost:5173.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/panel/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
}))
