import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// Get base path from environment variable, default to '/frontend_bushman/' for GitHub Pages
// Set VITE_BASE_PATH='/' for Render.com or other root deployments
// Auto-detect Render.com deployment
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Check VITE_BASE_PATH from both process.env (for inline vars) and loaded env
  const viteBasePath = process.env.VITE_BASE_PATH || env.VITE_BASE_PATH

  // Check if we're on Render.com (multiple ways Render.com identifies itself)
  const isRender =
    process.env.RENDER === 'true' ||
    !!process.env.RENDER_EXTERNAL_HOSTNAME ||
    !!process.env.RENDER_SERVICE_ID ||
    process.env.RENDER === '1'

  // Check if we're on Cloudflare Pages
  const isCloudflarePages =
    !!process.env.CF_PAGES ||
    !!process.env.CF_PAGES_BRANCH ||
    !!process.env.CF_PAGES_COMMIT_SHA ||
    (process.env.CI === 'true' && !!process.env.CF_PAGES_URL)

  // Use '/' for Cloudflare Pages, Render.com, ERP server, or if explicit VITE_BASE_PATH is set
  // Otherwise default to '/frontend_bushman/' for GitHub Pages
  // For custom ERP server deployments, set VITE_BASE_PATH environment variable
  const basePath = viteBasePath || (isCloudflarePages || isRender ? '/' : '/frontend_bushman/')

  console.log(`[Vite Config] Base path: ${basePath}`)
  console.log(`[Vite Config] VITE_BASE_PATH: ${viteBasePath}`)
  console.log(`[Vite Config] Is Cloudflare Pages: ${isCloudflarePages}`)
  console.log(`[Vite Config] Is Render: ${isRender}`)

  // https://vitejs.dev/config/
  return {
    base: basePath,
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
      // Disable source maps for production to reduce bundle size
      sourcemap: false,
      // Remove comments and whitespace
      minify: 'esbuild',
      // Optimize CSS
      cssCodeSplit: false, // Keep all CSS in a single file for consistent loading
      cssMinify: 'esbuild',
      // Target modern browsers for smaller bundles
      target: 'es2015',
      // Enable tree shaking
      treeshake: true,
      // Chunk size warnings threshold (in kbs)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Ensure ALL assets go to assets folder with consistent naming
          assetFileNames: 'assets/[name]-[hash][extname]',
          // Ensure JS files are in assets folder
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          // Manual chunk splitting optimized for performance
          // Keep pages as individual chunks for lazy loading (better performance)
          // Only group vendor libraries for better caching
          manualChunks: (id) => {
            // Only split vendor libraries, let pages stay as individual chunks
            if (id.includes('node_modules')) {
              // Large libraries get their own chunks for better caching
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vue-vendor'
              }
              if (id.includes('bootstrap')) {
                return 'bootstrap-vendor'
              }
              if (id.includes('chart.js') || id.includes('chartjs')) {
                return 'chart-vendor'
              }
              if (id.includes('@fullcalendar')) {
                return 'calendar-vendor'
              }
              if (id.includes('@ag-grid')) {
                return 'grid-vendor'
              }
              // All other node_modules in one vendor chunk
              return 'vendor'
            }
            // Let pages/components stay as individual chunks for optimal lazy loading
            // This allows users to only download what they visit
          },
        },
      },
      // Ensure assets are properly referenced
      assetsDir: 'assets',
      // Remove empty chunks
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
      },
      // Ensure single Vue instance across all dependencies
      dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@vue/shared', 'vue-router'],
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vue3-perfect-scrollbar'],
    },
    plugins: [
      vue(),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
      }),
    ],
  }
})
