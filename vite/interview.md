Here is a curated list of top **Vite** interview questions, organized from core fundamentals to advanced architectural concepts, complete with clear, technical answers.

---

### 1. Core Concepts & Architecture

#### Q1: What is Vite, and why is it so much faster than traditional bundlers like Webpack?

**Answer:**
Vite (French for "fast") is a modern frontend build tool created by Evan You. It achieves its speed by dividing the development lifecycle into two distinct phases:

1. **Development Server:** Instead of bundling the entire app before serving (like Webpack), Vite leverages **Native ES Modules (ESM)** in modern browsers. It serves source code on-demand. When a browser requests a module via `import`, Vite transforms and serves that specific file.
2. **Pre-bundling Dependencies:** Vite uses **esbuild** (written in Go) to pre-bundle third-party dependencies (`node_modules`) into single ESM files. `esbuild` is 10–100x faster than JavaScript-based bundlers.

#### Q2: What is Dependency Pre-bundling in Vite, and why is it necessary?

**Answer:**
During cold start, Vite pre-bundles dependencies using `esbuild` for two reasons:

1. **CommonJS/UMD to ESM Conversion:** Many npm packages are still published in CommonJS format. Browsers cannot load CommonJS natively, so Vite converts them to ESM.
2. **Performance (HTTP Request Reduction):** Libraries like `lodash-es` contain hundreds of tiny ESM files. If left un-bundled, requesting a single import would trigger 600+ nested HTTP requests. Vite pre-bundles them into a single file so only one request is needed.

#### Q3: How does Hot Module Replacement (HMR) differ in Vite versus Webpack?

**Answer:**

* **Webpack:** When a file is modified, Webpack re-bundles affected module chains and updates its internal dependency graph, which slows down as the app grows larger.
* **Vite:** Vite performs HMR over native ESM. When a file changes, Vite invalidates only the updated module and sends a precise request to the browser to re-import just that file. The HMR speed remains constant regardless of the size of the application.

---

### 2. Configuration & Features

#### Q4: How does Vite handle environment variables differently than Webpack or CRA?

**Answer:**

* **Prefixing:** Vite requires client-side environment variables to be prefixed with `VITE_` (e.g., `VITE_API_URL`). Variables without this prefix are omitted to avoid leaking sensitive server credentials.
* **Accessing Variables:** Instead of `process.env`, Vite exposes environment variables via `import.meta.env`:
* `import.meta.env.MODE` (e.g., `development`, `production`)
* `import.meta.env.PROD` / `import.meta.env.DEV`
* `import.meta.env.VITE_API_URL`

#### Q5: What is the difference between `esbuild` and `Rollup` in Vite's architecture?

**Answer:**
Vite uses two different tools for dev vs. production:

* **esbuild (Development):** Used for dependency pre-bundling and fast TypeScript/JSX transpilation during development. It is omitted for production bundling because its CSS splitting and plugin ecosystem are not yet as flexible as Rollup's.
* **Rollup (Production):** Used for production builds (`vite build`). Rollup generates highly optimized production bundles with tree-shaking, code-splitting, lazy loading, and CSS extraction.

#### Q6: How do path aliases (e.g., `@/components`) work in Vite?

**Answer:**
Path aliases are configured inside `vite.config.js` using the `resolve.alias` option:

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

```

*Note: If using TypeScript, you must also sync `tsconfig.json` paths.*

---

### 3. Advanced & Production Scenarios

#### Q7: How do you configure a Reverse Proxy in Vite for handling CORS during development?

**Answer:**
Use the `server.proxy` configuration in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

```

#### Q8: How does code-splitting and dynamic imports work in Vite?

**Answer:**
Vite supports native dynamic `import()` statements out of the box. During production builds, Rollup automatically splits dynamically imported files into separate JavaScript chunks:

```javascript
// Automatically split into a separate dynamic chunk
const HeavyChart = React.lazy(() => import('./HeavyChart'));

```

Additionally, Vite provides **`import.meta.glob`** to dynamically import multiple modules at once from the file system:

```javascript
// Glob import for dynamic routing or dynamic translations
const modules = import.meta.glob('./pages/*.jsx');

```

#### Q9: Does Vite perform type checking during build? How do you handle TypeScript errors?

**Answer:**
No. **Vite transpiles TypeScript using esbuild without performing full type checking** to keep development and build speeds extremely high.

To enforce type safety before a production deployment:

1. Run `tsc --noEmit` as part of your build script (`"build": "tsc --noEmit && vite build"`).
2. Use plugins like `vite-plugin-checker` to display TypeScript errors directly in the browser overlay during development.

---

### Summary Cheat Sheet for Interviews

| Feature            | Development Mode                   | Production Mode             |
| ------------------ | ---------------------------------- | --------------------------- |
| **Bundler Engine** | Native ESM + esbuild               | Rollup                      |
| **HMR**            | Native ESM module invalidation     | Bundled static assets       |
| **Type Checking**  | Stripped via esbuild (No checking) | Handled via `tsc` script    |
| **Env Variables**  | `import.meta.env.VITE_*`           | Inlined during Rollup build |
