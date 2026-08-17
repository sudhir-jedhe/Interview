**`renderToString`** is a classic React Server-Side Rendering (SSR) API. It takes a React component tree and synchronously renders it into a static HTML string.

While it was the standard way to do SSR in older versions of React, it is now considered a legacy approach for full applications because it **does not support streaming** or `<Suspense>`. However, it is still used in specific scenarios like generating static emails or simple static sites.

Here is a detailed breakdown of the API, its pitfalls, and how to migrate away from it.

---

## 1. Reference

### `const html = renderToString(reactNode, options?)`

* **`reactNode`**: The root React element of your application (e.g., `<App/>`).
* **`options` (Optional)**: A configuration object.
* `identifierPrefix`: A string prefix used by the `useId` hook to generate unique IDs.

**Returns:**
A standard JavaScript string containing the fully rendered HTML. This HTML includes internal React attributes (like `data-reactroot`) so it can be hydrated by `hydrateRoot` on the client.

### ⚠️ Pitfall: No Streaming or Data Waiting

`renderToString` is completely **synchronous**. If you have a component that fetches data wrapped in `<Suspense>`, `renderToString` will **not wait** for the data. It will immediately render the Suspense fallback (like a loading spinner) into the HTML string and finish. The user will receive an HTML file with a spinner, and the actual data fetch will have to happen on the client side, ruining the SEO and performance benefits of SSR.

---

## 2. Usage

### Rendering a React tree as HTML to a string

In a traditional Node.js Express server, you generate the string and interpolate it into your main HTML template before sending it as the response.

```javascript
import { renderToString } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  // Synchronously generates the HTML string
  const appHtml = renderToString(<App />);

  // Inject it into a basic HTML template
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>My App</title></head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;

  res.send(fullHtml);
});

```

---

## 3. Alternatives & Migration Strategies

Because of its synchronous limitations, modern React applications should migrate away from `renderToString`.

### Migrating from `renderToString` to a streaming render on the server

If you are running a Node.js server (like Express) and want to support `<Suspense>` and streaming, replace `renderToString` with **`renderToPipeableStream`**.

**Old Code:**

```javascript
const html = renderToString(<App />);
res.send(html);

```

**New Code:**

```javascript
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/bundle.js'],
  onShellReady() {
    res.setHeader('Content-Type', 'text/html');
    pipe(res); // Streams the HTML in chunks
  }
});

```

*(If you are on an Edge runtime like Cloudflare or Deno, migrate to `renderToReadableStream` instead).*

### Migrating from `renderToString` to a static prerender on the server

If you are generating static HTML pages at build time (Static Site Generation / SSG) and need React to wait for all asynchronous data to resolve before saving the file, you cannot use `renderToString`. You must use the streaming APIs and wait for them to fully complete.

**Using `renderToPipeableStream` for SSG:**

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  // Use onAllReady instead of onShellReady. 
  // It waits for ALL Suspense boundaries to resolve.
  onAllReady() { 
    pipe(res);
  }
});

```

### Removing `renderToString` from the client code

Sometimes developers mistakenly use `renderToString` in the browser (client-side) to convert a React component into an HTML string to pass into a third-party library (like injecting a custom marker into Google Maps).

Importing `react-dom/server` on the client drastically inflates your bundle size and hurts performance.

**The Fix:** Instead of rendering a string, create a temporary DOM node and use `createRoot` to render the React component directly into the third-party library's container.

```javascript
// ❌ BAD: Bundling server code on the client
import { renderToString } from 'react-dom/server';
const htmlString = renderToString(<Tooltip />);
googleMapMarker.setContent(htmlString); 

// ✅ GOOD: Using standard client rendering
import { createRoot } from 'react-dom/client';
const container = document.createElement('div');
const root = createRoot(container);
root.render(<Tooltip />);
googleMapMarker.setContent(container);

```

---

## 4. Troubleshooting

### My Suspense boundaries only render fallbacks

**Symptom:** You implemented `<Suspense>` and data fetching, but the server only ever returns the HTML for the loading spinner.
**Cause:** `renderToString` is synchronous. It cannot pause execution to wait for a Promise to resolve.
**Fix:** You must migrate your server to `renderToPipeableStream` (Node) or `renderToReadableStream` (Edge).

### I get a hydration mismatch error in the browser

**Symptom:** The server sends the HTML, but when the browser loads, the screen flashes and the console warns about a hydration mismatch.
**Cause:** The HTML string generated by `renderToString` must be completely identical to the HTML expected by `hydrateRoot` on the client. If your component uses browser-only APIs (`window.innerWidth`) or dynamic data (`Math.random()`, `new Date()`) during the initial render, the client HTML will differ from the server HTML.
**Fix:** Ensure the initial render is deterministic. Move browser-specific logic into a `useEffect` hook, which only runs on the client after hydration is complete.
