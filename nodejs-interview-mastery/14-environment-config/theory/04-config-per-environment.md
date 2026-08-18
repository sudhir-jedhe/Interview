# Environment & Configuration — Structuring Config Per Environment

## A config module pattern

A common pattern is a small config module that reads `process.env`, applies defaults, and — ideally — validates the shape once at startup rather than letting a missing variable blow up mysteriously three requests into production traffic:

```js
// config.js
function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: required('DATABASE_URL'),
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

Failing fast at startup (rather than at the moment a route first touches a missing config value) turns a confusing runtime bug into an immediate, obvious deploy failure — much easier to debug.

## `NODE_ENV`

`NODE_ENV` is a convention, not a Node.js language feature — it's just an environment variable that libraries have agreed to check. Express is the canonical example: when `NODE_ENV=production`, Express enables view caching and disables verbose error pages by default. Many other tools follow suit — some npm packages skip `devDependencies` install steps, some ORMs disable verbose query logging, bundlers strip `if (process.env.NODE_ENV !== 'production')` blocks (dead-code elimination) entirely from production bundles. Always set `NODE_ENV=production` explicitly in production deployments rather than relying on a default, since an unset `NODE_ENV` is treated as `development` by most tooling — including Express — with real performance and information-disclosure consequences.

### `NODE_ENV=development` (or unset) vs `NODE_ENV=production`

| Aspect | development / unset | production |
|---|---|---|
| Express view caching | Disabled (re-renders templates from disk each request) | Enabled (compiled views cached in memory) |
| Error verbosity (many frameworks) | Full stack traces exposed | Generic error messages by convention |
| npm install behavior | Installs `devDependencies` | `npm ci --omit=dev` skips them if flagged |
| Performance | Slower, dev-friendly (fast iteration) | Optimized for throughput |

## Centralizing per-environment values

Rather than scattering `if (process.env.NODE_ENV === 'production')` checks through business logic, resolve environment-specific values into one config object, once, at startup:

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

This keeps environment branching in exactly one place, makes it trivial to add a new environment (e.g., `test`), and means business logic never has to know or care what `NODE_ENV` currently is.
