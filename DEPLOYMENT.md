# Deployment Configuration

## Base Path Configuration

The application uses a configurable base path for different deployment environments.

### Environment Variable

Set `VITE_BASE_PATH` environment variable before building:

- **GitHub Pages**: `VITE_BASE_PATH=/frontend_bushman/` (default)
- **Render.com**: `VITE_BASE_PATH=/`
- **Other root deployments**: `VITE_BASE_PATH=/`

### Render.com Setup

1. Go to your Render.com service settings
2. Navigate to "Environment" section
3. Add environment variable:
   - **Key**: `VITE_BASE_PATH`
   - **Value**: `/`
4. Save and redeploy

### GitHub Pages

No configuration needed - uses default `/frontend_bushman/` base path.

### Local Development

The default base path is used for local development. To test with a different base path:

```bash
VITE_BASE_PATH=/ npm run build
npm run preview
```
