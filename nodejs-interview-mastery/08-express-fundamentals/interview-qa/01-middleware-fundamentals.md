# Interview Q&A — Middleware Fundamentals

**Q: What is middleware in Express, and what signature must it have?**
Middleware is a function that has access to the request, response, and a `next` function, executed in the order it's registered: `(req, res, next)`. It can inspect/modify `req`/`res`, end the request-response cycle, or call `next()` to pass control to the next middleware in the stack. Every middleware must either call `next()` or send a response — doing neither hangs the request.

**Q: What happens if a middleware neither calls `next()` nor sends a response?**
The request hangs indefinitely — the client never receives a response and eventually times out. This is analogous to forgetting `res.end()` in a raw `http.createServer` handler; Express doesn't magically continue or terminate the chain for you.

**Q: What's the difference between built-in, third-party, and custom middleware, with examples of each?**
Built-in middleware ships with the `express` package itself (`express.json()`, `express.static()`). Third-party middleware comes from separate npm packages solving common cross-cutting concerns (`cors`, `helmet`, `morgan`). Custom middleware is application-specific logic you write yourself (auth checks, request tagging, tenant resolution).

**Q: Why does middleware registration order matter for `express.static()`?**
`express.static()` will serve a matching file directly and end the response without calling `next()`, short-circuiting the chain. If it's registered before a dynamic route handler for the same path, and a matching static file exists, the dynamic handler never runs — the static middleware "wins" simply by being registered earlier.
