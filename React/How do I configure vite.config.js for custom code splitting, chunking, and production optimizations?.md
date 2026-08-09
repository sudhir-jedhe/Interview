Configuring Vite for production optimization involves customizing its underlying bundler, **Rollup**, via the `build.rollupOptions` setting in `vite.config.js`.

Here is a complete, production-ready configuration covering **custom code splitting**, **manual chunking strategies**, **terser minification**, and **asset optimization**.

---

### Complete `vite.config.js` Setup

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    // 1. Output directory
    outDir: 'dist',

    // 2. Target modern browsers for smaller, faster bundles
    target: 'es2022',

    // 3. Minification strategy ('esbuild' is faster, 'terser' provides slightly smaller builds)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // 4. Adjust chunk size warning limit (in kB)
    chunkSizeWarningLimit: 800,

    // 5. CSS Code Splitting (splits CSS per JS chunk)
    cssCodeSplit: true,

    // 6. Rollup Specific Bundling Configuration
    rollupOptions: {
      output: {
        // A. Custom Manual Chunking Strategy
        manualChunks(id) {
          // Vendor Chunking: Group heavy npm dependencies separately
          if (id.includes('node_modules')) {
            // Group React core together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Group Redux / State management together
            if (id.includes('@reduxjs') || id.includes('redux')) {
              return 'vendor-redux';
            }
            // Group heavy UI or chart libraries separately
            if (id.includes('chart.js') || id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Default chunk for all other node_modules
            return 'vendor-others';
          }
        },

        // B. Consistent & Clean Asset File Naming
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});

```

---

### Detailed Breakdown of Key Optimizations

#### 1. Custom Manual Chunking (`manualChunks`)

By default, Rollup bundles node modules based on how components import them. By defining a custom `manualChunks` function, you can isolate core vendor packages (like `react` or `redux`) into dedicated `.js` files.

* **Why?** Vendor libraries rarely change compared to your application code. Separate vendor chunks allow browsers to **cache them long-term**, reducing download times on subsequent site visits.

#### 2. Minification with Terser (`drop_console`)

Setting `minify: 'terser'` allows you to pass custom compression rules via `terserOptions`. Dropping `console.log` statements removes debug bloat and prevents leaking internal data in production dev tools.

> **Note:** Ensure `terser` is installed in your project:
>
> ```bash
> npm install -D terser
> 
> ```
>
>

#### 3. Structured Asset File Naming

By default, Vite dumps all generated CSS, JS, and image assets into a single `dist/assets` folder. Configuring `entryFileNames`, `chunkFileNames`, and `assetFileNames` organizes output assets into clean subdirectories (`assets/js/`, `assets/css/`, `assets/images/`), which simplifies CDN deployment and caching rules.

---

### Step 2: Combine with Dynamic Imports in Code

`vite.config.js` handles **vendor chunking**, but application-level route/feature code-splitting requires **dynamic imports** (`import()`) and `React.lazy()` inside your application code.

```jsx
// src/app/router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// These components will automatically be split into separate route chunks by Vite
const Dashboard = lazy(() => import('../features/dashboard/DashboardPage'));
const Analytics = lazy(() => import('../features/analytics/AnalyticsPage'));

export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: '/analytics',
    element: (
      <Suspense fallback={<div>Loading Analytics...</div>}>
        <Analytics />
      </Suspense>
    ),
  },
]);

```

---

### Step 3: Analyze Your Bundle Size

To verify that your custom code splitting and chunking configuration is working, install the **`rollup-plugin-visualizer`** plugin. It generates an interactive visual map of your final production build.

1. **Install the plugin:**

```bash
npm install -D rollup-plugin-visualizer

```

1. **Add to `vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true, // Automatically opens the visualizer chart in your browser after build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  // ... build config
});

```

1. **Run `npm run build**` to generate `stats.html` and inspect your chunks visually.

Managing assets, environment configurations, caching, and source maps cleanly requires a structured strategy across your project architecture and build configuration (e.g., using **Vite** or **Webpack**).

Here is a comprehensive breakdown for managing white-label/theme-based assets, environment settings, caching, and debugging.

---

## 1. Asset Management (Images, Fonts, Static Assets)

For a **white-label application** (multi-tenant/theme architecture), you need to inject client-specific assets (logos, favicons, fonts, color themes) without duplicating your application logic.

### Recommended Directory Structure

```text
src/
├── assets/                  # Shared/default fallback static assets
│   ├── fonts/
│   └── images/
├── config/                  # White-label branding configurations
│   ├── themes/
│   │   ├── clientA.ts
│   │   ├── clientB.ts
│   │   └── default.ts
│   └── index.ts
public/
└── clients/                 # Tenant-specific static assets
    ├── clientA/
    │   ├── logo.svg
    │   └── favicon.ico
    └── clientB/
        ├── logo.svg
        └── favicon.ico

```

### Strategy A: Public Path Dynamic Ingestion (Static Assets)

Place client-specific files inside `public/clients/[CLIENT_NAME]/`.

During build/development, read the active client from an environment variable:

```html
<!-- index.html -->
<link rel="icon" href="/clients/%VITE_CLIENT_APP%/favicon.ico" />

