**`renderToPipeableStream`** is the modern Server-Side Rendering (SSR) API designed specifically for Node.js environments. It renders a React tree to HTML and pipes it into a Node.js Writable Stream.

Crucially, it fully supports React 18's **Streaming** and **Suspense** features. Instead of waiting for all data to load on the server before sending the page, it immediately sends the "shell" of your app (the layout and loading states), and then streams the remaining content to the browser as the data resolves.

Here is a detailed breakdown of the API and its specific use cases.

---

## 1. Reference

### `const { pipe, abort } = renderToPipeableStream(reactNode, options?)`

* **`reactNode`**: The root React element of your application (e.g., `<App/>`).
* **`options`**: An object containing configuration and lifecycle callbacks.
* `bootstrapScripts`: Array of script URLs (like your bundled client-side React code) to inject into the HTML so the page can hydrate.
* `onShellReady`: Callback fired when the initial synchronous HTML (the shell) is ready to be sent.
* `onShellError`: Callback fired if an error occurs *before* the shell can finish rendering.
* `onAllReady`: Callback fired when all `<Suspense>` boundaries have completely resolved.
* `onError`: Callback fired whenever any error occurs during rendering.

**Returns:**

* **`pipe(writableStream)`**: A function that pipes the generated HTML into a Node.js stream (like an Express `res` object).
* **`abort()`**: A function to forcefully stop server rendering and let the client take over.

---

## 2. Usage Scenarios

### Rendering a React tree as HTML to a Node.js Stream

This is the basic setup for an Express server. You use `onShellReady` to set the headers and begin piping the HTML to the response object.

```javascript
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

app.use('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res); // Start streaming the HTML
    }
  });
});

```

### Streaming more content as it loads

If you wrap a slow component in `<Suspense>`, `renderToPipeableStream` will immediately send the fallback UI (like a spinner) to the browser in the initial shell.
When the server finishes fetching the data for the slow component, React automatically sends an inline `<script>` tag down the same HTTP stream that replaces the spinner with the actual HTML. You do not need to write any extra code to make this happen; React handles the stream chunking automatically.

### Specifying what goes into the shell

The "shell" is everything in your React tree that is **outside** of any `<Suspense>` boundaries, or components that don't rely on asynchronous data.
To ensure the user gets a fast initial paint, you should keep the shell lightweight (e.g., navbar, footer, basic layout). Wrap anything that does data fetching in `<Suspense>` so it doesn't block the shell from being sent.

### Logging crashes on the server

By default, React silences server errors to prevent leaking sensitive information to the client. To log these errors to your monitoring service (like Sentry), use the `onError` callback.

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  onError(error) {
    console.error("Server rendering crashed:", error);
    // logToSentry(error);
  }
});

```

### Recovering from errors inside the shell

If an error occurs *outside* of any `<Suspense>` boundary, the entire shell crashes. Because nothing has been sent to the user yet, the `onShellError` callback will fire. Here, you should send a fallback static HTML error page.

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(res);
  },
  onShellError(error) {
    res.status(500);
    res.send('<h1>Something went terribly wrong.</h1>');
  }
});

```

### Recovering from errors outside the shell

If an error occurs *inside* a `<Suspense>` boundary (e.g., a database query fails), the shell has likely already been sent to the user. React cannot un-send the HTML.
Instead, React will emit the error to the `onError` callback, send the nearest `<ErrorBoundary>` fallback HTML down the stream, and attempt to retry rendering that component on the client-side once the JavaScript loads.

### Setting the status code

You typically set the `res.status(200)` inside `onShellReady`. However, if an error occurred anywhere in the tree before the shell finished, you might want to send a `500` status code instead, even if React was able to recover using an Error Boundary.

```javascript
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  onError(error) {
    didError = true; // Catch the error
  },
  onShellReady() {
    res.status(didError ? 500 : 200);
    pipe(res);
  }
});

```

### Handling different errors in different ways

You can inspect the `error` object inside `onError` to adjust your server response. For example, if you throw a custom `NotFoundError`, you can detect it and change the status code to 404 instead of 500.

```javascript
let statusCode = 200;

const { pipe } = renderToPipeableStream(<App />, {
  onError(error) {
    if (error.message === 'Not Found') {
      statusCode = 404;
    } else {
      statusCode = 500;
      console.error(error);
    }
  },
  onShellReady() {
    res.status(statusCode);
    pipe(res);
  }
});

```

### Waiting for all content to load for crawlers and static generation

Search engine crawlers or Static Site Generation (SSG) scripts often do not support streaming or executing the inline JavaScript required to resolve Suspense boundaries.
For these specific requests, you should wait until *everything* is ready before piping the response. Use `onAllReady` instead of `onShellReady`.

```javascript
const isCrawler = req.headers['user-agent'].includes('bot');

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    if (!isCrawler) {
      pipe(res); // Stream for normal users
    }
  },
  onAllReady() {
    if (isCrawler) {
      pipe(res); // Send fully loaded HTML for bots
    }
  }
});

```

### Aborting server rendering

If your server takes too long to fetch data (e.g., a third-party API is down), the HTTP stream will hang, leaving the user with a blank screen or an eternal spinner.
To prevent this, use `setTimeout` to call the `abort()` method after a few seconds. React will immediately flush the rest of the HTML with client-side fallback instructions, forcing the user's browser to take over the rendering process.

```javascript
const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(res);
  }
});

// If the server takes longer than 10 seconds, abort the stream
setTimeout(() => {
  abort();
}, 10000);

```
