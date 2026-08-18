# Pagination Strategies

Large collections need pagination — returning every row of a million-row table in one response is both slow and wasteful. There are two dominant approaches, and picking the wrong one for your data access pattern causes real production problems.

## Offset/page pagination

```js
GET /orders?page=2&limit=20
```

Simple to implement and simple for users to reason about ("jump to page 5"). Under the hood it typically maps to `LIMIT ... OFFSET ...` in SQL, which means the database has to scan and discard every row before the offset — this gets slower as the offset grows, and on a table with a million rows, `?page=500` can take seconds.

## Cursor-based pagination

```js
GET /orders?after=eyJpZCI6NDJ9&limit=20
```

Instead of a page number, the client sends an opaque cursor (commonly an encoded ID or sort key) pointing at the last item it saw. The server does an indexed range query instead of an offset scan:

```js
app.get('/orders', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const after = req.query.after ? Number(req.query.after) : 0;

  const orders = await db.query(
    'SELECT * FROM orders WHERE id > $1 ORDER BY id ASC LIMIT $2',
    [after, limit]
  );

  const nextCursor = orders.length === limit ? orders[orders.length - 1].id : null;
  res.json({ data: orders, meta: { nextCursor } });
});
```

## Offset vs Cursor pagination compared

| Aspect | Offset/page pagination (`?page=2&limit=20`) | Cursor pagination (`?after=eyJpZCI6NDJ9`) |
|---|---|---|
| Simplicity | Very simple, human-readable, jumpable ("go to page 5") | More complex, opaque cursor token |
| Consistency under writes | Can skip/duplicate rows if data is inserted/deleted between requests | Stable — cursor is tied to a specific row, unaffected by inserts elsewhere |
| Performance at scale | `OFFSET` gets slower on large tables (DB must scan and discard rows) | Consistently fast — indexed lookup on the cursor key |

**Which to pick, and why:** use offset pagination for small/admin datasets where "jump to page N" UX genuinely matters and the table will never grow large. Use cursor pagination for large, frequently-changing, or infinite-scroll datasets — it's the default choice for any public-facing, high-volume list endpoint. The common mistake is using offset pagination on a high-write table and being surprised when users see duplicate or missing items across pages because rows shifted position between requests.
