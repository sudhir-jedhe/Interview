# Snippet: Consistent Success/Error Response Envelope Helpers

```js
function ok(res, data, meta) {
  return res.json(meta ? { data, meta } : { data });
}
function fail(res, status, message, code) {
  return res.status(status).json({ error: { message, code } });
}

app.get('/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return fail(res, 404, 'Product not found', 'PRODUCT_NOT_FOUND');
  ok(res, product);
});
```

**Explanation:** Two tiny helper functions centralize the response *shape* so no route hand-rolls its own JSON envelope — `ok()` always wraps success payloads in `{ data }` (optionally with `meta`), and `fail()` always wraps errors in `{ error: { message, code } }` paired with the correct HTTP status. This is a lightweight alternative to a full centralized error-handling middleware; it works well for straightforward success/failure branches directly inside a route handler.
