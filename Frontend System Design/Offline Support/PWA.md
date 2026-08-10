Implementing Version Vectors or Optimistic Locking in an offline-first React application involves tracking resource versions across three layers: **React UI State**, **IndexedDB (Local Outbox/Cache)**, and the **Backend Database**.

---

## 1. Core Architecture

```
[ React Component ]
       │
  1. Trigger Mutation (Updates UI + Stores baseVersion)
       ▼
[ IndexedDB Outbox ] ── (Stores payload + baseVersion)
       │
  2. Network Restored: Background Worker Syncs Request
       ▼
[ REST / GraphQL API ]
       │
  3. Validates: Payload.baseVersion === DB.version?
       ├─ YES ──> Commits write, increments version to baseVersion + 1
       └─ NO  ──> Returns 409 Conflict with Current Server State

```

---

## 2. Implementation Step-by-Step

### Step 1: IndexedDB Setup with `idb`

Set up an IndexedDB store with two object stores: `items` (local cache) and `outbox` (pending requests waiting to sync).

```javascript
// db.js
import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('OfflineAppDB', 1, {
    upgrade(db) {
      // Store cached items: { id, data, version }
      if (!db.objectStoreNames.contains('items')) {
        db.createObjectStore('items', { keyPath: 'id' });
      }
      // Store outbox queue: { id, itemId, payload, baseVersion, timestamp }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

```

---

### Step 2: Optimistic UI Hook & Local Commit

This custom React hook optimistically updates local IndexedDB storage and queues mutations with the resource's current `version`.

```javascript
// useOptimisticMutation.js
import { initDB } from './db';

export function useOptimisticMutation() {
  const saveItem = async (itemId, newData, currentVersion) => {
    const db = await initDB();

    const updatedItem = {
      id: itemId,
      data: newData,
      version: currentVersion, // Preserve current base version locally
      syncState: 'pending',
    };

    const outboxEntry = {
      itemId,
      payload: newData,
      baseVersion: currentVersion, // Token used for optimistic locking on server
      createdAt: Date.now(),
    };

    // Transactionally update local view and append to queue
    const tx = db.transaction(['items', 'outbox'], 'readwrite');
    await tx.objectStore('items').put(updatedItem);
    await tx.objectStore('outbox').add(outboxEntry);
    await tx.done;

    // Trigger sync process if online
    if (navigator.onLine) {
      triggerBackgroundSync();
    }
  };

  return { saveItem };
}

```

---

### Step 3: Background Sync Handler & 409 Conflict Handling

The sync processor reads from the `outbox` queue and sends payloads containing the `baseVersion` to the server. If the server detects a version discrepancy, it returns `409 Conflict`.

```javascript
// syncService.js
import { initDB } from './db';

export async function triggerBackgroundSync() {
  const db = await initDB();
  const pendingItems = await db.getAll('outbox');

  for (const item of pendingItems) {
    try {
      const response = await fetch(`/api/items/${item.itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: item.payload,
          baseVersion: item.baseVersion, // Optimistic concurrency token
        }),
      });

      if (response.status === 200) {
        const updatedRecord = await response.json();

        // Server update successful: Update local cache with server's new version
        const tx = db.transaction(['items', 'outbox'], 'readwrite');
        await tx.objectStore('items').put({
          id: updatedRecord.id,
          data: updatedRecord.data,
          version: updatedRecord.version, // Server incremented version
          syncState: 'synced',
        });
        await tx.objectStore('outbox').delete(item.id);
        await tx.done;

      } else if (response.status === 409) {
        // CONFLICT DETECTED: Server has newer changes
        const serverState = await response.json();
        await handleConflictResolution(item, serverState);
      }
    } catch (err) {
      console.warn('Sync delayed. Will retry when connection stabilizes.', err);
      break;
    }
  }
}

async function handleConflictResolution(outboxItem, serverState) {
  const db = await initDB();
  
  // Strategy: Store conflict state locally to prompt user in UI
  const conflictRecord = {
    id: outboxItem.itemId,
    localData: outboxItem.payload,
    serverData: serverState.currentData,
    baseVersion: outboxItem.baseVersion,
    serverVersion: serverState.currentVersion,
    syncState: 'conflict',
  };

  const tx = db.transaction(['items', 'outbox'], 'readwrite');
  await tx.objectStore('items').put(conflictRecord);
  await tx.objectStore('outbox').delete(outboxItem.id); // Remove failed entry from outbox
  await tx.done;
}

