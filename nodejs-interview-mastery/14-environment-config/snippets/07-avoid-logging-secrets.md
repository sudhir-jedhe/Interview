# Snippet: Never log secrets — a common accidental leak, and the safer alternative

```js
function logConfig(config) {
  const { password, apiKey, ...safe } = config; // strip sensitive keys before logging
  console.log('Loaded config:', safe);
}
logConfig({ host: 'db.internal', password: 'super-secret', apiKey: 'sk_live_xyz' });
```

**Explanation:** Destructuring out known-sensitive fields before logging the rest of an object is a simple guard against accidentally dumping secrets into logs (which often end up in a third-party log aggregator with broader access than the secret itself should have). For larger config objects, a denylist/allowlist-based redaction helper (or a logger's built-in redaction feature, like pino's `redact` option) scales better than manual destructuring at every call site.
