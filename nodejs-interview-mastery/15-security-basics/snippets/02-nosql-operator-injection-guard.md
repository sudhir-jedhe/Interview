# Snippet: NoSQL operator-injection guard for MongoDB-style queries

```js
function sanitizeQueryValue(value) {
  if (value !== null && typeof value === 'object') {
    throw new Error('Invalid input: objects not allowed in this field');
  }
  return value;
}
const safeEmail = sanitizeQueryValue({ $ne: null }); // throws, blocking the injection attempt
```

**Explanation:** MongoDB query operators (`$ne`, `$gt`, `$where`) are valid JS object keys, so an attacker can submit `{ "$ne": null }` in place of an expected string field to bypass an equality check. `sanitizeQueryValue` rejects any non-null object where a primitive was expected, closing that class of bug before the value ever reaches a query.
