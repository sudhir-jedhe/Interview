# Problem: A Config Module That Validates Required Env Vars at Startup

## Problem statement

Implement a config module that validates a set of required environment variables are present (and, where specified, correctly typed) at startup, throwing a single clear error listing everything that's missing or invalid — rather than crashing on the first missing value encountered mid-request.

## Requirements

- Accept a schema describing each variable: whether it's required, its expected type (`string`, `number`, `boolean`), and an optional default value.
- Collect *all* validation problems before throwing, not just the first one — a deploy with 3 missing variables should report all 3 in one error, not require 3 rounds of trial and error.
- Coerce typed values (`number`, `boolean`) from the raw string, and include type-coercion failures in the same error report (e.g., `PORT=not-a-number`).
- Apply defaults for optional variables that are unset.
- On success, return a plain object with the validated, coerced values — not a proxy back to `process.env`.

## Solution

```js
// config.js
function coerce(rawValue, type, key) {
  if (type === 'string') return rawValue;

  if (type === 'number') {
    const n = Number(rawValue);
    if (Number.isNaN(n)) throw new Error(`${key} must be a number, got "${rawValue}"`);
    return n;
  }

  if (type === 'boolean') {
    if (rawValue === 'true') return true;
    if (rawValue === 'false') return false;
    throw new Error(`${key} must be "true" or "false", got "${rawValue}"`);
  }

  throw new Error(`Unknown type "${type}" for ${key}`);
}

function loadConfig(schema, env = process.env) {
  const result = {};
  const errors = [];

  for (const [key, spec] of Object.entries(schema)) {
    const { required = false, type = 'string', default: defaultValue } = spec;
    const rawValue = env[key];

    if (rawValue === undefined || rawValue === '') {
      if (required) {
        errors.push(`Missing required env var: ${key}`);
        continue;
      }
      result[key] = defaultValue;
      continue;
    }

    try {
      result[key] = coerce(rawValue, type, key);
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid configuration — ${errors.length} problem(s):\n` +
        errors.map((e) => `  - ${e}`).join('\n')
    );
  }

  return result;
}

module.exports = { loadConfig };
```

```js
// usage
const { loadConfig } = require('./config');

const schema = {
  DATABASE_URL: { required: true, type: 'string' },
  SESSION_SECRET: { required: true, type: 'string' },
  PORT: { required: false, type: 'number', default: 3000 },
  ENABLE_METRICS: { required: false, type: 'boolean', default: false },
};

let config;
try {
  config = loadConfig(schema);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

console.log('Config loaded:', config);
```

Example output when `DATABASE_URL` and `SESSION_SECRET` are both missing, and `PORT=not-a-number`:

```
Invalid configuration — 3 problem(s):
  - Missing required env var: DATABASE_URL
  - Missing required env var: SESSION_SECRET
  - PORT must be a number, got "not-a-number"
```

**How it works:** `loadConfig` iterates the whole schema and accumulates every problem into an `errors` array instead of throwing on the first one, so a single run surfaces the complete picture of what's wrong. `coerce` handles type conversion per declared type and throws a descriptive message on failure, which gets caught and added to the same error list rather than crashing immediately. Only after checking every key does the function either throw one combined error (readable in a deploy log at a glance) or return the fully validated, typed config object.
