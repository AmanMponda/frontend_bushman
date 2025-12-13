# Deployment Configuration

## Base Path Configuration

The application automatically detects the deployment environment and sets the correct base path:

- **GitHub Pages**: Automatically uses `/frontend_bushman/` (default)
- **Render.com**: Automatically detects and uses `/` (via `render.yaml` or auto-detection)
- **Other deployments**: Can be configured via `VITE_BASE_PATH` environment variable

### Auto-Detection

The build process automatically detects:

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

### GitHub Pages

No configuration needed - automatically uses `/frontend_bushman/` base path.

### Local Development

The default base path is used for local development. To test with a different base path:

```bash
VITE_BASE_PATH=/ npm run build
npm run preview
```
