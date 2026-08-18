# Scenario: implementing pagination over a large in-memory array

**Prompt:** You have an array of 10,000 records and need a `paginate(data, page, pageSize)` function used across the app for tables. How do you implement it, and what edge cases (out-of-range pages, last partial page, empty data) do you need to handle?

**Approach:**

```js
function paginate(data, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: data.slice(start, start + pageSize), // non-mutating — safe to call repeatedly
    page: safePage,
    totalPages,
    totalItems: data.length,
  };
}

paginate([], 1, 10);          // { items: [], page: 1, totalPages: 1, totalItems: 0 }
paginate([1,2,3], 5, 2);      // clamps to last valid page: page 2, items [3]
```

Edge cases handled: empty array (avoid `Math.ceil(0/pageSize)` producing `0` total pages and confusing UI), requesting a page beyond range (clamp rather than returning an empty slice silently), and `pageSize` of `0` or negative (should probably throw or default, since it would otherwise produce `Infinity` total pages or an infinite loop upstream if not guarded). `slice` is used deliberately over `splice` because pagination must never mutate the underlying dataset.