```

---

### Step 4: Conflict Resolution UI Component

When a `409 Conflict` status updates IndexedDB state to `syncState: 'conflict'`, render a resolution UI for the user.

```jsx
// ItemEditor.jsx
import React, { useEffect, useState } from 'react';
import { initDB } from './db';

export function ItemEditor({ itemId }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function loadItem() {
      const db = await initDB();
      const record = await db.get('items', itemId);
      setItem(record);
    }
    loadItem();
  }, [itemId]);

  const resolveConflict = async (chosenData, targetVersion) => {
    const db = await initDB();
    
    // Replace local record with resolved data and update version to latest server version
    await db.put('items', {
      id: itemId,
      data: chosenData,
      version: targetVersion,
      syncState: 'synced',
    });

    // Queue fresh write back to server using the updated serverVersion
    // (This ensures next request will pass optimistic locking checks)
    setItem(null);
  };

  if (!item) return <div>Loading...</div>;

  if (item.syncState === 'conflict') {
    return (
      <div className="conflict-modal">
        <h3>Version Conflict Detected</h3>
        <p>This item was modified on another device while you were offline.</p>
        
        <div className="diff-view">
          <div>
            <h4>Your Local Changes</h4>
            <pre>{JSON.stringify(item.localData, null, 2)}</pre>
            <button onClick={() => resolveConflict(item.localData, item.serverVersion)}>
              Keep My Version
            </button>
          </div>

          <div>
            <h4>Server Version (v{item.serverVersion})</h4>
            <pre>{JSON.stringify(item.serverData, null, 2)}</pre>
            <button onClick={() => resolveConflict(item.serverData, item.serverVersion)}>
              Accept Server Version
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Item Content: {JSON.stringify(item.data)}</div>;
}

```

---

## Technical Summary

1. **Base Version Capture:** Always attach the current known `version` tag to queued local mutations in IndexedDB.
2. **Server Check:** The backend rejects requests if `baseVersion !== currentServerVersion` returning a `409 Conflict`.
3. **Queue Eviction on Conflict:** On `409`, purge the outbox entry and move the resource into a `conflict` state locally to prevent infinite retry loops.
4. **Resolution Re-queueing:** Resolving a conflict re-bases local state on `serverVersion`, permitting the next write transaction to succeed.

How do you use Workbox to implement caching strategies in a Progressive Web Application?

**Workbox** is a library developed by Google that simplifies Service Worker creation and management. Instead of manually writing complex `fetch`, `install`, and `activate` listeners using raw Service Worker APIs, Workbox provides modular routes and production-ready caching strategies out of the box.

---

## 1. Setting Up Workbox

You can import Workbox directly inside your `sw.js` via CDN or bundle it using tools like Webpack, Vite, or Rollup.

### Option A: CDN Setup (Simplest)

```javascript
// sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded!`);
} else {
  console.log(`Workbox failed to load.`);
}

```

### Option B: Bundler / NPM Setup

```bash
npm install workbox-routing workbox-strategies workbox-precaching workbox-expiration

```

---

## 2. Precaching vs. Runtime Caching

Workbox separates caching into two main mechanisms:

1. **Precaching (App Shell):** Downloads and caches core build files (HTML, main CSS, JS, logos) during the Service Worker's `install` phase.
2. **Runtime Caching (Dynamic Content):** Intercepts network requests dynamically based on URL patterns and applies specific caching strategies.

### Step 1: Precaching Assets

When using build tools (e.g., `workbox-build` or `vite-plugin-pwa`), Workbox generates a list of build files (known as a manifest) to cache automatically.

```javascript
// sw.js
import { precacheAndRoute } from 'workbox-precaching';

// __WB_MANIFEST is injected by build tools (Webpack/Vite/Workbox CLI)
precacheAndRoute(self.__WB_MANIFEST || []);

