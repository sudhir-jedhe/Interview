# Problem: Basic Request Routing With Path Params, Without a Framework

## Problem Statement

Implement a `Router` for a raw `http` server that matches requests by method and path pattern, supporting path parameters like `/users/:id`, without depending on Express or any routing library.

## Requirements

- `router.get(pattern, handler)` / `.post(...)` / `.put(...)` / `.delete(...)` — register a handler for a method + path pattern.
- Patterns support named params with a leading colon (`/users/:id/posts/:postId`), each captured into `req.params`.
- `router.handle(req, res)` — dispatches an incoming request to the first matching registered route.
- No match on path → `404`. Path matches but method doesn't → `405` with an `Allow` header listing the methods that *do* match that path.
- Route matching must be based on path **segments**, not a naive string comparison (so `/users/42` matches `/users/:id` but `/users/42/extra` does not).

## Approach

Convert each registered pattern into an array of segments at registration time (e.g., `/users/:id` → `['users', ':id']`). To match an incoming path, split it into segments the same way and compare segment-by-segment: a segment starting with `:` matches any single non-empty segment and captures its value by name; any other segment must match literally. This avoids both a fragile regex-per-route approach and the O(n) full-string comparisons that don't handle params at all.

## Solution

```js
class Router {
  #routes = []; // { method, segments: string[], paramNames: string[], handler }

  #register(method, pattern, handler) {
    const segments = pattern.split('/').filter(Boolean);
    const paramNames = segments
      .map((seg, i) => (seg.startsWith(':') ? { name: seg.slice(1), index: i } : null))
      .filter(Boolean);
    this.#routes.push({ method, segments, paramNames, handler });
  }

  get(pattern, handler) { this.#register('GET', pattern, handler); return this; }
  post(pattern, handler) { this.#register('POST', pattern, handler); return this; }
  put(pattern, handler) { this.#register('PUT', pattern, handler); return this; }
  delete(pattern, handler) { this.#register('DELETE', pattern, handler); return this; }

  #matchPath(routeSegments, requestSegments) {
    if (routeSegments.length !== requestSegments.length) return null;
    const params = {};
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSeg = routeSegments[i];
      const reqSeg = requestSegments[i];
      if (routeSeg.startsWith(':')) {
        params[routeSeg.slice(1)] = decodeURIComponent(reqSeg);
      } else if (routeSeg !== reqSeg) {
        return null; // literal segment mismatch
      }
    }
    return params;
  }

  handle(req, res) {
    const urlPath = req.url.split('?')[0];
    const requestSegments = urlPath.split('/').filter(Boolean);

    const pathMatchesAnyMethod = [];

    for (const route of this.#routes) {
      const params = this.#matchPath(route.segments, requestSegments);
      if (params === null) continue;

      pathMatchesAnyMethod.push(route.method);
      if (route.method === req.method) {
        req.params = params;
        return route.handler(req, res);
      }
    }

    if (pathMatchesAnyMethod.length > 0) {
      res.writeHead(405, { Allow: pathMatchesAnyMethod.join(', ') });
      return res.end('Method Not Allowed');
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

module.exports = { Router };

// --- verification ---
const router = new Router();
router.get('/users/:id', (req, res) => res.end(`user ${req.params.id}`));
router.get('/users/:id/posts/:postId', (req, res) =>
  res.end(`user ${req.params.id}, post ${req.params.postId}`)
);
router.post('/users/:id', (req, res) => res.end('created'));

function fakeRequestResponse(method, url) {
  const chunks = [];
  const req = { method, url, params: undefined };
  const res = {
    writeHead: (code, headers) => { res.statusCode = code; res.headers = headers; },
    end: (data) => chunks.push(data),
  };
  router.handle(req, res);
  return { statusCode: res.statusCode ?? 200, body: chunks.join(''), headers: res.headers };
}

console.log(fakeRequestResponse('GET', '/users/42')); // { statusCode: 200, body: 'user 42', headers: undefined }
console.log(fakeRequestResponse('GET', '/users/42/posts/7')); // 'user 42, post 7'
console.log(fakeRequestResponse('DELETE', '/users/42')); // 405, Allow: 'GET, POST'
console.log(fakeRequestResponse('GET', '/users/42/extra')); // 404
```

**Why this works:** matching by segment count and per-segment comparison (rather than a single regex or string-prefix check) is what correctly rejects `/users/42/extra` against the `/users/:id` pattern — the segment counts differ, so it's an automatic non-match. Tracking `pathMatchesAnyMethod` across every route (not just the first path match) lets `handle` distinguish a true `404` (no route's path matches at all) from a `405` (the path matches some route, just not with this method), which is exactly the distinction real frameworks make and a naive "return 404 on first non-match" implementation would get wrong.
