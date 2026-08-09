To debug production errors effectively with full, un-minified stack traces in Sentry without exposing your source code to the public, you need to **generate sourcemaps during build, upload them directly to Sentry, and then delete them before deploying your build artifacts**.

Here is the step-by-step production setup using Webpack and Sentry's official plugin.

---

### Security Strategy Overview

```text
┌────────────────────────────────────────────────────────┐
│ 1. Webpack Build                                       │
│    Generates output bundle + .map files                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Sentry Webpack Plugin                               │
│    Uploads .map files directly to Sentry's server      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Post-Build Cleanup                                  │
│    Deletes .map files from build/dist folder           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Production Deployment                               │
│    Deploys bundle WITHOUT public sourcemaps            │
└────────────────────────────────────────────────────────┘

```

---

### Step 1: Install Dependencies

Install the official Sentry Webpack plugin alongside your core Sentry React SDK:

```bash
npm install --save @sentry/react
npm install --save-dev @sentry/webpack-plugin

```

---

### Step 2: Configure Webpack (`webpack.config.js`)

In your production Webpack configuration, set `devtool` to `'source-map'` so full sourcemaps are created, and configure `@sentry/webpack-plugin` to upload them during the build.

```javascript
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = {
  // 1. Enable standard hidden sourcemaps for production build
  // 'hidden-source-map' generates .map files but omits the //# sourceMappingURL comment in .js files
  devtool: 'hidden-source-map',

  plugins: [
    // 2. Add Sentry plugin to upload sourcemaps automatically
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      
      release: {
        name: process.env.SENTRY_RELEASE || 'my-app@1.0.0', // Ensure this matches Sentry.init() release
      },

      // Automatically removes sourcemaps from local build dir after uploading
      sourcemaps: {
        assets: './dist/**', // Path to your built JS and map files
        filesToDeleteAfterUpload: ['./dist/**/*.map'], // DELETES .map files locally after upload!
      },
    }),
  ],
};

```

> **Key Setting — `devtool: 'hidden-source-map'`:**
> Unlike standard `'source-map'`, `'hidden-source-map'` generates `.js.map` files, but **does not append the `//# sourceMappingURL=...` comment** to the bottom of JS bundles. Even if a `.map` file accidentally slipped onto your server, browsers wouldn't automatically download or look for it.

---

### Step 3: Configure Environment Variables

Create a `.env` file (or set environment variables in your CI/CD runner like GitHub Actions) with a Sentry Auth Token that has **`project:releases`** and **`org:read`** permissions:

```env
SENTRY_AUTH_TOKEN=sntrys_your_auth_token_here
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
SENTRY_RELEASE=my-app@1.0.0

```

---

### Step 4: Initialize Sentry in React Application (`index.js` / `App.js`)

Ensure the `release` name in your runtime initialization matches the release name passed to Webpack:

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://your-dsn-key@o000.ingest.sentry.io/000000',
  release: process.env.REACT_APP_SENTRY_RELEASE || 'my-app@1.0.0', // Must match Webpack release
  integrations: [Sentry.browserTracingIntegration()],
  
  // Performance Monitoring
  tracesSampleRate: 0.2, // 20% of transactions
});

```

---

### Step 5: (Alternative) Fallback Cleanup Script

If you are using Create React App (CRA) or a custom setup where `filesToDeleteAfterUpload` is not supported, you can manually delete `.map` files using a build hook in `package.json`:

#### Installing `rimraf`

```bash
npm install --save-dev rimraf

```

#### Updating `package.json`

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "postbuild": "rimraf dist/**/*.map"
  }
}

```

---

### Verification Checklist

To confirm sourcemaps are working securely in production:

1. **Verify Source Code Protection:** Inspect your production deployment using Chrome DevTools $\rightarrow$ **Sources Tab**. You should see minified, obfuscated JavaScript (`bundle.js`) without readable JSX/TypeScript source files.
2. **Verify 404 on Map Requests:** Try requesting `[https://yourdomain.com/static/js/main.js.map](https://yourdomain.com/static/js/main.js.map)` in your browser. It should return a **`404 Not Found`**.
3. **Verify Sentry De-anonymization:** Cause a deliberate error in production. In your Sentry dashboard under **Issues**, open the error and verify that the stack trace points directly to unminified JSX/TypeScript source code lines (e.g., `src/components/UserProfile.tsx:42`).
