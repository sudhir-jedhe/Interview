# `module` and `moduleResolution`

`module` controls what module *syntax* TypeScript emits in the compiled JavaScript output (`import`/`export` vs `require`/`module.exports`, and the internal format of dynamic imports). `moduleResolution` controls the *algorithm* the compiler uses to find and resolve import specifiers to actual files on disk. They're related but independent, and mixing an outdated `moduleResolution` with a modern `module` setting is a common source of "cannot find module" errors that don't reproduce at runtime with the actual bundler/runtime.

## `module`: emitted output format

```json
{ "compilerOptions": { "module": "ESNext" } }
```

Common values:
- `"CommonJS"` — emits `require()`/`module.exports`, the traditional Node.js format.
- `"ESNext"` / `"ES2020"` — emits native `import`/`export` statements, for bundlers (Webpack, Vite, esbuild) or Node's native ESM support.
- `"Node16"` / `"NodeNext"` — emits CommonJS or ESM *per file*, based on that file's actual module type (determined by `package.json`'s `"type"` field or file extension), matching how Node.js itself decides.

## `moduleResolution`: how imports are found on disk

This is the algorithm answering "given `import x from './foo'`, what file does that actually point to?"

- `"classic"` — legacy, rarely used today, doesn't match how Node or bundlers actually resolve modules; avoid it.
- `"node"` (a.k.a. `"node10"`) — mimics older Node.js CommonJS resolution: looks for `./foo.ts`, `./foo/index.ts`, checks `node_modules`, etc. Does not understand `package.json` `"exports"` maps, so it can produce false "module not found" errors against modern npm packages that only expose an `exports` field.
- `"node16"` / `"nodenext"` — mirrors modern Node.js ESM+CJS resolution exactly, including `"exports"` map support and requiring explicit file extensions in relative imports within ESM files (`import './foo.js'`, even though the source file is `foo.ts`).
- `"bundler"` — designed for projects that use a bundler (Vite, esbuild, Webpack) rather than running compiled output directly through Node. It understands `package.json` `"exports"` like `node16` does, but relaxes the explicit-extension requirement, matching how bundlers actually resolve imports.

## Why the mismatch matters

Picking `moduleResolution: "node"` with a modern package that only ships an `"exports"` field in its `package.json` (increasingly common) causes TypeScript to report `Cannot find module 'some-package'` even though the package works fine at runtime through your bundler — because `"node"` resolution predates `"exports"` map support entirely. The fix is `moduleResolution: "bundler"` (if you use a bundler) or `"node16"`/`"nodenext"` (if you run compiled output directly under Node with matching module settings).

## Practical pairing

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```
This is the standard pairing for frontend apps built with Vite/Webpack/esbuild — you write ESM, the bundler handles actual resolution and bundling, and TypeScript just needs to validate types using bundler-compatible resolution rules. For a Node.js backend running compiled output directly:
```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```
Keeping `module` and `moduleResolution` in the same "family" (both bundler-oriented, or both Node16-oriented) avoids the majority of resolution-related compile errors that don't reflect real runtime problems.
