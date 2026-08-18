# Snippet: Reading env vars with defaults and explicit type coercion

```js
const port = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
console.log(`Starting on port ${port}, production mode: ${isProd}`);
```

**Explanation:** `process.env.PORT` is always a string (or `undefined`), so `Number(...)` explicitly converts it before use, and `|| 3000` supplies a fallback if it's unset or empty. `isProd` is computed with a strict string equality check rather than relying on truthiness, since any non-empty string (including `"false"`) would otherwise evaluate as truthy.
