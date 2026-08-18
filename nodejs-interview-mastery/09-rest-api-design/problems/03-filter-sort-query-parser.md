# Problem: Filtering + Sorting Query-Param Parser for a List Endpoint

## Problem statement

Implement a reusable parser for a list endpoint like `GET /products?sort=-price&category=shoes&minPrice=20&maxPrice=100` that turns query params into a structured filter/sort object a data layer can consume, without hardcoding per-field logic into every route.

## Requirements

- `sort=field` for ascending, `sort=-field` for descending; support a whitelist of sortable fields
- Arbitrary `key=value` filters restricted to a whitelist of filterable fields (never let clients filter on arbitrary/internal fields)
- Range filters using a `min<Field>` / `max<Field>` convention (e.g. `minPrice`, `maxPrice`)
- Reject unknown sort fields with a `400`, silently ignore unknown filter params (don't leak which fields exist to a poking attacker beyond the documented whitelist)
- Return something a plain in-memory array *or* a SQL query builder could consume

## Worked solution

```js
// utils/queryParser.js
function parseListQuery(query, { sortable = [], filterable = [] } = {}) {
  const result = { filters: {}, ranges: {}, sort: null, sortDir: 1 };

  // --- sort ---
  if (query.sort) {
    const desc = query.sort.startsWith('-');
    const field = desc ? query.sort.slice(1) : query.sort;
    if (!sortable.includes(field)) {
      const err = new Error(`Cannot sort by "${field}"`);
      err.status = 400;
      err.code = 'INVALID_SORT_FIELD';
      throw err;
    }
    result.sort = field;
    result.sortDir = desc ? -1 : 1;
  }

  // --- exact-match filters ---
  for (const field of filterable) {
    if (query[field] !== undefined) result.filters[field] = query[field];
  }

  // --- range filters: minX / maxX ---
  for (const field of filterable) {
    const capitalized = field[0].toUpperCase() + field.slice(1);
    const minKey = `min${capitalized}`;
    const maxKey = `max${capitalized}`;
    if (query[minKey] !== undefined || query[maxKey] !== undefined) {
      result.ranges[field] = {
        min: query[minKey] !== undefined ? Number(query[minKey]) : undefined,
        max: query[maxKey] !== undefined ? Number(query[maxKey]) : undefined,
      };
    }
  }

  return result;
}

module.exports = parseListQuery;
```

```js
// routes/products.js
const express = require('express');
const router = express.Router();
const parseListQuery = require('../utils/queryParser');

const SORTABLE = ['price', 'createdAt', 'name'];
const FILTERABLE = ['category', 'price'];

router.get('/products', (req, res, next) => {
  let parsed;
  try {
    parsed = parseListQuery(req.query, { sortable: SORTABLE, filterable: FILTERABLE });
  } catch (err) {
    return next(err); // 400 INVALID_SORT_FIELD, funneled to centralized error middleware
  }

  let results = getAllProducts(); // in-memory array for this example

  // exact-match filters
  for (const [field, value] of Object.entries(parsed.filters)) {
    results = results.filter(p => String(p[field]) === String(value));
  }

  // range filters
  for (const [field, { min, max } = {}] of Object.entries(parsed.ranges)) {
    if (min !== undefined) results = results.filter(p => p[field] >= min);
    if (max !== undefined) results = results.filter(p => p[field] <= max);
  }

  // sorting
  if (parsed.sort) {
    results = [...results].sort((a, b) => (a[parsed.sort] > b[parsed.sort] ? parsed.sortDir : -parsed.sortDir));
  }

  res.json({ data: results, meta: { total: results.length } });
});

module.exports = router;
```

**Example:** `GET /products?sort=-price&category=shoes&minPrice=20&maxPrice=100` parses to:
```js
{
  filters: { category: 'shoes' },
  ranges: { price: { min: 20, max: 100 } },
  sort: 'price',
  sortDir: -1,
}
```

The same `parsed` shape maps cleanly onto a real query builder — e.g. for `knex`, `parsed.filters` becomes `.where(parsed.filters)`, `parsed.ranges` becomes chained `.where(field, '>=', min).where(field, '<=', max)` calls, and `parsed.sort`/`parsed.sortDir` becomes `.orderBy(field, dir > 0 ? 'asc' : 'desc')` — keeping the parsing logic decoupled from the data-access layer.
