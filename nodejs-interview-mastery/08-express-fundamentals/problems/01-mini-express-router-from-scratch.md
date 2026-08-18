# Problem: Implement a Minimal Express-Like Router From Scratch

## Problem Statement

Implement a `MiniRouter` that replicates the core parts of Express's routing model: method + path matching (including `:param` segments) and a middleware chain driven by `next()`, without depending on Express itself.

## Requirements

- `router.use(fn)` — registers app-level middleware that runs for every request, regardless of method/path.
- `router.get(path, ...handlers)` / `.post(...)` / `.put(...)` / `.delete(...)` — registers one or more handlers for a method + path pattern. Multiple handlers for the same route must run in order via `next()`, just like real Express.
- Path patterns support `:name` params, captured into `req.params`.
- `router.handle(req, res)` walks global middleware first, then matching route handlers, in overall registration order — calling `next()` advances to the next matching layer; **not** calling `next()` and not sending a response should simply stop the chain (mirroring the real hang behavior).
- If nothing matches, respond with a `404` automatically once the whole stack is exhausted without anyone sending a response.
- A handler can short-circuit by sending a response instead of calling `next()`.

## Approach

Model the router as a single ordered list of "layers." Global middleware (`use`) becomes a layer that matches any method/path. Route handlers become layers scoped to a method + path pattern, further split by segment for param matching (the same segment-matching technique used in the raw-`http` router problem). `handle()` walks the layer list with an index-based `next()` closure: each call to `next()` advances the index and invokes the next matching layer, or falls through to an automatic 404 if the list is exhausted.

## Solution

```js
function compilePath(pattern) {
  if (pattern === undefined) return null; // undefined pattern = matches everything (like app.use(fn))
  const segments = pattern.split('/').filter(Boolean);
  return segments;
}

function matchSegments(patternSegments, requestSegments) {
  if (patternSegments === null) return {}; // wildcard middleware: no path to match, no params
  if (patternSegments.length !== requestSegments.length) return null;

  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const p = patternSegments[i];
    const r = requestSegments[i];
    if (p.startsWith(':')) {
      params[p.slice(1)] = decodeURIComponent(r);
    } else if (p !== r) {
      return null;
    }
  }
  return params;
}

class MiniRouter {
  #layers = []; // { method: string|null, segments: string[]|null, handler }

  use(fn) {
    this.#layers.push({ method: null, segments: null, handler: fn });
    return this;
  }

  #registerMethod(method, path, handlers) {
    const segments = compilePath(path);
    for (const handler of handlers) {
      this.#layers.push({ method, segments, handler });
    }
    return this;
  }

  get(path, ...handlers) { return this.#registerMethod('GET', path, handlers); }
  post(path, ...handlers) { return this.#registerMethod('POST', path, handlers); }
  put(path, ...handlers) { return this.#registerMethod('PUT', path, handlers); }
  delete(path, ...handlers) { return this.#registerMethod('DELETE', path, handlers); }

  handle(req, res) {
    const urlPath = req.url.split('?')[0];
    const requestSegments = urlPath.split('/').filter(Boolean);

    let index = 0;

    const next = (err) => {
      if (err) {
        // No error-handling layers in this minimal router — surface it directly.
        res.writeHead ? res.writeHead(500) : (res.statusCode = 500);
        return res.end(`Internal Server Error: ${err.message}`);
      }

      while (index < this.#layers.length) {
        const layer = this.#layers[index++];

        // Global middleware (method === null) matches every method.
        if (layer.method !== null && layer.method !== req.method) continue;

        const params = matchSegments(layer.segments, requestSegments);
        if (params === null) continue;

        req.params = { ...req.params, ...params };
        return layer.handler(req, res, next);
      }

      // Exhausted the stack with nobody sending a response: auto-404.
      res.writeHead ? res.writeHead(404) : (res.statusCode = 404);
      res.end('Not Found');
    };

    next();
  }
}

module.exports = { MiniRouter };

// --- verification ---
function fakeReqRes(method, url) {
  const chunks = [];
  const req = { method, url, params: {} };
  const res = {
    writeHead(code) { res.statusCode = code; },
    end(data) { chunks.push(data); },
  };
  return { req, res, body: () => chunks.join('') };
}

const router = new MiniRouter();

router.use((req, res, next) => {
  req.log = req.log || [];
  req.log.push('logger');
  next();
});

router.get('/users/:id', (req, res, next) => {
  req.log.push('handler A');
  next();
}, (req, res) => {
  req.log.push('handler B');
  res.writeHead(200);
  res.end(`user ${req.params.id}: ${req.log.join(',')}`);
});

router.post('/users/:id', (req, res) => {
  res.writeHead(201);
  res.end('created');
});

let t = fakeReqRes('GET', '/users/42');
router.handle(t.req, t.res);
console.log(t.body()); // "user 42: logger,handler A,handler B"

t = fakeReqRes('GET', '/unknown/path');
router.handle(t.req, t.res);
console.log(t.res.statusCode, t.body()); // 404 "Not Found"
```

**Why this works:** using a single flat `#layers` array (rather than separate arrays per method) means middleware and route handlers interleave in true registration order, exactly like real Express — a `router.use()` call placed between two `router.get()` calls really does only apply to routes registered after it. The `next` closure captures `index` so each call resumes exactly where the previous layer left off, and the automatic 404 at the end of the `while` loop replicates Express's real fallback behavior when nothing in the stack ever sends a response.
