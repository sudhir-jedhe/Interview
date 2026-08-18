# Migrating a Large CJS Codebase to ESM Incrementally

Leadership wants ESM adopted for its top-level await and better tree-shaking in the build pipeline, but a full rewrite in one PR is too risky.

**Approach:** Use the `.cjs`/`.mjs` extension escape hatch so both systems coexist regardless of the package's `"type"` setting — this lets you migrate file-by-file rather than all-or-nothing:

```json
// package.json — leave "type" unset or "commonjs" during transition
{ "name": "app", "main": "index.cjs" }
```

```js
// newly migrated files use .mjs explicitly
// utils.mjs
export function formatDate(d) { return d.toISOString(); }
```

```js
// old files stay .cjs and consume new ESM files via dynamic import
// legacy.cjs
async function run() {
  const { formatDate } = await import('./utils.mjs');
  console.log(formatDate(new Date()));
}
run();
```

Once every file is migrated, flip `"type": "module"` in `package.json`, rename `.cjs`→ (delete, no longer needed) and `.mjs`→`.js` for cleanliness, and remove the dynamic-import shims in favor of static imports. See `../theory/03-esm-basics.md` for the extension rules this relies on.