```

In your React components, construct asset paths cleanly using an asset helper utility:

```typescript
// utils/assetLoader.ts
const CLIENT = import.meta.env.VITE_CLIENT_APP || 'default';

export const getClientAsset = (relativePath: string) => {
  return `/clients/${CLIENT}/${relativePath}`;
};

// Usage in Component:
<img src={getClientAsset('logo.svg')} alt="Client Logo" />

```

### Strategy B: Dynamic CSS Variables & Web Fonts (Theme Styling)

Load white-label theme configurations (colors, font families) dynamically via CSS variables at runtime or compile-time:

```typescript
// config/themes/clientA.ts
export const clientATheme = {
  primaryColor: '#0052CC',
  fontFamily: "'Roboto', sans-serif",
  fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
};

```

Inject fonts and CSS variables dynamically on application mount:

```typescript
// hooks/useWhiteLabelTheme.ts
import { useEffect } from 'react';

export const useWhiteLabelTheme = (themeConfig) => {
  useEffect(() => {
    // 1. Inject CSS variables
    document.documentElement.style.setProperty('--primary-color', themeConfig.primaryColor);
    document.documentElement.style.setProperty('--main-font', themeConfig.fontFamily);

    // 2. Inject Font stylesheet dynamically
    if (themeConfig.fontUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = themeConfig.fontUrl;
      document.head.appendChild(link);
    }
  }, [themeConfig]);
};

```

---

## 2. Environment-Specific Configurations

Separating **development** and **production** configurations while supporting multiple white-label targets requires combining `.env` files with a typed configuration module.

### A. Environment Files Setup

Create target-specific `.env` files:

```text
.env.development.clientA  # Dev mode for Client A
.env.production.clientA   # Production build for Client A
.env.production.clientB   # Production build for Client B

```

**`.env.production.clientA`**:

```ini
VITE_CLIENT_APP=clientA
VITE_API_BASE_URL=https://api.clienta.com
VITE_ENABLE_ANALYTICS=true

```

### B. Typed Configuration Abstraction

Never read `import.meta.env` or `process.env` directly inside application components. Route all environment variables through a single validated configuration layer (e.g., using `zod` for type safety):

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  clientApp: z.string(),
  apiBaseUrl: z.string().url(),
  enableAnalytics: z.string().transform((val) => val === 'true'),
});

export const config = envSchema.parse({
  clientApp: import.meta.env.VITE_CLIENT_APP,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS,
});

```

### C. Build Scripts (`package.json`)

Pass custom mode flags during builds:

```json
"scripts": {
  "dev:clientA": "vite --mode development.clientA",
  "build:clientA": "vite build --mode production.clientA",
  "build:clientB": "vite build --mode production.clientB"
}

```

---

## 3. Production Caching Strategies

Effective production caching involves leveraging **browser cache controls**, **content hashing**, and **CDNs**.

### A. Content Hashing (Cache Busting)

Configure your bundler (Vite/Rollup or Webpack) to include unique content hashes in output filenames. When application code changes, the filename changes, forcing browsers to download the fresh asset while serving unchanged files from local disk cache.

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});

```

### B. Server Cache-Control Headers (Nginx / Cloudflare / AWS S3)

Configure your web server or CDN with two distinct caching policies:

1. **Immutable Assets (`/assets/*`) - Cache Forever:**
Since JS/CSS files contain unique `[hash]` values in their filenames, instruct the browser to cache them indefinitely.

```http
Cache-Control: public, max-age=31536000, immutable

```

1. **Entry Document (`index.html`) - Never Cache:**
`index.html` points to the hashed assets. It must **never** be cached permanently so users instantly receive references to new asset hashes upon deployment.

```http
Cache-Control: no-cache, no-store, must-revalidate

```

---

## 4. Source Mapping for Debugging

Source maps bridge compiled, minified production JavaScript back to your original TypeScript/React code for debugging runtime errors.

### A. Development Source Maps

Use cheap, high-speed source maps that update instantly during development:

```javascript
// vite.config.js
export default defineConfig({
  css: { devSourcemap: true },
  build: {
    sourcemap: 'eval', // Fast dev rebuilding
  },
});

```

### B. Production Source Maps (Secure Debugging)

Exposing public `.map` files in production allows anyone to inspect your raw source code. Use one of these two secure strategies:

#### Option 1: Hidden Source Maps + Error Tracking (Sentry / LogRocket)

Generate source maps during production build, upload them automatically to an error monitoring tool (like Sentry), and delete the `.map` files from the final web host deployment.

```javascript
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: 'hidden', // Generates .map files without comments inside bundle JS
  },
});

```

* **CI/CD Deployment Step:**

1. Run `npm run build`.
2. Upload `.map` files to Sentry via `@sentry/vite-plugin`.
3. Run `rm dist/**/*.map` before deploying `dist/` to your public server/S3 bucket.

#### Option 2: Private / Internal Source Maps

If your team needs to debug live production environments using browser DevTools, restrict access to `.map` files at the server/CDN level so only internal company IP addresses or authenticated sessions can download them.

---

## Summary Matrix

| Domain                      | Best Practice Strategy                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| **White-Label Assets**      | Use tenant sub-folders in `public/clients/` + dynamic CSS variables for theme fonts/colors.       |
| **Environment Configs**     | Mode-specific `.env` files (`.env.production.clientA`) validated through Zod config abstractions. |
| **Production Caching**      | Long-term `Cache-Control: immutable` on hashed JS/CSS assets; `no-cache` on `index.html`.         |
| **Debugging / Source Maps** | Use `sourcemap: 'hidden'`, upload maps to Sentry, and purge them from public deployments.         |

Implementing a white-label architecture in **Vite** is significantly simpler, faster, and requires less boilerplate code than Webpack due to Vite's native ES module support, built-in `.env` mode resolution, and fast Rollup-based bundler.

Here is how to implement each equivalent concept—**Configuration Modules**, **Module Resolution**, **Module Federation**, **Build Manifests**, and **HMR**—using Vite.

---

### 1. Configuration Modules & Environment Modes

Vite uses **Modes** to load specific `.env` files automatically. You can use `defineConfig` as a function that receives `{ mode, command }` to dynamically load client-specific configurations.

#### Folder Structure

```text
config/
└── clients/
    ├── clientA.ts
    └── clientB.ts
