**Tree Shaking** is a dead-code elimination technique used by modern JavaScript bundlers (like Vite, Rollup, Webpack, and Esbuild) to remove unused exports from your final production bundle.

The term comes from the metaphor of shaking a physical tree: dead leaves (unused functions, classes, or variables) fall off, leaving only the living code behind.

---

## 1. How Tree Shaking Works Under the Hood

Tree shaking relies heavily on the static structure of **ES Modules (ESM)** (`import` and `export`).

1. **Static Analysis:** Because `import` and `export` statements must be placed at the top level of files (and cannot be nested inside `if` statements or functions), bundlers can analyze the entire dependency graph **without running the code**.
2. **Marking the Dependency Graph:** The bundler starts at your entry point (e.g., `index.js`), traces every import, and marks functions or variables that are actually referenced.
3. **Dead Code Stripping:** Unmarked (unreferenced) exports are excluded from the output bundle when creating the production build.

```text
┌───────────────────────────────┐
│       mathUtils.js            │
│  - export add()      [USED]   │ ─────┐
│  - export subtract() [UNUSED] │      │  Tree Shaking
│  - export multiply() [UNUSED] │      │  Static Analysis
└───────────────────────────────┘      │  Process
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │    dist/bundle.js         │
                         │  - add() code ONLY        │
                         └───────────────────────────┘

```

---

## 2. Code Example: Before and After Tree Shaking

### Source Files

```javascript
// mathUtils.js - Utility module with 3 exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

```

```javascript
// main.js - Application entry point
import { add } from './mathUtils.js';

console.log(add(5, 10));
// Notice: subtract() and multiply() are NEVER imported or called.

```

---

### Output Bundle (Shaken Production Build)

When a bundler like Rollup or Webpack processes `main.js` in production mode, `subtract` and `multiply` are completely omitted from the generated build file:

```javascript
// dist/bundle.js (Compiled Production Code)
function add(a, b) {
  return a + b;
}

console.log(add(5, 10));

```

The unused functions vanish, keeping bundle sizes small and reducing parse/compile overhead in user browsers.

---

## 3. Why CommonJS (CJS) Prevents Tree Shaking

CommonJS modules (`require()` and `module.exports`) are **dynamic**. Because imports can be conditionally evaluated at runtime, bundlers cannot reliably predict what code is used prior to execution:

```javascript
// ❌ CommonJS cannot be tree-shaken safely
const math = require('./mathUtils');

if (someRuntimeCondition) {
  math.add(1, 2);
}

```

Because `require()` calls can be executed conditionally inside functions or loops, bundlers must include the *entire* `mathUtils` object in the bundle to prevent runtime errors.

---

## 4. Side Effects and the `"sideEffects"` Property

A **side effect** occurs when a module performs an operation that affects the global scope or external state during import—even if none of its exports are explicitly called.

Examples of side effects:

* Modifying `window` or `document` (e.g., polyfills).
* Adding global CSS stylesheets (`import './styles.css'`).
* Modifying global prototypes (e.g., `Array.prototype.customMethod = ...`).

If a module has side effects, a bundler cannot safely delete unused code because running the file's top-level scope is required for the application to function.

### Declaring Side-Effect-Free Code in `package.json`

You can explicitly inform bundlers that your project or library contains no global side effects. This grants bundlers permission to aggressively shake unused imports:

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "sideEffects": false
}

```

If only specific files contain side effects (such as CSS files), supply an array of file patterns:

```json
// package.json
{
  "name": "my-library",
  "sideEffects": [
    "*.css",
    "src/polyfills.js"
  ]
}

```

---

## 5. Writing Tree-Shakable JavaScript (Best Practices)

### 1. Use Named Exports Over Default Export Objects

Exporting a single large object as a default export breaks tree shaking because property accesses on an object cannot easily be statically analyzed.

```javascript
// ❌ BAD: Defeats Tree Shaking
export default {
  add(a, b) { return a + b; },
  multiply(a, b) { return a * b; }
};

```

```javascript
// ✅ GOOD: Tree-shakable Named Exports
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

```

---

### 2. Avoid Object Mutation Side Effects at Top Level

Avoid mutating state or running functions at the top level of a module scope:

```javascript
// ❌ BAD: Prevents tree-shaking because top-level function runs on import
export const data = initializeGlobalConfig(); 

```

```javascript
// ✅ GOOD: Defer execution until invoked inside application logic
export function getConfig() {
  return initializeGlobalConfig();
}

```

---

### 3. Use Barrel File Re-exports Wisely

"Barrel files" (`index.js` files that re-export multiple sub-modules) can inadvertently pull in unneeded code if re-exported files contain top-level side effects:

```javascript
// utils/index.js
export { add } from './math.js';
export { heavyDataProcessor } from './heavyProcessor.js'; // Might pull in large dependencies

