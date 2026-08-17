**`renderToReadableStream`** is the modern Server-Side Rendering (SSR) API designed specifically for **Edge runtimes** and environments that use standard **Web Streams** (such as Cloudflare Workers, Deno, and Vercel Edge).

It is the Web API equivalent of `renderToPipeableStream` (which is strictly for Node.js). It fully supports React 18's concurrent features, allowing you to stream HTML to the browser in chunks as data resolves within `<Suspense>` boundaries.

Here is a detailed breakdown of its API and how to implement the specific usage scenarios you mentioned.

---

## 1. Reference

### `const stream = await renderToReadableStream(reactNode, options?)`

* **`reactNode`**: The root React element of your application (e.g., `<App/>`).
* **`options` (Optional)**: A configuration object.
* `bootstrapScripts`: Array of script URLs to inject into the HTML to hydrate the page on the client.
* `onError`: A callback function fired when an error occurs during rendering.
* `signal`: An `AbortSignal` (from an `AbortController`) used to cancel the server rendering process.

**Returns:**
A Promise that resolves to a `ReadableStream`. This promise resolves as soon as the "shell" (the initial synchronous HTML) is ready.

---

## 2. Usage Scenarios

### Rendering a React tree as HTML to a Readable Web Stream

In an Edge environment, you wait for the stream to initialize, and then pass that stream directly into a standard Web API `Response` object.

```javascript
import { renderToReadableStream } from 'react-dom/server';
import App from './App';

export default async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' },
  });
}

```

### Streaming more content as it loads

If you wrap a slow component in a `<Suspense>` boundary, React will instantly send the fallback UI (like a loading skeleton) in the initial stream. Once the data resolves on the server, React automatically injects a script tag into the active stream that swaps the fallback with the fully rendered HTML. You don't need to write any custom chunking logic; it happens automatically.

### Specifying what goes into the shell

The "shell" consists of every component outside of a `<Suspense>` boundary. The promise returned by `renderToReadableStream` will not resolve until the entire shell is rendered. Therefore, you should keep the shell lightweight (e.g., navbar, layout structure) and wrap heavy data-fetching components in `<Suspense>` so the user receives the initial page structure immediately.

### Logging crashes on the server

To track server-side rendering errors without exposing sensitive stack traces to the client browser, use the `onError` callback.

```javascript
const stream = await renderToReadableStream(<App />, {
  onError(error) {
    console.error("SSR crashed:", error);
    // logToDatadogOrSentry(error);
  }
});

```

### Recovering from errors inside the shell

If an error occurs *before* the shell finishes rendering, the `renderToReadableStream` promise will reject. You must wrap the call in a `try...catch` block to handle this. If it catches, you should return a static fallback HTML response.

```javascript
try {
  const stream = await renderToReadableStream(<App />);
  return new Response(stream, { headers: { 'Content-Type': 'text/html' } });
} catch (error) {
  // The shell failed to render. Send a fallback error page.
  return new Response('<h1>Service Unavailable</h1>', { 
    status: 500,
    headers: { 'Content-Type': 'text/html' }
  });
}

```

### Recovering from errors outside the shell

If an error occurs *inside* a `<Suspense>` boundary after the shell has already been sent to the browser, the promise has already resolved. React cannot change the HTTP status code. Instead, it will log the error to `onError`, send the nearest `<ErrorBoundary>` fallback UI down the stream, and try to render the component again on the client side.

### Setting the status code

You can determine the HTTP status code based on whether an error was thrown during the initial shell rendering.

```javascript
let didError = false;

const stream = await renderToReadableStream(<App />, {
  onError(error) {
    didError = true;
  }
});

// If the shell errored but React recovered, send a 500. Otherwise, 200.
return new Response(stream, {
  status: didError ? 500 : 200,
  headers: { 'Content-Type': 'text/html' },
});

```

### Handling different errors in different ways

You can inspect the `error` object within the `onError` callback to dynamically adjust your response status (e.g., distinguishing between a 404 Not Found and a 500 Internal Server Error).

```javascript
let statusCode = 200;

const stream = await renderToReadableStream(<App />, {
  onError(error) {
    if (error.message.includes('Not Found')) {
      statusCode = 404;
    } else {
      statusCode = 500;
    }
  }
});

return new Response(stream, { status: statusCode });

```

### Waiting for all content to load for crawlers and static generation

Search engine bots and Static Site Generation (SSG) processes generally do not execute JavaScript or wait for streamed chunks. If you detect a crawler, you should wait for the entire React tree (including all `<Suspense>` boundaries) to finish rendering before returning the response. You do this using `stream.allReady`.

```javascript
const isCrawler = request.headers.get('User-Agent').includes('bot');

const stream = await renderToReadableStream(<App />);

if (isCrawler) {
  // Wait for all Suspense boundaries to resolve before returning the response
  await stream.allReady;
}

return new Response(stream, { headers: { 'Content-Type': 'text/html' } });

```

### Aborting server rendering

If a backend API is slow or hanging, you don't want the server stream to stay open indefinitely. You can force React to abandon server rendering and let the client-side JavaScript take over by passing an `AbortSignal`.

```javascript
const controller = new AbortController();

// Abort the server render if it takes longer than 5 seconds
setTimeout(() => {
  controller.abort();
}, 5000);

const stream = await renderToReadableStream(<App />, {
  signal: controller.signal,
});

return new Response(stream, { headers: { 'Content-Type': 'text/html' } });

```

*(If aborted, React will immediately flush whatever HTML it has, along with instructions for the client to finish rendering the rest of the application).*

---

### Note

**Environment strictly matters:** `renderToReadableStream` is strictly for environments that implement standard Web APIs (like Cloudflare, Deno, and modern browser APIs). If you are running a traditional Node.js server (like Express or Fastify), this API will not work optimally. You must use `renderToPipeableStream` instead.
