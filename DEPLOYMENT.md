# Deployment Configuration

## Base Path Configuration

The application automatically detects the deployment environment and sets the correct base path:

- **GitHub Pages**: Automatically uses `/frontend_bushman/` (default)
- **Cloudflare Pages**: Automatically detects and uses `/` (root deployment)
- **Render.com**: Automatically detects and uses `/` (via `render.yaml` or auto-detection)
- **Other deployments**: Can be configured via `VITE_BASE_PATH` environment variable

### Auto-Detection

The build process automatically detects:

- Cloudflare Pages deployments (via `CF_PAGES` environment variable)
- Render.com deployments (via `RENDER` environment variable)
- Falls back to `VITE_BASE_PATH` environment variable if set
- Defaults to `/frontend_bushman/` for GitHub Pages

### Render.com Setup

**Option 1: Using render.yaml (Recommended)**
The `render.yaml` file is configured to automatically set the correct base path. Just deploy as-is.

**Option 2: Manual Environment Variable**

1. Go to your Render.com service settings
2. Navigate to "Environment" section
3. Add environment variable:
   - **Key**: `VITE_BASE_PATH`
   - **Value**: `/`
4. Save and redeploy

**Note**: After updating the configuration, you must **rebuild and redeploy** for the changes to take effect.

**Troubleshooting on Render.com:**

If you're still seeing 404 errors for assets:

1. **Check if render.yaml is being used:**

   - If you created the service manually (not via Blueprint), `render.yaml` won't be used
   - Go to your service settings and manually add `VITE_BASE_PATH=/` in Environment variables

2. **Trigger a fresh build:**

   - In Render.com dashboard: Go to your service → "Manual Deploy" → "Clear build cache & deploy"
   - OR push a new commit to trigger automatic rebuild

3. **Verify the build logs:**

   - Check the build logs in Render.com
   - Look for: `[Vite Config] Base path: /`
   - If you see `Base path: /frontend_bushman/`, the environment variable isn't being picked up

4. **Verify environment variables:**
   - In Render.com service settings → Environment
   - Ensure `VITE_BASE_PATH` is set to `/`
   - Ensure it's set as a Build Environment Variable (not Runtime only)

### Cloudflare Pages Setup

**Automatic Deployment:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your repository
4. **IMPORTANT**: Configure build settings manually:
   - **Framework preset**: Select "None" or "Vite" (if available)
   - **Build command**: `npm run build:ci` ⚠️ **Must be set manually**
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)
   - **Node version**: `20`
   - **Package manager**: Select "npm" ⚠️ **Important - don't use auto-detect**
5. Add environment variables (optional, auto-detected):
   - `VITE_BASE_PATH=/` (not required, auto-detected)
6. Click "Save and Deploy"

**Troubleshooting:**

If you see `yarn run build` error:

- Go to your project settings → Builds & deployments
- Edit the build configuration
- **Change Build command** to: `npm run build:ci`
- **Change Package manager** to: `npm` (explicitly, not auto-detect)
- Save and trigger a new deployment

**Configuration Files:**

- `public/_redirects` - Handles SPA routing (copied to dist during build)
- Cloudflare Pages automatically handles SPA routing via the `_redirects` file

**Note**: Cloudflare Pages automatically detects the base path as `/` for root deployments. No additional configuration needed!

### GitHub Pages

No configuration needed - automatically uses `/frontend_bushman/` base path.

### Local Development

The default base path is used for local development. To test with a different base path:

```bash
VITE_BASE_PATH=/ npm run build
npm run preview
```
