When users continue receiving old JavaScript days after a deployment, the failure almost always stems from **stale caching layers**, **Service Worker lifecycle locks**, or **cache key mismatches**.

Here is what went wrong and where to look.

---

### 1. The `index.html` File Was Cached (The Root Cause in 80% of Cases)

In modern Single Page Applications (React, Vue, Vite, Next.js), JavaScript files have content hashes in their filenames (e.g., `main.a8f9b2.js`). When you push a new build, the HTML file updates its script tags to reference the new hashes.

* **What went wrong:** Your server or CDN served `index.html` with aggressive cache headers (e.g., `Cache-Control: max-age=604800` or default CDN static caching).
* **The Result:** The user's browser never requests the new `index.html`. It serves the cached HTML from disk, which requests the **old hashed JS filenames** (`main.old123.js`).
* **The Fix:** Set strict no-cache headers on `index.html` while keeping immutable headers on hashed assets:

```http
# For index.html ONLY
Cache-Control: no-cache, no-store, must-revalidate

# For hashed static assets (/assets/*.js, *.css)
Cache-Control: public, max-age=31536000, immutable

```

---

### 2. A Service Worker Is Holding the Old Version (PWA / Workbox)

If your app uses a Service Worker (PWA), its default lifecycle preserves the running version until all tabs are closed and the worker is explicitly updated.

* **What went wrong:**

1. The new Service Worker installs in the background, but enters the `waiting` (installed) state because older tabs are still open.
2. The Service Worker's `fetch` event handler serves the old precached JS bundle directly from `CacheStorage` (`cache-first` strategy).
3. The `sw.js` script itself was cached by the browser/CDN because it lacked a `no-cache` header.

* **The Fix:**
* Ensure `sw.js` is served with `Cache-Control: no-cache`.
* Call `self.skipWaiting()` and `clients.claim()` inside the Service Worker, or use `registration.waiting.postMessage({ type: 'SKIP_WAITING' })` accompanied by a user-facing prompt: *"A new version is available. [Reload]"*.

---

### 3. Missing or Broken Asset Content Hashing

* **What went wrong:** Your bundler (Vite, Webpack, Rollup) output static filenames like `bundle.js`, `app.js`, or `vendor.js` without content-based cache busters (`[name].[contenthash].js`).
* **The Result:** The browser requested `app.js`, saw a valid local cache entry, and never hit the network.
* **The Fix:** Ensure output bundle configuration includes `[contenthash]`:

```javascript
// vite.config.ts / webpack.config.js
output: {
  entryFileNames: 'assets/[name].[contenthash].js',
  chunkFileNames: 'assets/[name].[contenthash].js',
  assetFileNames: 'assets/[name].[contenthash].[ext]'
}

```

---

### 4. Edge CDN / Cloudflare HTML Edge Caching

* **What went wrong:** Even if your origin server sends correct headers, your edge CDN (Cloudflare, Fastly, CloudFront) may have an edge rule configured (e.g., "Cache Everything") caching `index.html` at the edge server for 7–30 days.
* **The Result:** Users across entire regions receive stale HTML from the nearest edge POP.
* **The Fix:**
* Add automatic CDN cache invalidation/purge for `index.html` to your CI/CD deployment pipeline.
* Configure CDN edge rules to bypass cache for HTML documents (`text/html`).

---

### 5. Open Tabs & Stale Dynamic Imports (ChunkLoadErrors)

* **What went wrong:** A user left a tab open for days. When they navigated to a lazy-loaded route (`React.lazy()` / dynamic `import()`), the browser requested `feature.oldHash.js`. Because the server deleted old build artifacts during deployment, the request failed with a 404 (`ChunkLoadError: Loading chunk failed`).
* **The Fix:** Implement an error boundary that detects chunk load failures and reloads the window:

```typescript
window.addEventListener('error', (event) => {
  if (/Loading chunk [\d]+ failed/i.test(event.message) || /dynamically imported module/i.test(event.message)) {
    window.location.reload();
  }
});

```

---

### Diagnostic Checklist to Run Right Now

1. **Inspect `index.html` Headers:** Open DevTools $\rightarrow$ **Network** $\rightarrow$ select the initial document request $\rightarrow$ check `Response Headers`. Does `Cache-Control` contain `max-age` $> 0$?
2. **Inspect Service Workers:** Open DevTools $\rightarrow$ **Application** $\rightarrow$ **Service Workers**. Is there a worker stuck in the *"waiting to activate"* state?
3. **Inspect Cache Storage:** In **Application** $\rightarrow$ **Storage** $\rightarrow$ **Cache Storage**, check if old hashed JS assets are stored under a stale cache key.
