# package.json Dependency Fields

`package.json` distinguishes dependencies by *when* and *why* they're needed:

```json
{
  "dependencies": { "express": "^4.19.0" },
  "devDependencies": { "jest": "^29.0.0" },
  "peerDependencies": { "react": ">=18.0.0" },
  "optionalDependencies": { "fsevents": "^2.3.0" }
}
```

- **dependencies** — required at runtime in production; installed always.
- **devDependencies** — only needed for local development/testing/build (linters, test runners, bundlers); skipped with `npm install --omit=dev` or when `NODE_ENV=production` is set for install.
- **peerDependencies** — declares "this package expects the *consumer's* app to provide this dependency," typically used by plugins/libraries (e.g., a React component library declaring `react` as a peer rather than bundling its own copy, which would cause duplicate React instances). Since npm 7+, peer dependencies are auto-installed if not already present, unless there's a conflict, in which case npm errors (or warns, with `--legacy-peer-deps` to bypass).
- **optionalDependencies** — installed if possible, but a failed install doesn't fail the overall `npm install` — used for platform-specific native addons that aren't strictly required for the package to function.

## Comparison

| Aspect | dependencies | devDependencies | peerDependencies | optionalDependencies |
|---|---|---|---|---|
| Installed in production | Yes | No (with `--omit=dev`) | Auto-installed if missing (npm 7+) | Attempted, failure tolerated |
| Purpose | Runtime code needs it | Build/test/lint tooling only | "Host app must provide this" | Nice-to-have, platform-specific |
| Typical example | `express`, `lodash` | `jest`, `eslint`, `typescript` | `react` (for a component library) | `fsevents` (macOS-only) |

Use `dependencies` for anything imported by code that runs in production, `devDependencies` for anything only touched during development/CI build steps. The most common mistake is putting a build tool (like a bundler or TypeScript) in `dependencies` when it's only used at build time — bloating the production install and blurring what's actually needed at runtime.

## optionalDependencies in practice

If a package listed under `optionalDependencies` fails to install (e.g., a native addon that only builds on a specific OS), npm continues the overall install instead of failing it. Code relying on an optional dependency must handle its potential absence at runtime, typically with a `try/catch` around the `require()` call:

```js
let fsevents;
try {
  fsevents = require('fsevents');
} catch {
  fsevents = null; // gracefully degrade on platforms where it wasn't installed
}
```
