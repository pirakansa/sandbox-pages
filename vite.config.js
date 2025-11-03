import { resolve } from 'path'
import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer"
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

const ROOT_DIR = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [
    react(),
    visualizer({filename: 'bundle-analysis.html'}),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        '/images/favicon.png',
        '/images/apple-touch-icon.png',
        '/assets/logo-*.jpeg'
      ],
      manifest: {
        name: "pira's sandbox",
        short_name: "pira's",
        description: "pira's sandbox application.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        lang: "ja",
        background_color: "#fafbf5",
        icons: [
          {
            src: "/images/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/images/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      devOptions: {
        enabled: false,
      },
      workbox: {
        // ignoreURLParametersMatching: [/.*/],
        navigateFallbackDenylist: [/\/login\.html/],
      }
    })
  ],
  envDir: __dirname,
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version || 'dev'),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || 'dev'),
  },
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
      output: {
        manualChunks: {
          jsqr: ["jsqr"],
          forcegraph2d: ["react-force-graph-2d"],
          octkit: ["octokit"],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: resolve(__dirname, 'src/setupTests.js'),
    globals: true,
    css: true,
    pool: 'threads',
    minWorkers: 1,
    maxWorkers: 1,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
