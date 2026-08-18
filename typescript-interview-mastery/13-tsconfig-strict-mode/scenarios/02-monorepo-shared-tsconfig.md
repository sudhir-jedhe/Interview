# Scenario: A Monorepo Where Packages Disagree on Module Settings

Your monorepo has `packages/shared` (a utility library consumed by both a Node API and a Vite frontend), `packages/api` (Node 20, CommonJS output required by an existing deploy pipeline), and `packages/web` (Vite, ESM, bundler resolution). A developer copies `packages/api`'s `tsconfig.json` into `packages/shared` for consistency, and the frontend build starts failing with cryptic "default export is not a function" errors only in the browser bundle, not in Node.

**Approach:**

The root cause is that `packages/shared` was built with `module: "CommonJS"`, so its compiled output uses `module.exports = ...` semantics. When Vite (which expects native ESM) consumes that output through its dependency graph, its interpretation of a CommonJS default export doesn't always match what TypeScript's `esModuleInterop`-aware `import` inside `packages/web` assumed at the *type-checking* level — the types said one shape, the actual runtime bundle exposed another, because two different module systems were mixed across a package boundary without a synthesis step.

The fix is to give each package a `tsconfig.json` whose `module`/`moduleResolution` matches its actual runtime consumer, rather than copying one config everywhere for "consistency":

```jsonc
// packages/shared/tsconfig.json — dual consumer, so build to a
// modern format both a bundler and Node's NodeNext can consume:
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2020",
    "declaration": true,
    "outDir": "dist"
  }
}
```

```jsonc
// packages/api/tsconfig.json — Node CJS deploy target:
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node16",
    "target": "ES2020"
  }
}
```

```jsonc
// packages/web/tsconfig.json — Vite/bundler:
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2020"
  }
}
```

If `packages/shared` genuinely needs to be consumed by *both* a CJS Node package and an ESM bundler build, the cleanest fix is to build it twice (dual-package publishing: emit both a `dist/cjs` and `dist/esm` output, referenced via `package.json` `"exports"` conditions), rather than picking one `module` setting and hoping both consumers tolerate it. A shared base `tsconfig.base.json` with common flags (`strict`, `skipLibCheck`, `esModuleInterop`) extended by each package's specific `module`/`moduleResolution` override avoids the "copy the wrong config" mistake in the first place:

```jsonc
// tsconfig.base.json
{ "compilerOptions": { "strict": true, "skipLibCheck": true, "esModuleInterop": true } }
```

```jsonc
// packages/api/tsconfig.json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "module": "CommonJS", "moduleResolution": "Node16" } }
```

**Lesson:** in a monorepo, `module`/`moduleResolution` are per-*runtime-target* settings, not project-wide style preferences — copying them uniformly across packages that ship to different runtimes (Node CJS vs. bundler ESM) is a common, hard-to-diagnose source of "works in one package, breaks in another" bugs.
