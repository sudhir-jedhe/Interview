# Problem 3: Demonstrate the Practical Difference `import type` Makes

## Task

Given the module below, which has a real runtime side effect at module-load time (a `console.log` and a module-level counter increment), write a consumer file two ways — one using a regular `import` for a type-only name, one using `import type` — and explain, precisely, how their compiled output differs and why it matters for a bundler doing isolated/per-file transpilation.

```typescript
// featureRegistry.ts
console.log("featureRegistry module evaluated"); // runs once, at first import, anywhere

export let registeredCount = 0;

export class FeatureFlag {
  constructor(public name: string, public enabled: boolean) {
    registeredCount++;
  }
}

export interface FeatureFlagSnapshot {
  name: string;
  enabled: boolean;
}
```

## Solution

```typescript
// consumerA.ts — regular import, only used as a type
import { FeatureFlagSnapshot } from "./featureRegistry";

function logSnapshot(snapshot: FeatureFlagSnapshot): void {
  console.log(`${snapshot.name}: ${snapshot.enabled}`);
}
```

```typescript
// consumerB.ts — import type, explicitly type-only
import type { FeatureFlagSnapshot } from "./featureRegistry";

function logSnapshot(snapshot: FeatureFlagSnapshot): void {
  console.log(`${snapshot.name}: ${snapshot.enabled}`);
}
```

**In a full-project `tsc` compile** (with complete cross-file type information available), both files typically produce identical emitted JavaScript: the compiler can see that `FeatureFlagSnapshot` is an `interface` — a type-only construct with nothing to emit at runtime regardless — so it drops the import from `consumerA.js` on its own, same as `consumerB.js`. In this specific case, both approaches look equivalent.

**In an isolated/per-file transpiler** (esbuild, SWC, Babel's TS preset, or `tsc` with `isolatedModules` enforced), the behavior diverges:

- `consumerA.ts`'s regular `import { FeatureFlagSnapshot }` — the transpiler processes this file **alone**, without reading `featureRegistry.ts` to check whether `FeatureFlagSnapshot` is a type or a value. Not knowing, it conservatively **keeps the import statement** in the emitted JS. That emitted `import { FeatureFlagSnapshot } from "./featureRegistry"` then causes the JS runtime to load and evaluate `featureRegistry.ts` — running its `console.log`, initializing `registeredCount` — purely as a side effect of a type-only import that consumerA never needed at runtime.
- `consumerB.ts`'s `import type { FeatureFlagSnapshot }` — the transpiler doesn't need any cross-file knowledge here; the `type` keyword in the import itself guarantees the whole statement is erased. `consumerB.js` never imports `./featureRegistry` at all, and `featureRegistry`'s module-level `console.log` never runs as a result of loading `consumerB.js`.

**Why it matters in practice:** if `featureRegistry.ts`'s module-level code is expensive (a database connection, a large computed table, a third-party SDK initialization) or has ordering-sensitive side effects, an accidental regular import that a bundler can't prove is type-only can silently pull that cost or side effect into a bundle that never actually needed it at runtime — bloating bundle size and potentially causing unwanted initialization order issues. `import type` is the reliable, tool-independent way to guarantee that never happens for a given import, regardless of which build tool ends up processing the file.
