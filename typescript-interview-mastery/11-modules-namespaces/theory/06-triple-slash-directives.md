# Triple-Slash Directives

Triple-slash directives are single-line comments starting with `///` containing an XML-like tag, recognized only when they appear at the very top of a file. They're a pre-ES-module-era mechanism for telling the compiler about dependencies between files, largely superseded today but still occasionally encountered.

## The most common form: `<reference path=... />`

```typescript
/// <reference path="./globals.d.ts" />

function useGlobalConfig() {
  return window.__APP_CONFIG__; // relies on a type declared in globals.d.ts
}
```

This tells the compiler "the types in `globals.d.ts` are needed to correctly check this file," establishing a dependency without an `import` statement (useful in the "global script" style of `.d.ts` files that have no `import`/`export` of their own and therefore aren't ordinary modules).

## `<reference types=... />`

```typescript
/// <reference types="node" />
```

This pulls in an ambient type package (like `@types/node`) explicitly, which matters mainly in standalone `.d.ts` files or configurations where automatic type-package inclusion (via `tsconfig.json`'s `types` field) isn't already covering it.

## Why they're rare in modern code

With ES modules, `import`/`export` statements already express file dependencies precisely and are understood by every tool in the chain (bundlers, linters, the TypeScript compiler itself) — there's no need for a separate directive syntax to say "this file depends on that file." Most modern TypeScript codebases go years without a single triple-slash directive, because:

- Regular `.ts`/`.tsx` files use `import type`/`import` to pull in whatever types they need.
- `tsconfig.json`'s `include`/`files`/`types` fields handle project-wide type inclusion.
- `@types/*` packages are picked up automatically from `node_modules/@types` without any directive.

## Where you still encounter them

- **Standalone global `.d.ts` files** (no `import`/`export` of their own) that need to reference another global `.d.ts` file's declarations, since there's no module system to `import` through in that context.
- **Auto-generated `.d.ts` output** from `tsc`, which sometimes emits `/// <reference types="..." />` at the top of bundled declaration files to record a dependency on an ambient type package.
- **Old library type definitions** written before `import type` and modern module resolution matured.

## Interview takeaway

You're unlikely to write triple-slash directives in day-to-day application code, but you should recognize the syntax on sight (especially `/// <reference path=... />` and `/// <reference types=... />`) and know they predate — and have been mostly replaced by — ES module imports and `tsconfig.json` configuration. Being asked to explain them is usually a check for whether you've read enough real-world (including older) TypeScript code to recognize legacy patterns, not an expectation that you use them yourself.
