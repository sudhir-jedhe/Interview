# Snippet: Fail-fast config validation at startup

```js
function requireEnv(keys) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
requireEnv(['DATABASE_URL', 'SESSION_SECRET']);
console.log('Config OK');
```

**Explanation:** Checking all required environment variables up front, before the app starts serving traffic, turns a missing variable into an immediate, loud startup failure instead of a confusing runtime crash the first time a request happens to touch that missing value.
