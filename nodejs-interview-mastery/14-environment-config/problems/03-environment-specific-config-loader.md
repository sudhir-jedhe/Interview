# Problem: Environment-Specific Config Loading With Fallbacks

## Problem statement

Implement a config loader that resolves settings differently for `development`, `staging`, and `production`, with sensible fallbacks: unknown/unset environments fall back to `development`, per-environment overrides layer on top of shared base defaults, and individual values can still be overridden by explicit environment variables without editing code.

## Requirements

- Define one shared `base` config plus per-environment `overrides` objects.
- `NODE_ENV` selects which override set applies; an unset or unrecognized `NODE_ENV` falls back to `development` (with a warning, not a hard failure — unlike the strict "missing required var" case, this one should be forgiving since local/dev usage is common).
- Explicit environment variables (e.g. `PORT`, `LOG_LEVEL` set directly in the shell/container) should override whatever the environment-specific defaults say — env vars are the most specific, most intentional signal, so they win.
- Return one fully-resolved, flat config object — consumers should never need to check `NODE_ENV` themselves.

## Solution

```js
// config.js
const KNOWN_ENVIRONMENTS = ['development', 'staging', 'production'];

const base = {
  appName: 'my-service',
};

const overridesByEnv = {
  development: { logLevel: 'debug', dbPoolSize: 2, rateLimit: 1000, port: 3000 },
  staging: { logLevel: 'info', dbPoolSize: 5, rateLimit: 200, port: 3000 },
  production: { logLevel: 'warn', dbPoolSize: 20, rateLimit: 100, port: 8080 },
};

function resolveEnvironment(rawEnv) {
  if (KNOWN_ENVIRONMENTS.includes(rawEnv)) return rawEnv;
  console.warn(
    `Unknown or unset NODE_ENV ("${rawEnv}") — falling back to "development". ` +
      `Set NODE_ENV explicitly in staging/production deployments.`
  );
  return 'development';
}

function loadConfig(env = process.env) {
  const resolvedEnv = resolveEnvironment(env.NODE_ENV);
  const envDefaults = overridesByEnv[resolvedEnv];

  const config = {
    ...base,
    ...envDefaults,
    env: resolvedEnv,
  };

  // Explicit environment variables win over environment-specific defaults.
  if (env.PORT) config.port = Number(env.PORT);
  if (env.LOG_LEVEL) config.logLevel = env.LOG_LEVEL;
  if (env.RATE_LIMIT) config.rateLimit = Number(env.RATE_LIMIT);
  if (env.DB_POOL_SIZE) config.dbPoolSize = Number(env.DB_POOL_SIZE);

  return config;
}

module.exports = { loadConfig };
```

```js
// usage
const { loadConfig } = require('./config');

// Example 1: NODE_ENV=production, no explicit overrides
// -> { appName: 'my-service', logLevel: 'warn', dbPoolSize: 20, rateLimit: 100, port: 8080, env: 'production' }

// Example 2: NODE_ENV=production, PORT=5000 set explicitly
// -> same as above, but port: 5000 (explicit env var wins over the production default of 8080)

// Example 3: NODE_ENV unset
// -> warns, falls back to development defaults
const config = loadConfig();
console.log(config);
```

**How it works:** `resolveEnvironment` maps any `NODE_ENV` value to one of the three known environments, warning (but not throwing) and defaulting to `development` for anything unrecognized — appropriate here since a missing `NODE_ENV` locally is common and shouldn't be a hard failure the way a missing secret would be. `loadConfig` layers `base` (shared across all environments) under `envDefaults` (the resolved environment's specific values), then applies any explicit environment variables on top, so the precedence order — explicit env var > environment-specific default > shared base — is applied consistently and predictably regardless of which environment is active.
