# devDependencies in a Production Install

```json
{
  "dependencies": { "express": "^4.19.0" },
  "devDependencies": { "nodemon": "^3.0.0" }
}
```

Running `npm install --omit=dev` (or `npm ci --omit=dev`), what ends up in `node_modules`?

**Answer:** `express` and its dependency tree only — `nodemon` and any packages exclusively required by it are skipped.

**Why:** The `--omit=dev` flag (or setting `NODE_ENV=production` in older npm versions) tells npm to skip installing anything listed only in `devDependencies`, since those are development/build-time tools not needed for the app to run in production, keeping the deployed `node_modules` smaller.
