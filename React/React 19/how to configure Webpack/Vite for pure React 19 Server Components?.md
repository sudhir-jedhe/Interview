To configure a pure React 19 Server Components (RSC) environment without frameworks like Next.js, you need a dual-build setup:

1. **A Server Build:** Compiles Server Components into the React Flight stream format (`react-server-dom-webpack/server`).
2. **A Client Build:** Compiles Client Components (`'use client'`) into browser-executable JS bundles and generates a **Client Manifest** that maps server references to client bundle URLs.

Below is the complete configuration guide using **Vite** (recommended for modern setups) and **Webpack**.

---

## Part 1: Configuring Vite for Pure React 19 RSC

Vite uses two separate build configurations (or Vite environment plugins) to emit both client bundles and the server manifest.

### 1. Install Dependencies

```bash
npm install react@^19 react-dom@^19 react-server-dom-webpack@^19
npm install -D vite @vitejs/plugin-react

```

---

### 2. Vite Client Config (`vite.config.client.js`)

The client build bundles all components marked with `'use client'` and outputs a `react-client-manifest.json` file.

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    manifest: true, // Emits manifest mapping modules to built chunks
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

```

---

### 3. Vite Server Config (`vite.config.server.js`)

The server build compiles your React Server Components targeting the `react-server` environment condition.

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/server',
    ssr: 'src/server/index.js', // Server entry point
    target: 'node18',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  ssr: {
    // Force react-server conditions for RSC modules
    target: 'node',
    resolve: {
      conditions: ['react-server', 'node', 'import'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

```

---

### 4. Running the Vite Node Server

Your HTTP server (e.g., Express or Hono) uses `react-server-dom-webpack/server` and the client manifest to stream RSC payloads to the client.

```javascript
// src/server/index.js
import express from 'express';
import React from 'react';
import { renderToPipeableStream } from 'react-server-dom-webpack/server';
import path from 'path';
import fs from 'fs';

const app = express();

// Load the client manifest generated during build
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('dist/client/react-client-manifest.json'), 'utf8')
);

// Serve static client assets
app.use(express.static('dist/client'));

// RSC Streaming Endpoint
app.get('/rsc', async (req, res) => {
  const App = (await import('../components/App.server.js')).default;

  res.setHeader('Content-Type', 'text/x-component');

  // Stream React Server Component tree to Flight format
  const { pipe } = renderToPipeableStream(<App />, manifest);
  pipe(res);
});

app.listen(3000, () => {
  console.log('RSC Server running on http://localhost:3000');
});

```

---

## Part 2: Configuring Webpack 5 for Pure React 19 RSC

If you prefer Webpack, use `react-server-dom-webpack/plugin` to automatically extract Client Components and generate the bundle manifest.

### 1. Install Dependencies

```bash
npm install react@^19 react-dom@^19 react-server-dom-webpack@^19
npm install -D webpack webpack-cli babel-loader @babel/core @babel/preset-react @babel/preset-typescript

```

---

### 2. Webpack Client Config (`webpack.client.js`)

```javascript
const path = require('path');
const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin');

module.exports = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    // Automatically extracts client components ('use client') and writes manifest
    new ReactServerWebpackPlugin({ isServer: false }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};

```

---

### 3. Webpack Server Config (`webpack.server.js`)

The server configuration resolves modules under the `react-server` condition.

```javascript
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/server/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: 'index.js',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new ReactServerWebpackPlugin({ isServer: true }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // Critical: Prioritize react-server condition for RSC exports
    conditionNames: ['react-server', 'require', 'node'],
  },
};

```

---

### 4. Client Entrypoint (`src/client/index.js`)

On the client, use `createFromFetch` from `react-server-dom-webpack/client` to deserialize the stream and render the virtual DOM tree:

```tsx
import { use } from 'react';
import { createRoot } from 'react-dom/client';
import { createFromFetch } from 'react-server-dom-webpack/client';

// Fetch RSC stream from server
const rscPromise = createFromFetch(fetch('/rsc'));

function Shell() {
  // Read RSC stream promise with React 19's use() API
  const rootElement = use(rscPromise);
  return rootElement;
}

const container = document.getElementById('root');
createRoot(container).render(<Shell />);

```

---

## Build Scripts (`package.json`)

To orchestrate the dual build, execute both builds sequentially or in parallel:

```json
{
  "scripts": {
    "build:vite": "vite build --config vite.config.client.js && vite build --config vite.config.server.js",
    "build:webpack": "webpack --config webpack.client.js && webpack --config webpack.server.js",
    "start": "node dist/server/index.js"
  }
}

```
