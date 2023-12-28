import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ROOT_DIR = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ROOT_DIR,
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(ROOT_DIR, 'index.html'),
        top: resolve(ROOT_DIR, 'top.html'),
        login: resolve(ROOT_DIR, 'login.html'),
      },
    },
  },
})