```

---

## 3. Implementing the 5 Built-in Runtime Caching Strategies

Workbox provides 5 primary strategies tailored to different data types:

```
                          WORKBOX ROUTING
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
    [ Cache First ]   [ Network First ]   [ Stale While Revalidate ]
     (Static Media)     (APIs / Dynamic)       (CSS / JS / Fonts)

```

```javascript
// sw.js
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
  NetworkOnly,
  CacheOnly,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

```

---

### Strategy 1: Stale-While-Revalidate (Best for Styles, Scripts, Fonts)

Serves content immediately from the cache while simultaneously fetching an updated version from the network in the background to update the cache for the next load.

```javascript
// Cache CSS and JavaScript files
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

```

---

### Strategy 2: Cache First (Best for Images & Static Media)

Looks for a response in the cache first. If found, it returns it immediately without touching the network. If not found, it fetches it from the network and stores it in the cache for future requests.

```javascript
// Cache Images with automatic expiration rules
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      // Ensure only HTTP 200 responses are cached
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      // Keep max 50 images for 30 days
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true, // Automatically cleanup if storage limit is hit
      }),
    ],
  })
);

```

---

### Strategy 3: Network First (Best for Frequently Updating APIs & HTML)

Tries to retrieve the latest response from the network first. If successful, it updates the cache and returns the fresh data. If the network drops or is slow, it falls back to the cached copy.

```javascript
// Cache API calls or dynamic HTML pages
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/user/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3, // Fallback to cache if network doesn't respond in 3s
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  })
);

```

---

### Strategy 4: Network Only (Best for Non-Cacheable Actions)

Forces the request to go directly to the network. Use this for POST requests, checkout flows, or authentication endpoints where caching would create security risks or state bugs.

```javascript
// Disable caching for payment/checkout mutations
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/checkout'),
  new NetworkOnly()
);

```

---

### Strategy 5: Cache Only (Best for Static Bundled Assets)

Forces responses to strictly come from pre-populated caches. It fails if the requested asset is missing from the cache.

```javascript
// Match explicit precached configuration assets
registerRoute(
  ({ url }) => url.pathname.endsWith('/app-config.json'),
  new CacheOnly({
    cacheName: 'config-cache',
  })
);

```

---

## 4. Setting Up an Offline Fallback Page

When a user visits an uncached route while offline, you can catch the navigation error and display an offline fallback HTML page.

```javascript
import { setCatchHandler } from 'workbox-routing';

// Global catch handler for failed network/cache fetches
setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case 'document':
      // Return precached offline page for page navigation failures
      return caches.match('/offline.html');
    default:
      return Response.error();
  }
});

```

---

## Summary Matrix: Selecting Workbox Strategies

| Asset Type                      | Strategy               | Why Use It?                                               |
| ------------------------------- | ---------------------- | --------------------------------------------------------- |
| **Images / Video / Fonts**      | `CacheFirst`           | Rarely changes; saves network bandwidth.                  |
| **CSS / JS / Shell App Files**  | `StaleWhileRevalidate` | Fast local loading + automatic background update.         |
| **JSON APIs / Profile Data**    | `NetworkFirst`         | Prioritizes fresh state while providing offline fallback. |
| **Forms / Analytics / Billing** | `NetworkOnly`          | Must never be cached or served stale.                     |

How do you integrate Workbox into a modern build setup using Vite and vite-plugin-pwa?

Integrating Workbox into a modern Vite setup is straightforward using `vite-plugin-pwa`. This plugin wraps Workbox behind a clean configuration layer, automatically handling Service Worker generation, precaching, runtime caching rules, and update manifests during build time.

---

## 1. Installation

Install `vite-plugin-pwa` along with Workbox dependencies:

```bash
npm install vite-plugin-pwa -D
# or
pnpm add -D vite-plugin-pwa
# or
yarn add -D vite-plugin-pwa

