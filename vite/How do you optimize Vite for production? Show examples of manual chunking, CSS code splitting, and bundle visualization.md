Optimizing Vite for production involves fine-tuning its underlying production bundler (**Rollup**). By leveraging manual code-splitting, tree-shaking, CSS optimizations, asset compression, and bundle analysis, you can significantly lower Initial Page Load times and First Contentful Paint (FCP).

---

### Production Optimization Checklist

```text
┌────────────────────────────────────────────────────────┐
│ 1. VISUALIZE & ANALYZE BUNDLE                          │
│    Identify heavy third-party packages                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. MANUAL CHUNKING                                     │
│    Split vendor libs into vendor-specific chunks       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. ASSET & CSS OPTIMIZATION                            │
│    CSS code splitting, image optimization, minification│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. PRE-COMPRESSION                                     │
│    Gzip / Brotli pre-rendering                         │
└────────────────────────────────────────────────────────┘

```

---

### 1. Bundle Visualization (`rollup-plugin-visualizer`)

Before optimizing, inspect what is taking up space in your production output using `rollup-plugin-visualizer`.

#### Step 1: Install the plugin

```bash
npm install --save-dev rollup-plugin-visualizer

```

#### Step 2: Configure inside `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html', // Output report path
      open: true,                   // Automatically open in browser after build
      gzipSize: true,               // Show compressed size
      brotliSize: true,             // Show brotli size
    }),
  ],
});

```

When you run `npm run build`, an interactive treemap HTML report opens showing the exact size contribution of every module inside `node_modules`.

---

### 2. Manual Chunking (`manualChunks`)

By default, Rollup bundles all vendor code into a single massive `vendor.js` file or creates fragmented chunks. You can group large dependencies (e.g., React core, UI libraries, chart engines) into distinct cached chunks.

#### Option A: Explicit Vendor Chunking (Recommended)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate node_modules into distinct chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'; // React core chunk
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui'; // UI library chunk
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts'; // Heavy visualization chunk
            }
            return 'vendor-others'; // All other npm dependencies
          }
        },
      },
    },
  },
});

```

#### Option B: Automated Granular Chunking (`renderBuiltUrl` / Object Mapping)

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['lodash-es', 'axios', 'dayjs'],
        },
      },
    },
  },
});

```

---

### 3. CSS Code Splitting & Asset Optimization

Vite automatically extracts CSS imported by async JS chunks into separate CSS files. You can fine-tune asset thresholds and CSS minification settings:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Enable CSS code splitting (Default is true)
    cssCodeSplit: true,

    // Minify CSS using lightningcss or esbuild (default is esbuild)
    cssMinify: 'esbuild',

    // Inline assets smaller than 4kb as base64 URLs to reduce HTTP requests
    assetsInlineLimit: 4096, // 4 KB

    // Target modern browsers for smaller JS output (no unnecessary polyfills)
    target: 'es2022',

    // Clean up console logs in production builds
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
});

```

---

### 4. Build Pre-Compression (Gzip & Brotli)

Pre-compress static assets (`.js`, `.css`, `.svg`, `.html`) during the build step using `vite-plugin-compression`. This offloads real-time compression work from servers like Nginx or AWS S3.

#### Step 1: Install the compression plugin

```bash
npm install --save-dev vite-plugin-compression

```

#### Step 2: Configure in `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // Generate .gz files
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Generate .br (Brotli) files for modern browsers
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
});

```

---

### Complete Production `vite.config.ts` Blueprint

Here is a consolidated, production-ready Vite configuration combining all best practices:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      // Pre-compress static files
      viteCompression({ algorithm: 'gzip', ext: '.gz' }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
      // Run visualizer only when explicitly requested
      isAnalyze &&
        visualizer({
          filename: './dist/stats.html',
          open: true,
          gzipSize: true,
        }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      target: 'es2022',
      outDir: 'dist',
      assetsInlineLimit: 4096, // 4KB inline limit
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500, // Trigger warning if a chunk exceeds 500 kB

      rollupOptions: {
        output: {
          // Custom naming format for clear cache busting
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

          // Custom Manual Chunking
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lodash-es') || id.includes('axios')) {
                return 'vendor-utils';
              }
            }
          },
        },
      },
    },
  };
});

```

To generate and inspect bundle analytics on demand, add this script to `package.json`:

```json
"scripts": {
  "build": "tsc && vite build",
  "build:analyze": "tsc && vite build --mode analyze"
}

```
