# Snippet: Environment-specific config selection

```js
const environments = {
  development: { logLevel: 'debug', dbPool: 2 },
  staging: { logLevel: 'info', dbPool: 5 },
  production: { logLevel: 'warn', dbPool: 20 },
};
const config = environments[process.env.NODE_ENV || 'development'];
console.log(config);
```

**Explanation:** A single lookup table keyed by `NODE_ENV` centralizes per-environment values in one place, resolved once. The `|| 'development'` fallback avoids `config` silently becoming `undefined` if `NODE_ENV` is unset — a real risk if a deploy pipeline forgets to set it.
