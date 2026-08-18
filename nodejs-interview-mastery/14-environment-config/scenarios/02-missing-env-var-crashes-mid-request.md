# Scenario: Your app crashes in production with a confusing error three requests after deploy, instead of at startup

You're debugging a production incident: the app starts fine, serves a few requests successfully, then throws `Cannot read properties of undefined (reading 'host')` when a specific code path tries to read a database config value that turns out to be `undefined`.

**Approach:** The root cause is almost always a missing environment variable that isn't validated at startup — the failure only surfaces once a request happens to hit the code path that uses it. Fix this by validating all required config eagerly, before the server starts accepting traffic, so a missing variable becomes an immediate, loud startup failure instead of an intermittent runtime crash:

```js
// config.js — validate once, at boot
const required = ['DATABASE_URL', 'REDIS_URL', 'SESSION_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`FATAL: missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  sessionSecret: process.env.SESSION_SECRET,
};
```

For anything beyond a handful of variables, use a schema validation library (`zod`, `joi`, `envalid`) to also catch type/shape issues (e.g., `PORT` not being numeric) at the same startup gate, rather than one variable at a time.
