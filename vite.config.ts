import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { vuestic } from '@vuestic/compiler/vite'

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
    process.env.CI === 'true' && !!process.env.CF_PAGES_URL

  // Use '/' for Cloudflare Pages, Render.com, or if explicit VITE_BASE_PATH is set
  // Otherwise default to '/frontend_bushman/' for GitHub Pages
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
      sourcemap: true,
      cssCodeSplit: false, // Keep all CSS in a single file for consistent loading
      cssMinify: true, // Minify CSS for production
      minify: 'esbuild', // Use esbuild for faster builds
      rollupOptions: {
        output: {
          // Ensure consistent asset file naming
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/style-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
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
  }
})
