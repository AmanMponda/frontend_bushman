import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { vuestic } from '@vuestic/compiler/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/frontend_bushman/',
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://bushman-api.abooderp.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        ws: true, // Enable WebSocket support
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Ensure CORS headers are properly set
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
          })
        },
      },
    },
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    },
    // Ensure single Vue instance across all dependencies
    dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@vue/shared', 'vue-router'],
  },
  optimizeDeps: {
    // Exclude vuestic-ui from pre-bundling to avoid lazy initialization issues
    // It will be loaded as raw ESM which has proper module execution order
    exclude: ['vuestic-ui'],
    include: ['vue', 'vue-router', 'vue3-perfect-scrollbar'],
  },
  plugins: [
    vue(),
    vuestic({
      devtools: true,
      cssLayers: true,
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
})
