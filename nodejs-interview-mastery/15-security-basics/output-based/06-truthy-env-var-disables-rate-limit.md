# Output-Based: a truthy `"false"` string silently disables a control

```js
process.env.DISABLE_RATE_LIMIT = 'false';
const rateLimitDisabled = process.env.DISABLE_RATE_LIMIT;
if (rateLimitDisabled) {
  console.log('Rate limiting is OFF');
} else {
  console.log('Rate limiting is ON');
}
```

**Answer:** `Rate limiting is OFF`

**Why:** `process.env.DISABLE_RATE_LIMIT` holds the string `"false"`, which is truthy in JavaScript — the `if` branch taken has nothing to do with the semantic meaning of the string. A misconfigured env var like this can silently disable a security control in production. Always compare explicitly: `if (rateLimitDisabled === 'true')`.