```

Ensuring `"sideEffects": false` in `package.json` enables bundlers to prune unused re-exports from barrel files cleanly.

---

## Summary Matrix

| Metric                     | ES Modules (ESM)                 | CommonJS (CJS)                   |
| -------------------------- | -------------------------------- | -------------------------------- |
| **Import / Export Syntax** | `import` / `export`              | `require()` / `module.exports`   |
| **Analysis Timing**        | Static (Build-time)              | Dynamic (Runtime)                |
| **Tree Shaking Support**   | ✅ Native & Automatic             | ❌ Restricted / Unsupported       |
| **Bundle Impact**          | Minimal (Only imports used code) | Larger (Includes entire modules) |

Explain how to analyze JavaScript bundle sizes with visualizers in Vite and Webpack with code examples
Analyzing JavaScript bundle sizes is crucial for identifying bloated dependencies, accidental duplicate imports, and un-tree-shaken libraries. Visualizers generate interactive treemaps where each block represents a file in your build—the bigger the block, the more byte size it consumes.

---

## 1. Vite & Rollup (`rollup-plugin-visualizer`)

Vite uses Rollup for its production build process. The most effective tool for visualizing a Vite bundle is **`rollup-plugin-visualizer`**.

### Step 1: Install the plugin

```bash
npm install -D rollup-plugin-visualizer

```

### Step 2: Configure `vite.config.js`

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // Add visualizer as the last plugin in the array
    visualizer({
      filename: './dist/stats.html', // Output file path
      open: true,                     // Automatically opens the chart in default browser after build
      gzipSize: true,                 // Displays size after gzip compression
      brotliSize: true,               // Displays size after Brotli compression
      template: 'treemap',            // Chart style: 'treemap', 'sunburst', 'network', 'raw-data'
    }),
  ],
});

```

### Step 3: Run the build command

```bash
npm run build

```

Once the build completes, a browser tab will automatically open displaying `dist/stats.html` with an interactive, zoomable visual map of all bundled modules.

---

## 2. Webpack (`webpack-bundle-analyzer`)

For Webpack projects (including Next.js, Create React App, or custom Webpack setups), **`webpack-bundle-analyzer`** is the industry standard plugin.

### Step 1: Install the plugin

```bash
npm install -D webpack-bundle-analyzer

```

### Step 2: Configure `webpack.config.js`

```javascript
// webpack.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',          // Generates a static HTML file
      reportFilename: 'bundle-report.html', // Output filename inside dist folder
      openAnalyzer: true,              // Opens the report automatically in the browser
      generateStatsFile: false,        // Set to true if you need JSON output for CI tools
      defaultSizes: 'gzip',            // Options: 'stat', 'parsed', 'gzip'
    }),
  ],
};

```

### Step 3: Run the build command

```bash
npx webpack

```

---

## 3. Webpack Bundle Analyzer with Next.js

Next.js has built-in integration via `@next/bundle-analyzer`.

### Step 1: Install `@next/bundle-analyzer`

```bash
npm install -D @next/bundle-analyzer

```

### Step 2: Configure `next.config.js`

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextType} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withBundleAnalyzer(nextConfig);

```

### Step 3: Run conditional build

```bash
ANALYZE=true npm run build

```

This triggers the creation of two separate visualizer pages—one for server-side JavaScript chunks and one for client-side JavaScript chunks.

---

## 4. How to Interpret Visualizer Reports

When looking at a treemap, focus on three primary size metrics:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Stat Size     │ Original code size on disk before minification/bundling│
├───────────────┼────────────────────────────────────────────────────────┤
│ Parsed Size   │ Output size after Terser minification & tree-shaking   │
│               │ (Actual JS the browser parses)                         │
├───────────────┼────────────────────────────────────────────────────────┤
│ Gzip Size     │ Size transferred over the network after web server     │
│               │ Gzip compression                                       │
└────────────────────────────────────────────────────────────────────────┘

```

### Key Red Flags to Spot in Treemaps

1. **Large `node_modules` Blocks:** Libraries like `lodash`, `moment.js`, or `three.js` occupying huge rectangles.

* *Fix:* Swap `moment` for `date-fns` or `dayjs`, or replace full `lodash` with modular imports (`import debounce from 'lodash/debounce'`).

1. **Duplicated Packages:** Multiple versions of the same library (e.g., `lodash v4.17` and `lodash v4.15`) bundled simultaneously due to conflicting peer dependencies.

* *Fix:* Use `npm dedupe` or Yarn resolutions / pnpm overrides.

1. **Un-tree-shaken Third-Party Modules:** Modules importing an entire library when only one utility function is needed.

---

## 5. Integrating Bundle Checks into Continuous Integration (CI)

To prevent developers from accidentally introducing bloated dependencies in PRs, use **`bundlesize`** or **`bundlewatch`** in GitHub Actions:

