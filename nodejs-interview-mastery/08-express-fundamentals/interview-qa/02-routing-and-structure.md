# Interview Q&A — Routing and Structure

**Q: What's the difference between `app.use()` and `app.get()`?**
`app.use(path, fn)` matches any HTTP method and treats `path` as a prefix (e.g., `/api` matches `/api`, `/api/users`, etc.), commonly used for global middleware or mounting routers. `app.get(path, fn)` (and its siblings `post`/`put`/`delete`) only matches that specific HTTP method and does an exact route match against the path pattern.

**Q: How do you access route parameters and query string parameters in an Express handler?**
Route params (from the URL path, defined with `:name` in the route pattern) are on `req.params`; query string parameters (after `?`) are on `req.query`. Both are always strings — Express does not auto-coerce types.
```js
app.get('/users/:id', (req, res) => {
  console.log(req.params.id);   // path segment
  console.log(req.query.sort);  // ?sort=asc
});
```

**Q: What is `express.Router()` and why would you use it?**
`express.Router()` creates a modular, mini application object with its own routing and middleware, which can then be mounted onto a parent app (or another router) at a path prefix via `app.use(prefix, router)`. It's the standard way to organize routes by resource/feature into separate files instead of piling everything into one `app.js`.

**Q: How would you implement a global 404 handler in Express?**
Register a catch-all middleware after all your routes but before the error handler — since it's reached only if no earlier route matched:
```js
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});
```
