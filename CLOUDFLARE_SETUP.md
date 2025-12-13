# Cloudflare Pages Setup - IMPORTANT

## Current Issue

The build is failing because Cloudflare Pages is trying to use `yarn run build` instead of `npm run build:ci`.

## Fix Required

You **MUST** update the build command in the Cloudflare Pages dashboard:

### Steps:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → Select your project
3. Go to **Settings** → **Builds & deployments**
4. Scroll to **Build configuration**
5. Click **Edit configuration** or the pencil icon
6. Change the following:

   **Build command:**

   ```
   npm run build:ci
   ```

   (Currently it's set to: `yarn run build` ❌)

   **Package manager:**
   Select **npm** explicitly (not "Auto-detect")

7. **Save changes**
8. Go to **Deployments** tab
9. Click **Retry deployment** on the failed deployment (or it will auto-retry)

## Verification

After updating, check the build logs. You should see:

```
Executing user build command: npm run build:ci
```

Instead of:

```
Executing user build command: yarn run build  ❌
```

## Why This Happens

Cloudflare Pages might auto-detect Yarn if:

- Framework preset was set to something that uses Yarn
- Auto-detect selected Yarn
- Build command wasn't set explicitly

The fix is to **explicitly set npm** in the dashboard settings.
