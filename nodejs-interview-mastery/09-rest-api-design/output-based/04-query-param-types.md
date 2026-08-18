# Output-Based: Query Param Types

```js
app.get('/products', (req, res) => {
  const { inStock } = req.query;
  res.json({ isTrue: inStock === true, typeofValue: typeof inStock });
});

// client requests GET /products?inStock=true
```

**Answer:** `{ "isTrue": false, "typeofValue": "string" }`

**Why:** Everything in `req.query` arrives as a string (or array/object of strings) — there is no automatic type coercion. `inStock` is the string `"true"`, not the boolean `true`, so a strict `===` comparison against the boolean fails. You must explicitly parse (`inStock === 'true'`) or validate/coerce with a schema library.
