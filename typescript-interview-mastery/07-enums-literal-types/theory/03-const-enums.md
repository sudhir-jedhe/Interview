# Const Enums

A `const enum` looks identical to a regular enum in source code, but it changes what the compiler emits: instead of generating a real runtime object, every reference to a `const enum` member is inlined directly as its literal value at every usage site, and the enum declaration itself produces no JavaScript object at all.

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(dir: Direction): void {
  console.log(dir);
}

move(Direction.Up);
```

Compiles to (roughly):

```javascript
function move(dir) {
  console.log(dir);
}
move(0 /* Up */);
```

Notice there's no `Direction` object anywhere in the output — `Direction.Up` was replaced with the literal `0` at the call site, with a comment for readability. This is strictly a compile-time construct; nothing about `const enum` exists once the code is running.

## Why use it

The appeal is performance and bundle size: no object allocation, no property lookups at runtime, no extra bytes shipped for the enum's runtime representation — for hot paths or large enums referenced thousands of times across a codebase, this can matter. It also mechanically eliminates the reverse-mapping issue by construction, since there's no runtime object to hold a reverse mapping in the first place.

## The tradeoffs that make const enums risky

`const enum` has real, sharp limitations that have made many style guides (including TypeScript's own team, at points) recommend avoiding it:

- **No runtime object to introspect.** You can't do `Object.values(Direction)` or iterate over members at runtime — there's nothing there to iterate.
- **Breaks with `isolatedModules`.** Tools that compile files independently (esbuild, SWC, Babel's TypeScript preset, and Vite's default pipeline) can't see across file boundaries, so they can't safely inline a `const enum` imported from another file — this causes build errors or silently incorrect output in exactly the toolchains most modern projects use.
- **Cross-package fragility.** If a `const enum` is exported from a compiled library, consumers must recompile against the exact enum declaration; you can't ship a `.d.ts` with `const enum` and expect isolated-module consumers to inline it correctly.

```typescript
// tsconfig.json with "isolatedModules": true will reject this pattern
// when Direction is imported from another file, because the compiler
// can no longer guarantee it knows the enum's members at inline-time.
```

Because of these constraints, most modern guidance is: prefer a plain literal union or a regular (non-const) string enum, and only reach for `const enum` in a tightly controlled, single-project build where you've verified your toolchain supports it and the performance win is measured, not assumed.

## Why this matters in interviews

`const enum` is a good test of whether you understand the difference between "type-only" TypeScript constructs (interfaces, type aliases — always erased) and "has real runtime output" constructs (regular enums, classes) — `const enum` is a hybrid: written like a real enum, but compiled away like a type-only construct, with a specific, well-known toolchain caveat (`isolatedModules`) that trips up teams using esbuild/SWC/Babel without realizing it.
