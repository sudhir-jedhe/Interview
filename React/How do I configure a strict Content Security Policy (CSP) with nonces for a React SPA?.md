A strict, nonce-based **Content Security Policy (CSP)** blocks Cross-Site Scripting (XSS) by preventing arbitrary inline scripts, eval execution, and unauthorized third-party origins from running.

Because a cryptographic **nonce** (*number used once*) must be unique per HTTP request, a strict nonce-based CSP cannot be purely static; it requires your **serving layer** (Node.js/Express, Nginx, or Edge Worker) to generate a unique random string on every document request and inject it into both the **HTTP Response Header** and the **HTML `<script>` tags**.

---

### 1. The Strict CSP Policy Header

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-{RANDOM_BASE64_NONCE}' 'strict-dynamic' https: 'unsafe-inline';
  style-src 'self' 'nonce-{RANDOM_BASE64_NONCE}';
  img-src 'self' data: https:;
  font-src 'self' https: data:;
  connect-src 'self' https://api.yourdomain.com;
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  form-action 'self';

```

#### Why these directives?

* `'nonce-{RANDOM_BASE64_NONCE}'`: Authorizes only scripts carrying the matching `nonce="..."` attribute.
* `'strict-dynamic'`: Allows trusted, nonced scripts to dynamically load secondary JS chunks (critical for Vite/Webpack code-splitting and `React.lazy()`) without having to allowlist every domain or hash.
* `https: 'unsafe-inline'`: Ignored by modern browsers when nonces and `'strict-dynamic'` are present; serves as a backward-compatibility fallback for legacy browsers.
* `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`: Mitigates Flash exploits, DOM base-tag hijacking, and clickjacking.

---

### 2. Implementation with a Node.js / Express Server (`server.js`)

When serving your production SPA build:

```javascript
import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const app = express();
const distPath = path.resolve('./dist');
const indexHtmlTemplate = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

app.use((req, res, next) => {
  // 1. Generate a cryptographically secure 128-bit random base64 nonce
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  // 2. Set the Strict Content Security Policy header
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
      `style-src 'self' 'nonce-${nonce}'`,
      "img-src 'self' data: https:",
      "font-src 'self' https: data:",
      "connect-src 'self' https://api.yourdomain.com",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join('; ')
  );

  next();
});

// 3. Serve static JS/CSS/asset chunks without modifying their contents
app.use(express.static(distPath, { index: false }));

// 4. Inject nonce into index.html on every root/SPA document request
app.get('*', (req, res) => {
  const nonce = res.locals.nonce;

  // Replace placeholder or inject nonce into all <script> and <style> tags
  const htmlWithNonce = indexHtmlTemplate
    .replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${nonce}"`)
    .replace(/<style\b(?![^>]*\bnonce=)/gi, `<style nonce="${nonce}"`);

  res.setHeader('Content-Type', 'text/html');
  res.send(htmlWithNonce);
});

app.listen(3000, () => console.log('SPA running on http://localhost:3000'));

```

---

### 3. Edge Worker Implementation (Cloudflare Workers / Fastly / Vercel Edge)

If you host static assets on a CDN/S3/R2 and serve via an Edge Worker:

```typescript
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // 1. Generate unique 16-byte base64 nonce
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const nonce = btoa(String.fromCharCode(...bytes));

    // 2. Fetch the base static index.html
    const response = await fetch(request);

    // Only inject on HTML document responses
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    // 3. Rewrite HTML using HTMLRewriter to append the nonce attribute
    const rewriter = new HTMLRewriter()
      .on('script', {
        element(el) {
          el.setAttribute('nonce', nonce);
        },
      })
      .on('style', {
        element(el) {
          el.setAttribute('nonce', nonce);
        },
      });

    const transformedResponse = rewriter.transform(response);

    // 4. Attach CSP Header
    const newHeaders = new Headers(transformedResponse.headers);
    newHeaders.set(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'; style-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'none'; frame-ancestors 'none';`
    );

    return new Response(transformedResponse.body, {
      status: transformedResponse.status,
      statusText: transformedResponse.statusText,
      headers: newHeaders,
    });
  },
};

```

---

### 4. Bundler Configuration (Vite & Webpack)

When code-splitting creates dynamic imports (e.g. `React.lazy()`), `'strict-dynamic'` automatically trusts scripts loaded by a nonced root script. However, Webpack and dynamic CSS loaders may require runtime awareness of the nonce.

#### Vite (`index.html`)

In Vite, keep `<script type="module" src="/src/main.tsx"></script>` in your `index.html`. The server/edge injector replaces or adds `nonce="..."` during delivery.

#### Webpack (`__webpack_nonce__`)

If using Webpack dynamic chunk loading or CSS-in-JS:

```typescript
// src/index.tsx (Top of entry file before any imports)
declare let __webpack_nonce__: string;

// Read nonce injected into a meta tag or window global by the server
const serverNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
if (serverNonce) {
  __webpack_nonce__ = serverNonce;
}

```

---

### 5. Passing Nonces to UI Libraries & CSS-in-JS

If you use libraries that inject dynamic `<style>` tags at runtime (e.g., Emotion, Styled Components, StyleX):

#### Emotion (`@emotion/react` / Mantine / MUI)

```tsx
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// Read the nonce injected into DOM or server window object
const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');

const myCache = createCache({
  key: 'my-app',
  nonce: nonce || undefined,
});

export function App() {
  return (
    <CacheProvider value={myCache}>
      <RootComponent />
    </CacheProvider>
  );
}

```

---

### Summary Checklist

| Rule                                                                   | Requirement                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Never Use `<meta http-equiv="Content-Security-Policy">` for Nonces** | Nonces cached in static HTML violate the "number used once" requirement. CSP nonces **must** be generated per HTTP response via HTTP headers.    |
| **Combine Nonces with `'strict-dynamic'**`                             | Enables code-split bundles and dynamic `import()` promises to load child chunks without listing individual chunk URLs.                           |
| **Avoid `'unsafe-eval'**`                                              | Reject libraries that depend on `eval()` or `new Function()`.                                                                                    |
| **Deploy `Content-Security-Policy-Report-Only` First**                 | Test policy violations in staging without breaking production functionality by monitoring reports via the `report-to` or `report-uri` directive. |