```json
// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "150 kB"
    }
  ],
  "scripts": {
    "test:bundle": "bundlesize"
  }
}

```

Explain how Tree Shaking works in modern JavaScript bundlers with code examples

**Tree Shaking** is a dead-code elimination technique used by modern JavaScript bundlers (such as Vite, Rollup, Webpack, Esbuild, and Rspack) to remove unused exports from your final production bundle.

The term comes from the visual metaphor of shaking a tree: unused code (the "dead leaves") falls off, leaving only the living code behind in the final artifact.

---

## 1. How Tree Shaking Works Under the Hood

Tree shaking relies on the static structure of **ES Modules (ESM)** (`import` and `export`).

1. **Static Analysis (AST Parsing):** Because `import` and `export` statements must sit at the top level of files (and cannot be nested inside `if` statements or loops), bundlers parse the code into an Abstract Syntax Tree (AST) to analyze dependencies **without running the code**.
2. **Marking the Dependency Graph:** The bundler starts at your application entry point (e.g., `main.js`), traces every import, and flags only the functions, classes, or variables that are actually referenced.
3. **Dead Code Elimination:** Unmarked (unreferenced) exports are omitted from the final bundle when generating production builds.

```text
┌───────────────────────────────┐
│       mathUtils.js            │
│  - export add()      [USED]   │ ─────┐
│  - export subtract() [UNUSED] │      │  Static Analysis
│  - export multiply() [UNUSED] │      │  & Tree Shaking
└───────────────────────────────┘      │
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │    dist/bundle.js         │
                         │  - add() code ONLY        │
                         └───────────────────────────┘

```

---

## 2. Code Example: Before and After Tree Shaking

### Source Files

```javascript
// mathUtils.js - Utility module with 3 exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

```

```javascript
// main.js - Application entry point
import { add } from './mathUtils.js';

console.log(add(5, 10));
// Note: subtract() and multiply() are never imported or called.

```

---

### Output Bundle (Shaken Production Build)

When a bundler processes `main.js` in production mode, `subtract` and `multiply` are stripped out:

```javascript
// dist/bundle.js (Compiled Production Output)
function add(a, b) {
  return a + b;
}

console.log(add(5, 10));

```

---

## 3. Why CommonJS (CJS) Limits Tree Shaking

CommonJS modules (`require()` and `module.exports`) are evaluated **dynamically at runtime**. Because imports can be conditionally evaluated inside functions or loops, bundlers cannot safely predict what code will be used prior to execution:

```javascript
// ❌ CommonJS cannot be tree-shaken statically
const math = require('./mathUtils');

if (someRuntimeCondition) {
  math.add(1, 2);
}

```

Because `require()` calls can depend on runtime state, bundlers must include the *entire* `mathUtils` object to prevent unexpected runtime errors.

---

## 4. Side Effects and the `"sideEffects"` Flag

A **side effect** occurs when a file performs an action that affects global state during import—even if none of its exported functions are explicitly called.

Examples of side effects:

* Modifying global objects or window prototypes (`window.myGlobal = ...`).
* Importing global CSS stylesheets (`import './styles.css'`).
* Running top-level initialization routines.

If a module has side effects, a bundler cannot safely delete unused code because running the file's top-level scope is required for the application to function.

### Declaring Side-Effect-Free Code in `package.json`

You can explicitly inform bundlers that your library contains no global side effects, allowing more aggressive dead-code elimination:

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "sideEffects": false
}

```

If specific files do contain side effects (such as CSS files), specify them using an array:

```json
// package.json
{
  "name": "my-library",
  "sideEffects": [
    "*.css",
    "src/polyfills.js"
  ]
}

```

---

## 5. Best Practices for Writing Tree-Shakable Code

1. **Prefer Named Exports Over Default Export Objects:** Exporting a single default object forces bundlers to include the whole object, whereas named exports allow granular selection.

```javascript
// ❌ BAD: Defeats granular tree-shaking
export default { add, subtract, multiply };

// ✅ GOOD: Granular, tree-shakable exports
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

```

1. **Avoid Top-Level Function Execution:** Keep module scopes free of top-level mutations or function calls.
2. **Use ESM Packages:** Ensure third-party libraries ship ES Module builds (often indicated via the `"module"` key in `package.json`).

---

## Summary Comparison

| Metric                     | ES Modules (ESM)                     | CommonJS (CJS)                   |
| -------------------------- | ------------------------------------ | -------------------------------- |
| **Import / Export Syntax** | `import` / `export`                  | `require()` / `module.exports`   |
| **Analysis Phase**         | Static (Build-time)                  | Dynamic (Runtime)                |
| **Tree Shaking Support**   | ✅ Native & Automatic                 | ❌ Restricted / Unsupported       |
| **Bundle Impact**          | Minimal (Ships only referenced code) | Larger (Includes entire modules) |