```

---

## 2. Configure `vite.config.js` / `vite.config.ts`

Import and register `VitePWA` inside your Vite configuration. `vite-plugin-pwa` offers two primary modes:

* **`generateSW` (Default):** Generates a complete Service Worker automatically based on your plugin options.
* **`injectManifest`:** Allows you to write a custom Service Worker file (`src/sw.js`) while letting the plugin inject the Workbox precache manifest.

### Complete `generateSW` Configuration Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs.plugin-react'; // Or your framework plugin (vue, svelte, etc.)
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates SW on app reloads
      injectRegister: 'auto',
      
      // Configuration for Web App Manifest
      manifest: {
        name: 'Modern Vite PWA',
        short_name: 'VitePWA',
        description: 'Vite frontend application with Workbox offline support',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      // Workbox Strategy Options
      workbox: {
        // Files to precache automatically from build output
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        
        // Custom Runtime Caching Rules
        runtimeCaching: [
          {
            // Cache API requests
            urlPattern: /^https:\/\/api\.example\.com\/v1\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 Hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache remote images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
              }
            }
          },
          {
            // Cache Google Fonts / External Styles
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          }
        ]
      },

      // Enable local development testing
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});

```

---

## 3. Registering the Service Worker in Application Code

Depending on your UI requirements, you can configure how updates are applied when a new Service Worker is deployed.

### Option A: Automatic Registration (`registerType: 'autoUpdate'`)

If configured with `autoUpdate`, the plugin registers the Service Worker automatically without needing extra code. When a new build is deployed, the Service Worker replaces the old one and reloads the active tab upon navigation.

### Option B: Prompt User for Reload (`registerType: 'prompt'`)

If you want to notify the user before refreshing the app (e.g., to prevent loss of unsaved form data):

```typescript
// vite.config.ts
VitePWA({
  registerType: 'prompt',
  // ... rest of config
})

```

Create a custom component to handle the SW update prompt:

```jsx
// ReloadPrompt.jsx (React Example)
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="pwa-toast" role="alert">
      <div className="message">
        {offlineReady ? (
          <span>App is ready to work offline</span>
        ) : (
          <span>New content available, click on reload to update.</span>
        )}
      </div>
      {needRefresh && (
        <button onClick={() => updateServiceWorker(true)}>
          Reload
        </button>
      )}
      <button onClick={close}>Close</button>
    </div>
  );
}

```

---

## 4. Advanced: Using Custom Service Workers (`injectManifest`)

If your project requires advanced features like custom **Push Notification listeners** or complex **Background Sync events**, switch to `injectManifest` mode:

### 1. Update `vite.config.ts`

```typescript
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts', // Location of custom service worker source
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  }
})

```

### 2. Create `src/sw.ts`

```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

// Precache assets generated by Vite
precacheAndRoute(self.__WB_MANIFEST);

// Custom Workbox route
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'custom-api-cache' })
);

// Custom event listeners (Push, Background Sync, etc.)
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/pwa-192x192.png'
  });
});

```

---

## 5. Testing and Verification

1. **Build the Production Assets:**

```bash
npm run build

```

1. **Preview Locally:**

```bash
npm run preview

```

1. **Inspect in DevTools:**

* Open Chrome DevTools -> **Application** tab.
* Check **Service Workers** to verify registration and status.
* Check **Manifest** to inspect parsed PWA configuration properties.
* Check **Storage / Cache Storage** to view cached precached files and runtime assets.
* Toggle **Offline** mode under Network tab to verify offline functionality.

How do you automate PWA and Service Worker testing in CI/CD pipelines using Playwright or Lighthouse?

Automating PWA and Service Worker testing in CI/CD pipelines ensures that offline support, caching strategies, and installability manifests do not break as application code evolves.

Using **Playwright** for functional and network-interception tests alongside **Lighthouse CI (LHCI)** for PWA compliance auditing covers the complete surface area.

---

## 1. Automated Functional & Service Worker Testing with Playwright

Playwright runs headlessly in CI environments and natively supports Service Worker interception, offline network simulation, and IndexedDB assertions.

### Step 1: Playwright Configuration (`playwright.config.ts`)

When testing Service Workers, ensure context options permit HTTPS or treat `localhost` as secure.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4173', // Vite preview / production build server
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

