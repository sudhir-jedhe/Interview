# Interview Q&A — Request & Response Basics

**Q: What does `req` represent in a raw Node `http.createServer` handler, and what kind of object is it?**
`req` is an `http.IncomingMessage`, and importantly it's a readable stream — the request body arrives asynchronously as data events, not as a pre-populated property. Headers and method/URL are available synchronously, but you must explicitly consume `req` (via `'data'`/`'end'` events or `for await...of`) to read the body.

**Q: Why does a request hang forever if you call `res.writeHead()` but never `res.end()`?**
Setting headers with `writeHead()` only prepares the status line/headers; nothing is actually flushed as a completed response to the client until `res.end()` is called (or enough data is written to trigger implicit flushing followed by `end()`). Without `end()`, the connection stays open indefinitely, and the client waits until it times out.

**Q: How do you implement manual routing in a raw `http` server?**
Parse `req.method` and `req.url` (typically via the `URL` class for clean pathname/query extraction), then match against a table of method+path combinations or pattern-match logic, dispatching to the appropriate handler and returning 404/405 for unmatched paths/methods.
```js
const { pathname } = new URL(req.url, `http://${req.headers.host}`);
if (req.method === 'GET' && pathname === '/users') { /* ... */ }
```

**Q: How do you set multiple headers and a status code together efficiently in raw Node HTTP?**
`res.writeHead(statusCode, headersObject)` sets the status and multiple headers in one call, and must be invoked before any `write()`/`end()` call that would otherwise flush headers implicitly with default values. Alternatively, call `res.setHeader(name, value)` multiple times before the first `write`/`end`, then `res.statusCode = 200`.
