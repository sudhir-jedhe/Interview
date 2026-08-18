```typescript
// file: direction.ts
export const enum Direction {
  Up,
  Down,
}

// file: mover.ts
import { Direction } from "./direction";

function move(d: Direction) {
  console.log(d);
}

move(Direction.Up);
```

This project has `"isolatedModules": true` in `tsconfig.json` (the default expectation for esbuild/SWC/Babel-based toolchains, and required by Vite's default build). Does this compile cleanly?

**Answer:** No — with `isolatedModules` enabled, referencing an imported `const enum`'s member (`Direction.Up`) from another file produces an error: "Cannot access ambient const enums when the '--isolatedModules' flag is provided," (or, depending on tool/version, the transpiler simply can't resolve `Direction.Up` to a literal and errors or produces broken output).

**Why:** `const enum` inlining requires the compiler to see the *actual declaration* of `Direction` at the point where `Direction.Up` is used, so it knows to replace the reference with the literal `0`. Tools that compile each file independently and in isolation — which is exactly what `isolatedModules` signals and what esbuild, SWC, and Babel's TypeScript transform all do for speed — process `mover.ts` without ever looking inside `direction.ts`, so they have no way to know what `Direction.Up` should inline to. A full `tsc` type-check (which does see across files) can resolve `const enum` correctly, but most fast modern build pipelines use `tsc` only for type-checking, not for the actual JS output, meaning the *transpilation* step is exactly the isolated, single-file kind that breaks on cross-file `const enum` usage. This is the practical, concrete reason most style guides recommend avoiding `const enum` in any project built with Vite, esbuild, or a Babel-based pipeline — which today is the majority of frontend projects.