```

### Step 2: Testing SW Registration, Caching, and Offline Mode (`e2e/pwa.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('PWA & Service Worker Tests', () => {

  test('Service Worker registers and precaches core assets', async ({ page, context }) => {
    await page.goto('/');

    // 1. Assert Service Worker is registered and active
    const swRegistered = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return !!registration.active;
    });
    expect(swRegistered).toBe(true);

    // 2. Assert assets are added to Workbox Cache Storage
    const cacheNames = await page.evaluate(async () => {
      return await caches.keys();
    });
    expect(cacheNames.length).toBeGreaterThan(0);
  });

  test('App functions seamlessly in Offline Mode', async ({ page, context }) => {
    await page.goto('/');

    // Wait for SW to activate and precache
    await page.evaluate(async () => await navigator.serviceWorker.ready);

    // Simulate Network Disconnection
    await context.setOffline(true);

    // Reload page while offline
    await page.reload();

    // Verify main app shell still renders from SW cache
    await expect(page.locator('#app-root')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('My PWA App');

    // Verify offline banner/fallback logic if triggered
    await page.goto('/api-dependent-page');
    await expect(page.locator('.offline-warning')).toBeVisible();
  });

  test('Background Sync queues mutations in IndexedDB when offline', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    // Submit form offline
    await page.fill('input[name="task"]', 'Offline Task');
    await page.click('button[type="submit"]');

    // Assert mutation was stored in IndexedDB outbox
    const queuedCount = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.open('OfflineAppDB');
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction('outbox', 'readonly');
          const countReq = tx.objectStore('outbox').count();
          countReq.onsuccess = () => resolve(countReq.result);
        };
      });
    });

    expect(queuedCount).toBe(1);
  });
});

```

---

## 2. PWA Audit Automation with Lighthouse CI (LHCI)

Lighthouse CI automates static and runtime audits (checking `manifest.json`, HTTPS serving, service worker installation, theme colors, and responsiveness).

### Step 1: Install Lighthouse CI CLI

```bash
npm install -D @lhci/cli

```

### Step 2: Configure Lighthouse CI (`.lighthouserc.json`)

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:pwa": ["error", { "minScore": 0.9 }],
        "service-worker": "error",
        "installable-manifest": "error",
        "splash-screen": "warn",
        "themed-omnibox": "warn"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}

```

---

## 3. GitHub Actions CI/CD Pipeline Integration

Combine Playwright e2e testing and Lighthouse audits in a unified pipeline using **GitHub Actions**.

```yaml
#.github/workflows/pwa-ci.yml
name: PWA CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  pwa-test-and-audit:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      # Install Playwright Browsers
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Build Application
        run: npm run build

      # Step 1: Run Playwright E2E Tests (Offline Mode & SW logic)
      - name: Run Playwright PWA Tests
        run: npx playwright test

      # Step 2: Run Lighthouse CI Audits
      - name: Run Lighthouse PWA Audit
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      # Upload Test Artifacts on Failure
      - name: Upload Playwright Artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: test-results/

```

---

## Technical Summary Matrix

| Testing Layer        | Tool          | CI Target           | Key Validations                                                                                    |
| -------------------- | ------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| **Functional E2E**   | Playwright    | Functional Pipeline | SW activation, `caches` API presence, `context.setOffline(true)` behavior, IndexedDB outbox queue. |
| **Audit Compliance** | Lighthouse CI | Quality Gate        | PWA score $\ge 90\%$, `manifest.json` schema validation, start URL accessibility, theme colors.    |

Packaging and deploying a Progressive Web Application (PWA) to the Google Play Store is achieved through **Trusted Web Activities (TWA)**. TWA uses a customized Chrome Custom Tab (CCT) context to run your web application inside an Android wrapper with zero browser UI, giving it a fully native feel.

To establish trust between your Android app wrapper and your website domain, Google requires digital signature validation via **Digital Asset Links**.

---

## Prerequisites

1. A fully compliant PWA served over **HTTPS** (valid `manifest.json`, Service Worker registered, offline capability).
2. A **Google Play Console** developer account.
3. Node.js installed locally.

---

## 1. Simplest Method: Using `@bubblewrap/cli`

Google provides **Bubblewrap**, an open-source CLI tool that inspects your web app's `manifest.json` and automatically generates, builds, and signs a ready-to-deploy Android project (`.apk` or `.aab`).

### Step 1: Install Bubblewrap

```bash
npm install -g @bubblewrap/cli

```

### Step 2: Initialize the Android Project

Run `init` and pass your live PWA's Web App Manifest URL:

