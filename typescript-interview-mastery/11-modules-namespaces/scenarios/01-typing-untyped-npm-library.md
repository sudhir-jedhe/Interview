# Scenario: Adding Types for an Untyped npm Package

Your team depends on a small, unmaintained npm package, `csv-lite`, that has no bundled TypeScript types and no `@types/csv-lite` package on DefinitelyTyped. Every import from it currently resolves to `any`, silently defeating type checking anywhere it's used. You need it properly typed without forking the package or waiting on upstream.

Say the package's actual (undocumented) runtime API looks like this:

```javascript
// node_modules/csv-lite/index.js (plain JS, no types)
function parse(csvText, options) { /* ... returns an array of row objects ... */ }
function stringify(rows, options) { /* ... returns a CSV string ... */ }
module.exports = { parse, stringify };
```

**Approach:** Write a local ambient declaration file describing the shape you've determined by reading the library's source/docs, place it somewhere TypeScript will pick it up (a `types/` directory referenced via `tsconfig.json`'s `typeRoots`, or anywhere within `include` since `.d.ts` files are auto-included), and let the rest of the codebase import the library normally with full type safety.

```typescript
// types/csv-lite.d.ts
declare module "csv-lite" {
  export interface ParseOptions {
    delimiter?: string;
    hasHeader?: boolean;
  }

  export interface StringifyOptions {
    delimiter?: string;
    includeHeader?: boolean;
  }

  export function parse(csvText: string, options?: ParseOptions): Record<string, string>[];
  export function stringify(rows: Record<string, unknown>[], options?: StringifyOptions): string;
}
```

```typescript
// reportGenerator.ts
import { parse, stringify } from "csv-lite";

const rows = parse("name,age\nAda,30", { hasHeader: true });
// rows: Record<string, string>[] — fully typed, no `any` leakage

const csv = stringify(rows, { includeHeader: true }); // typed string
```

Two practical notes for a real rollout: first, confirm `tsconfig.json`'s `include` covers the `types/` directory (or set `typeRoots` explicitly) so the `.d.ts` file is actually picked up — a correctly written ambient declaration that isn't in the compiler's file set has no effect. Second, keep the declared types intentionally conservative (e.g., `Record<string, string>[]` rather than trying to model every possible CSV shape) — an ambient declaration you maintain by hand is a contract you're responsible for keeping accurate as you learn more about the library's real behavior, and an overly specific but wrong type is worse than a slightly loose but correct one.
