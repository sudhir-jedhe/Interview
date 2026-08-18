To load remote micro-frontends dynamically at runtime with Vite Module Federation, you avoid hardcoded static URLs in `vite.config.ts`. Instead, you configure the host to fetch the remote entry URL on demand from runtime sources such as `window.__ENV__`, an API configuration endpoint, query parameters, or runtime service discovery.

Here are the two production-ready methods using `@originjs/vite-plugin-federation` and native ES Dynamic Imports.

---

### Method 1: Using `@originjs/vite-plugin-federation` Dynamic Remotes (Promise / Function URL)

`@originjs/vite-plugin-federation` allows you to declare remotes as an object with `external` returning a Promise or dynamic URL string, or using the `__federation_method_getRemote` utility.

#### 1. Host Configuration (`host/vite.config.ts`)

Configure the remote with an `external` function that resolves at runtime:

```typescript
// host/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        // Define dynamic remote via function/external definition
        remoteApp: {
          external: `Promise.resolve(window.__RUNTIME_CONFIG__?.REMOTE_APP_URL || 'http://localhost:5001/assets/remoteEntry.js')`,
          externalType: 'promise',
        },
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
  },
});

```

#### 2. Inject Runtime Configuration Before App Boot (`host/index.html`)

Inject the configuration before the JavaScript bundle runs (e.g., via server-side templating, Kubernetes config map injection, or a meta tag):

```html
<!-- host/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dynamic Host App</title>
    
    <!-- Runtime Environment Injection (Can be changed per environment: dev/stage/prod) -->
    <script>
      window.__RUNTIME_CONFIG__ = {
        REMOTE_APP_URL: window.location.hostname === 'localhost' 
          ? 'http://localhost:5001/assets/remoteEntry.js'
          : 'https://cdn.production.example.com/remotes/billing/remoteEntry.js'
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

#### 3. Consume in Host Component

Now import using the standard dynamic import syntax:

```tsx
// host/src/App.tsx
import React, { Suspense, lazy } from 'react';

// Resolved dynamically using window.__RUNTIME_CONFIG__.REMOTE_APP_URL
const RemoteButton = lazy(() => import('remoteApp/Button'));

export function App() {
  return (
    <div>
      <h1>Host Application</h1>
      <Suspense fallback={<div>Loading Dynamic Remote...</div>}>
        <RemoteButton label="Dynamic Button" />
      </Suspense>
    </div>
  );
}

export default App;

```

---

### Method 2: Pure Native ESM Dynamic Remote Loader (No Bundler Lock-in)

Because Vite builds standard ECMAScript modules (`esnext`), you can load exposed components directly via browser-native `import(/* @vite-ignore */ url)` at runtime. This approach works completely dynamically without defining the remote in `vite.config.ts` upfront.

#### 1. Generic Dynamic Module Loader Helper (`host/src/utils/dynamicFederation.ts`)

```typescript
// host/src/utils/dynamicFederation.ts
import { ComponentType, lazy } from 'react';

interface DynamicRemoteOptions {
  remoteUrl: string;       // e.g. "https://cdn.example.com/assets/remoteEntry.js"
  moduleName: string;      // e.g. "./Button"
}

// Memory cache so remoteEntry is only fetched once
const moduleCache = new Map<string, Promise<any>>();

export function importDynamicRemote<T = any>({
  remoteUrl,
  moduleName,
}: DynamicRemoteOptions): Promise<{ default: ComponentType<T> }> {
  const cacheKey = `${remoteUrl}::${moduleName}`;

  if (!moduleCache.has(cacheKey)) {
    const loaderPromise = (async () => {
      // 1. Dynamically import the remoteEntry.js container via native ESM
      const container = await import(/* @vite-ignore */ remoteUrl);

      // 2. Initialize the container if using standard federation protocol
      if (typeof container.get === 'function') {
        const factory = await container.get(moduleName);
        return factory();
      }

      // 3. Fallback direct ESM module export
      return container;
    })();

    moduleCache.set(cacheKey, loaderPromise);
  }

  return moduleCache.get(cacheKey)!;
}

// React lazy wrapper helper
export function createDynamicRemoteComponent<T = any>(
  getUrl: () => string | Promise<string>,
  moduleName: string
) {
  return lazy(async () => {
    const remoteUrl = await getUrl();
    return importDynamicRemote<T>({ remoteUrl, moduleName });
  });
}

```

#### 2. Using Dynamic Loader with Async Discovery / Service APIs (`host/src/App.tsx`)

```tsx
import React, { Suspense } from 'react';
import { createDynamicRemoteComponent } from './utils/dynamicFederation';

// 1. Fetch remote URL dynamically from an API gateway, session storage, or service registry
async function fetchServiceUrl(serviceName: string): Promise<string> {
  const response = await fetch(`/api/v1/discovery/services/${serviceName}`);
  const data = await response.json();
  return data.entryUrl; // e.g. "https://billing-cdn.corp.com/remoteEntry.js"
}

// 2. Instantiate lazy component bound to runtime discovery
const DynamicBillingDashboard = createDynamicRemoteComponent(
  () => fetchServiceUrl('billing-service'),
  './BillingDashboard'
);

export function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Micro-Frontend Host</h1>
      <Suspense fallback={<div>Discovering and loading remote service...</div>}>
        <DynamicBillingDashboard />
      </Suspense>
    </div>
  );
}

export default App;

```

---

### Comparison & Production Best Practices

| Technique                                | When to Use                                                                            | Advantages                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Method 1 (`externalType: 'promise'`)** | Single remote per logical name, URLs differ per environment (dev/qa/prod).             | Works with standard `import('remoteApp/...')` and TypeScript module declarations.       |
| **Method 2 (Native ESM `import()`)**     | Multi-tenant apps, plug-and-play micro-app marketplaces, or dynamic service discovery. | Zero config needed in `vite.config.ts`; remotes can be added/removed at database level. |

#### Critical Production Rules

* **Ensure Remote CORS:** Ensure the CDN serving `remoteEntry.js` sends `Access-Control-Allow-Origin: *` headers.
* **Cache-Control for `remoteEntry.js`:** Configure the remote entry file with `Cache-Control: no-cache, no-store, must-revalidate` so clients always resolve the newest chunk hashes, while hashed asset chunks (`Button-[hash].js`) can have `max-age=31536000, immutable`.
* **Shared Singleton Fallback:** Always ensure `shared: ['react', 'react-dom']` is defined in the host's `vite.config.ts` so dynamically loaded modules hook into the host's React instance.