```bash
bubblewrap init --manifest=https://your-domain.com/manifest.json

```

Bubblewrap will parse your manifest and prompt you for configuration details:

* **Application ID / Package Name:** e.g., `com.yourdomain.app`
* **App Name & Short Name:** Auto-populated from manifest.
* **Display Mode:** `standalone` or `fullscreen`.
* **Keystore Details:** If you don't have an existing Android Signing Key, Bubblewrap will guide you through creating a new `.keystore` file. **Keep this file and its passwords safe** — you need it to upload future app updates.

### Step 3: Build the Signed Android App Bundle (`.aab`)

```bash
bubblewrap build

```

This produces an `.aab` (Android App Bundle) file (e.g., `app-release-signed.aab`) ready for Google Play. It will also print your app's **SHA-256 Fingerprint**.

---

## 2. Crucial Step: Set Up Digital Asset Links

To remove the URL bar and browser frame from your TWA, Google requires proof that you own both the Android package and the domain.

### Step 1: Extract Your SHA-256 Fingerprint

If you missed it during the build step, extract it using `keytool`:

```bash
keytool -list -v -keystore android.keystore -alias androiddbkey

```

### Step 2: Create `assetlinks.json`

Create a JSON file named `assetlinks.json` with the following structure:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourdomain.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA_256_FINGERPRINT_HERE_IN_ALL_CAPS_SEPARATED_BY_COLONS"
      ]
    }
  }
]

```

### Step 3: Host `assetlinks.json`

Host this file on your public web server at the root `.well-known` path:
`[https://your-domain.com/.well-known/assetlinks.json](https://your-domain.com/.well-known/assetlinks.json)`

> **Verification Tip:** Ensure your web server serves this file with `Content-Type: application/json` and returns a `200 OK` status without redirects.

---

## 3. Deployment to Google Play Console

### Step 1: Create App in Google Play Console

1. Log into your [Google Play Console](https://play.google.com/console).
2. Click **Create app** and provide your app title, default language, and type (App, Free/Paid).

### Step 2: Complete Store Listing & Content Declarations

Complete the mandatory store configuration steps:

* App access settings and privacy policy URL.
* Content ratings questionnaire.
* Target audience & news app declarations.
* Store listing details (screenshots, high-res 512x512 icon, feature graphic, and descriptions).

### Step 3: Configure Play App Signing

1. Navigate to **Release > Setup > App integrity**.
2. Opt into **Google Play App Signing**.

> **Important Note on Asset Links:** Google Play App Signing re-signs your app with a production Google key. After uploading your first release, go to **App Integrity** in the Play Console, copy the **SHA-256 certificate fingerprint generated by Google Play**, and add it as a second entry in your server's `assetlinks.json` file.

### Step 4: Create a Release

1. Navigate to **Testing > Production** (or **Internal testing** for a dry run).
2. Create a new release and upload your `app-release-signed.aab` generated by Bubblewrap.
3. Add release notes and click **Save** $\rightarrow$ **Review release** $\rightarrow$ **Start rollout**.

---

## 4. Alternative Method: PWABuilder

If you prefer a GUI over CLI toolchains:

1. Go to [pwabuilder.com](https://www.pwabuilder.com/).
2. Enter your live PWA URL.
3. Click **Package for Store** $\rightarrow$ **Android**.
4. Configure options (Package ID, Signing Key choices) and download the generated `.zip` bundle, which includes the ready-to-upload `.aab` file and pre-configured `assetlinks.json`.

---

## Technical Troubleshooting Matrix

| Issue / Symptom                            | Root Cause                                         | Solution                                                                                                          |
| ------------------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **URL Bar remains visible inside the app** | `assetlinks.json` validation failure               | Check SHA-256 fingerprint matching, domain redirects, or header `Content-Type` on `/.well-known/assetlinks.json`. |
| **Play Console rejects `.aab` upload**     | Duplicate Package Name or un-aligned version codes | Increment `versionCode` in `twa-manifest.json` before running `bubblewrap build`.                                 |
| **App shows "Network Error" on launch**    | Service worker missing offline fallback page       | Ensure SW has a valid fallback route registered via Workbox or raw fetch handler.                                 |
