# node_modules Resolution Algorithm

When you `require('foo')` or `import 'foo'`, Node looks for a `node_modules/foo` directory starting in the current file's directory, then walks **up** the directory tree, checking each ancestor's `node_modules` until it reaches the filesystem root:

```
/project/src/routes/users.js requires 'express'
-> /project/src/routes/node_modules/express?  (no)
-> /project/src/node_modules/express?          (no)
-> /project/node_modules/express?              (yes, found)
```

This is why a single top-level `node_modules` at the project root satisfies requires from any nested file — and why modern npm "hoists" shared dependencies to the top level when possible, rather than nesting a copy inside every package that needs it, to save disk space and installation time.

## Nested overrides for conflicting versions

When two packages need incompatible versions of the same dependency, npm nests a private copy inside the dependent package's own `node_modules` rather than forcing a single shared version at the root:

```
/project/node_modules/left-pad@1.0.0
/project/packages/api/node_modules/left-pad@2.0.0
/project/packages/api/src/index.js  -- require('left-pad')
```

Since Node's resolution algorithm starts at the requiring file's own directory and walks upward, using the first match, `index.js` above resolves to `2.0.0` — the nested copy closer to it — without ever reaching the root-level `1.0.0`. No code changes are needed for this to work correctly; it's transparent to your application code. This is exactly what makes it safe for two teams in a monorepo to depend on incompatible major versions of the same internal package simultaneously — see `../scenarios/03-monorepo-incompatible-versions.md`.

To find out which package in your dependency tree is pulling in a specific transitive dependency (and at what version), use `npm ls <package-name>` or `npm explain <package-name>`, which prints the dependency chain(s) responsible.
