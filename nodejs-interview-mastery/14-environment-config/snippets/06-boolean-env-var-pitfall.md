# Snippet: Boolean env var pitfall and the correct fix

```js
process.env.FEATURE_X = 'false';
console.log(Boolean(process.env.FEATURE_X)); // true (wrong! non-empty string is truthy)
console.log(process.env.FEATURE_X === 'true'); // false (correct check)
```

**Explanation:** `process.env.FEATURE_X` holds the literal string `"false"`, and every non-empty string is truthy in JavaScript, so naive `Boolean(...)` coercion or `if (process.env.FEATURE_X)` gives the wrong answer. Comparing explicitly against the expected string value (`=== 'true'`) is the correct pattern for boolean-like environment variables.
