Hardcoding remote URLs in `webpack.config.js` (`remoteApp@http://localhost:3001/remoteEntry.js`) works during local development, but in real-world CI/CD pipelines, remote URLs change across environments (Dev, Staging, Production).

Here are the **two main strategies** to dynamically load remote URLs in Webpack Module Federation:

---

### Strategy 1: Dynamic Script Loading (Promise-Based Remotes) — Recommended

Instead of hardcoding a URL string, Webpack Module Federation allows you to write a **promise-based script loader** inside `webpack.config.js`. It fetches the `remoteEntry.js` URL from a runtime global configuration object, environment variable, or window object before mounting the remote component.

#### 1. Global Window Config (`public/config.js` or injected in HTML)

In your host application's HTML or environment config script, define the remote URLs dynamically per environment:

```html
<!-- public/config.js - Injected or swapped out per environment in CI/CD -->
<script>
  window.__REMOTE_URLS__ = {
    remoteApp: "https://staging-remote.example.com/remoteEntry.js" // Dev, Staging, or Prod URL
  };
</script>

```

#### 2. Host Webpack Configuration (`host-app/webpack.config.js`)

Use the `promise` syntax in the `remotes` configuration to dynamically inject the script tag at runtime:

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remoteApp: `promise new Promise((resolve, reject) => {
          // Retrieve dynamic URL from window or fallback to default
          const remoteUrl = (window.__REMOTE_URLS__ && window.__REMOTE_URLS__.remoteApp) 
            || 'http://localhost:3001/remoteEntry.js';

          const script = document.createElement('script');
          script.src = remoteUrl;

          script.onload = () => {
            // Register the remote global container
            const proxy = {
              get: (request) => window.remoteApp.get(request),
              init: (arg) => {
                try {
                  return window.remoteApp.init(arg);
                } catch (e) {
                  console.error('Failed to initialize remoteApp container', e);
                }
              }
            };
            resolve(proxy);
          };

          script.onerror = (err) => {
            reject(new Error('Failed to load remoteEntry.js from ' + remoteUrl));
          };

          document.head.appendChild(script);
        })`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};

```

---

### Strategy 2: `@module-federation/utilities` (Clean Helper Library)

If writing custom DOM `Promise` script injection feels verbose, you can use the official `@module-federation/utilities` library to dynamically import remotes at runtime inside your React components.

#### 1. Install Dependency

```bash
npm install @module-federation/utilities

```

#### 2. Load Remotes Dynamically in React Components (`App.jsx`)

You don't even need to list the remote in `webpack.config.js`! You can import it on demand inside your React components using `importRemote`:

```jsx
import React, { Suspense, lazy } from 'react';
import { importRemote } from '@module-federation/utilities';

// Dynamically resolve the remote URL based on environment or window config
const getRemoteUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cdn.prod.example.com/remoteApp';
  }
  if (process.env.NODE_ENV === 'staging') {
    return 'https://staging-remote.example.com';
  }
  return 'http://localhost:3001';
};

// Dynamically import component from remote url
const RemoteHeader = lazy(() =>
  importRemote({
    url: getRemoteUrl(),
    scope: 'remoteApp',    // Must match 'name' in Remote's webpack config
    module: './Header',    // Must match 'exposes' in Remote's webpack config
  })
);

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading Header...</div>}>
        <RemoteHeader />
      </Suspense>
    </div>
  );
}

```

---

### Strategy 3: Build-Time Environment Variable Injection (`process.env`)

If your remote URLs are known at build time for each environment (e.g., during GitHub Actions or AWS CodePipeline builds), inject the URL using `DefinePlugin` or `dotenv` during compilation.

#### Host Webpack Config (`webpack.config.js`)

```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'development'}` });

const REMOTE_APP_URL = process.env.REMOTE_APP_URL || 'http://localhost:3001/remoteEntry.js';

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remoteApp: `remoteApp@${REMOTE_APP_URL}`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
};

```

#### Environment Files

* **`.env.development`**

```env
REMOTE_APP_URL=http://localhost:3001/remoteEntry.js

```

* **`.env.staging`**

```env
REMOTE_APP_URL=https://staging.example.com/remoteEntry.js

```

* **`.env.production`**

```env
REMOTE_APP_URL=https://cdn.example.com/remoteApp/remoteEntry.js

```

---

### Which Strategy Should You Pick?

| Feature                       | Dynamic Script Loading (Promise)                                       | `@module-federation/utilities`                           | Build-Time `.env` Injection                      |
| ----------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| **When URL is Resolved**      | **Runtime** (Browser)                                                  | **Runtime** (Browser)                                    | **Build Time** (CI/CD)                           |
| **Requires Rebuilding Host?** | **No** (Change `window.config` on server)                              | **No**                                                   | **Yes** (Rebuild host for new URLs)              |
| **Best For**                  | Enterprise apps with dynamic server configs or Kubernetes deployments. | Flexible React components loading remotes conditionally. | Simple static deployments (S3, Vercel, Netlify). |
