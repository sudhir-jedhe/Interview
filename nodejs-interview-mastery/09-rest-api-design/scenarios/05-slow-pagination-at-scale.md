# Scenario: A Dashboard List Endpoint Becomes Unusably Slow as the Table Grows

`GET /orders?page=500` takes 8+ seconds because the database has to scan and discard the first ~10,000 rows before returning the page, once the orders table passes a million rows.

**Approach:**
Switch that endpoint to cursor-based pagination using an indexed column (e.g. `id` or `createdAt`) instead of `OFFSET`, so each query does an indexed range lookup regardless of how deep the client pages.

```js
app.get('/orders', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const after = req.query.after ? Number(req.query.after) : 0;

  // indexed lookup, not OFFSET — fast at any depth
  const orders = await db.query(
    'SELECT * FROM orders WHERE id > $1 ORDER BY id ASC LIMIT $2',
    [after, limit]
  );

  const nextCursor = orders.length === limit ? orders[orders.length - 1].id : null;
  res.json({ data: orders, meta: { nextCursor } });
});
```
Document the breaking change (page-number jumping is no longer supported) and expose it as a new version or a clearly separate query interface if existing clients depend on `?page=N`.
