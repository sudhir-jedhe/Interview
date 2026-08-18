# ES Module Syntax and `import type`

TypeScript compiles down to standard ECMAScript modules (or CommonJS, depending on config), and the import/export syntax you write in `.ts` files is, for the most part, plain ES module syntax with one TypeScript-specific addition: `import type`.

## Named exports and imports

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export interface Vector {
  x: number;
  y: number;
}
```

```typescript
// main.ts
import { add, PI, Vector } from "./math";

const v: Vector = { x: 1, y: 2 };
console.log(add(v.x, v.y) + PI);
```

Named exports are explicit and greppable — `import { add } from "./math"` tells you exactly what's being pulled in, and renaming a named export is a compiler-checked operation across every importer.

## `import type` — type-only imports

TypeScript types don't exist at runtime; they're erased entirely during compilation. Ordinarily, the compiler is smart enough to detect when an imported name is only ever used as a type and drops the import from the emitted JavaScript automatically. But this detection isn't airtight — bundlers doing single-file transpilation (like esbuild or SWC in isolated-module mode) can't always see across files to know whether an import is type-only, so they conservatively keep it, which can pull in unwanted runtime code, break tree-shaking, or even cause circular-import issues at runtime for something that was only ever needed for types.

`import type` makes the intent explicit and unambiguous:

```typescript
import type { Vector } from "./math"; // guaranteed erased — never emitted as a runtime import
import { add } from "./math";         // a real runtime import

function magnitude(v: Vector): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
}
```

You can also mark individual specifiers as type-only within a mixed import:

```typescript
import { add, type Vector } from "./math";
```

## Why `import type` matters for build tooling

Modern build pipelines increasingly transpile files in isolation (one file at a time, without full cross-file type information) for speed — this is how esbuild, SWC, and TypeScript's own `isolatedModules` mode work. In isolated transpilation, the tool literally cannot know whether `Vector` is a type or a value without checking `math.ts`, which it isn't doing. `import type` removes the ambiguity at the syntax level: the transpiler can safely strip it without any cross-file analysis, guaranteeing dead code (types) never leaks into the runtime bundle and that tree-shaking isn't defeated by an import that "looks" like it might have side effects.

## Default exports

```typescript
// logger.ts
export default function log(message: string): void {
  console.log(`[LOG] ${message}`);
}
```

```typescript
// main.ts
import log from "./logger"; // no braces — default import can be named anything
```

The trade-offs between default and named exports are covered in the next file.
