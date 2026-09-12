Production caching bugs usually manifest in two ways: **users receive stale JavaScript/CSS bundles after a deployment**, or **APIs return stale data / race conditions between client memory and server caches**.

A robust caching strategy breaks the application into four distinct layers:

---

### 1. Static Asset Invalidation (The Hash-and-HTML Rule)

The most catastrophic frontend bug is when a user loads a newly deployed `index.html`, but their browser serves cached, outdated JavaScript chunks—or vice versa—causing runtime `ChunkLoadError` crashes.

#### The Golden Rule

* **Hashed Assets (`main.[contenthash].js`, `app.[contenthash].css`)**: Cache forever.
* **Entry Points (`index.html`)**: Never cache.

```http
# 1. index.html (Nginx / Cloudflare / CloudFront)
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# 2. Bundled assets (/assets/*.js, /assets/*.css, web fonts)
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

```

* **Why it works**: Because bundle files contain a `[contenthash]`, any code change generates a new filename (e.g., `main.a4f12b.js` $\to$ `main.e89c01.js`). Because `index.html` is always re-validated against the server (`no-cache`), users download the latest HTML pointing to the exact new hash immediately upon deployment.

---

### 2. Handling Runtime `ChunkLoadError` (Deploy Skew)

When a new build deploys, CDNs and cloud storage often delete the old hashed chunks. If a user has the app open on the previous version and navigates to a lazy-loaded route (`React.lazy()`), the browser requests an old chunk that no longer exists on the server, throwing a fatal `Loading chunk [id] failed`.

#### The Fix: Automatic Reload Boundary

Wrap lazy routes in an error boundary that detects chunk failure, checks if a new version exists, and triggers a hard reload:

```jsx
import React from 'react';

class ChunkErrorBoundary extends React.Component {
  state = { hasChunkError: false };

  static getDerivedStateFromError(error) {
    const isChunkError = 
      error?.name === 'ChunkLoadError' ||
      /Loading chunk .* failed/i.test(error?.message);

    return { hasChunkError: isChunkError };
  }

  componentDidCatch(error) {
    if (this.state.hasChunkError) {
      const reloadKey = 'last_chunk_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Prevent infinite reload loops if there is an actual CDN outage
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasChunkError) {
      return <div>Updating to the latest version...</div>;
    }
    return this.props.children;
  }
}

```

---

### 3. HTTP API Caching: ETags & Stale-While-Revalidate

For dynamic REST or GraphQL APIs, avoid simple `Cache-Control: max-age=N` on mutable business data. Use conditional validation headers:

* **ETags (Entity Tags)**:
* Server generates an ETag hash of the response body.
* Next request sends `If-None-Match: "33a64df5"`.
* If unchanged, server sends an empty **`304 Not Modified`** payload, saving bandwidth and execution.

* **`stale-while-revalidate` (SWR Header)**:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=600

```

* Browser uses cached data instantly for 60 seconds.
* Between 60 and 660 seconds, it serves the cached data immediately to the UI *while* firing a background fetch to update the cache for the next render.

---

### 4. Client-Side Cache Invalidation (RTK Query / TanStack Query)

When using client query libraries, stale data usually stems from **missing mutation-to-query invalidation links**.

* **Declarative Cache Tags (RTK Query)**:
Never leave cache invalidation to manual triggers. Bind resources via tags:

```javascript
// apiSlice.js
export const api = createApi({
  tagTypes: ['DashboardMetrics', 'UserProfile'],
  endpoints: (builder) => ({
    getMetrics: builder.query({
      query: () => '/metrics',
      providesTags: ['DashboardMetrics'],
    }),
    updateMetric: builder.mutation({
      query: (patch) => ({ url: '/metrics', method: 'PUT', body: patch }),
      // Invalidates tag across all mounted and cached components automatically:
      invalidatesTags: ['DashboardMetrics'],
    }),
  }),
});

```

* **Cache Eviction on User Change**:
When a user logs out or switches accounts/tenants, stale customer data can persist in memory. Always clear the client-side cache completely upon authorization changes:

```javascript
// On Logout:
dispatch(api.util.resetApiState()); // Clears RTK Query cache
// Or: queryClient.clear();         // Clears TanStack Query cache

```

---

### 5. Service Worker Cache Traps

If using a Service Worker / PWA, the worker script itself can cache your application shell indefinitely if not updated properly.

* **Skip Waiting Prompt**: Do not activate new service workers silently in the background while users have active tabs; notify them or force activation:

```javascript
// In service worker registration
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing;
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // Emit event to display UI banner: "New version available. Reload?"
      window.dispatchEvent(new CustomEvent('sw-update-ready'));
    }
  });
});

```

* Inside the Service Worker's `activate` event, always purge stale cache keys:

```javascript
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME_V2];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (!currentCaches.includes(name)) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

```

---

### Cache Strategy Summary Matrix

| Asset Type               | Storage Target         | Cache-Control Header                  | Invalidation Trigger               |
| ------------------------ | ---------------------- | ------------------------------------- | ---------------------------------- |
| `index.html`             | Edge / CDN             | `no-cache, no-store, must-revalidate` | Every deploy                       |
| `*.bundle.[hash].js/css` | Browser disk / CDN     | `public, max-age=31536000, immutable` | Content hash change                |
| Images / Fonts           | Browser / CDN          | `public, max-age=2592000` (30 days)   | Path versioning (`/v2/logo.png`)   |
| Dynamic GET APIs         | Browser / Client Cache | `private, no-cache` + `ETag`          | `If-None-Match` / Tag invalidation |
| User Session / Auth      | Memory only            | `no-store`                            | Explicit logout / token expiration |
