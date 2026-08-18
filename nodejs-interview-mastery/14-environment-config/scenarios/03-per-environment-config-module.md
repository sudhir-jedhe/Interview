# Scenario: You need different rate limits, log levels, and database pool sizes across dev, staging, and production

You're building a config module used across the whole codebase and want to avoid `if (process.env.NODE_ENV === 'production')` checks scattered through business logic.

**Approach:** Centralize environment-specific values into one config object, keyed by environment, resolved once at startup — the rest of the codebase imports the resolved config and never checks `NODE_ENV` directly:

```js
// config/index.js
const env = process.env.NODE_ENV || 'development';

const base = {
  env,
  port: Number(process.env.PORT) || 3000,
};

const overrides = {
  development: { logLevel: 'debug', dbPoolSize: 2, rateLimit: 1000 },
  staging: { logLevel: 'info', dbPoolSize: 5, rateLimit: 200 },
  production: { logLevel: 'warn', dbPoolSize: 20, rateLimit: 100 },
}[env];

if (!overrides) throw new Error(`Unknown NODE_ENV: ${env}`);

module.exports = { ...base, ...overrides };
```

```js
// elsewhere in the app
const config = require('./config');
app.use(rateLimit({ max: config.rateLimit }));
```

This keeps environment branching in exactly one place, makes it trivial to add a new environment (e.g., `test`), and means business logic never has to know or care what `NODE_ENV` currently is.