.env.development.clientA
.env.production.clientA
vite.config.ts

```

#### `.env.production.clientA`

```ini
VITE_CLIENT=clientA
VITE_API_URL=https://api.clienta.com

```

#### `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the active mode (e.g. production.clientA)
  const env = loadEnv(mode, process.cwd(), '');
  const client = env.VITE_CLIENT || 'default';

  return {
    plugins: [react()],
    
    // Pass dynamic variables to client code
    define: {
      __APP_CLIENT__: JSON.stringify(client),
    },

    server: {
      port: 3000,
      open: true,
    },
  };
});

```

---

### 2. Module Resolution & Aliases (`resolve.alias`)

To dynamically fall back to a default theme or core component if a client-specific asset/component does not exist, configure path aliases in `vite.config.ts`.

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const client = env.VITE_CLIENT || 'default';

  // Check if a client-specific directory exists
  const clientDir = path.resolve(__dirname, `./src/clients/${client}`);
  const hasClientOverride = fs.existsSync(clientDir);

  return {
    plugins: [react()],
    resolve: {
      alias: [
        // 1. Direct path alias for client assets
        {
          find: '@brand-assets',
          replacement: hasClientOverride
            ? path.resolve(__dirname, `./src/clients/${client}/assets`)
            : path.resolve(__dirname, './src/core/assets'),
        },
        // 2. Direct component override alias
        {
          find: '@components',
          replacement: path.resolve(__dirname, './src/components'),
        },
      ],
    },
  };
});

```

#### Usage in Code

```typescript
// Resolves to src/clients/clientA/assets/logo.svg if present, otherwise src/core/assets/logo.svg
import logo from '@brand-assets/logo.svg';

```

---

### 3. Module Federation in Vite

In Vite, you can use `@module-federation/vite` (or `@originjs/vite-plugin-federation`) to expose or consume remote micro-frontends at runtime.

#### Install Plugin

```bash
npm install -D @module-federation/vite

```

#### A. Host Container (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'core_shell',
      remotes: {
        client_theme: {
          type: 'module',
          name: 'client_theme',
          entry: 'http://localhost:3001/remoteEntry.js',
        },
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'chrome89', // Target modern ES modules for top-level await support
  },
});

```

#### B. Client Remote (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'client_theme',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/components/Header',
        './Theme': './src/theme',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});

```

---

### 4. Manifest Generation (`build.manifest`)

Vite has **native support** for generating a manifest file without requiring third-party plugins. Turning on `build.manifest` outputs a `.vite/manifest.json` file in your output directory, mapping original source paths to their hashed production filenames.

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Generates .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});

```

#### Sample Output (`dist/.vite/manifest.json`)

```json
{
  "src/main.tsx": {
    "file": "assets/js/main-B7PI925R.js",
    "src": "src/main.tsx",
    "isEntry": true,
    "css": ["assets/css/main-ChJ_j-JJ.css"]
  }
}

```

---

### 5. Hot Module Replacement (HMR) & Fast Refresh

Unlike Webpack, Vite **does not require complex HMR plugin configuration**.

* HMR works out-of-the-box using Vite's native ES Module server and `@vitejs/plugin-react` (which uses React Fast Refresh internally).
* Edits to React components or CSS variables update near-instantly without destroying application state.

---

### Summary Build Scripts (`package.json`)

To run or build your white-label Vite application for different clients, pass the mode parameter in your npm scripts:

```json
"scripts": {
  "dev:clientA": "vite --mode development.clientA",
  "dev:clientB": "vite --mode development.clientB",
  "build:clientA": "vite build --mode production.clientA",
  "build:clientB": "vite build --mode production.clientB"
}

```
