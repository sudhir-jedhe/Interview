# Snippet: Pagination, Filtering, and Sorting via Query Params

```js
app.get('/orders', (req, res) => {
  const { status, sort = 'createdAt', page = 1, limit = 20 } = req.query;
  let results = getAllOrders();

  if (status) results = results.filter(o => o.status === status);

  const dir = sort.startsWith('-') ? -1 : 1;
  const key = sort.replace('-', '');
  results.sort((a, b) => (a[key] > b[key] ? dir : -dir));

  const start = (page - 1) * limit;
  const paged = results.slice(start, start + Number(limit));

  res.json({
    data: paged,
    meta: { page: Number(page), limit: Number(limit), total: results.length },
  });
});
```

**Explanation:** Filtering, sorting, and pagination all live in query params rather than the URL path, keeping the resource identity (`/orders`) stable regardless of how the list is sliced. The `sort` param uses a `-` prefix convention to signal descending order (`-createdAt` vs `createdAt`) — a common REST API convention (used by JSON:API and others). `page`/`limit` here are strings from `req.query` until coerced with `Number(...)`; forgetting that coercion is a classic bug (string concatenation instead of numeric slicing).
