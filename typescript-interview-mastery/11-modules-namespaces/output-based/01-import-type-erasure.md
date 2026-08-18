```typescript
// analytics.ts
export class Tracker {
  static instances = 0;
  constructor() {
    Tracker.instances++;
    console.log("Tracker constructed, side effect ran");
  }
}

export interface TrackerOptions {
  debug: boolean;
}
```

```typescript
// consumer.ts
import type { Tracker, TrackerOptions } from "./analytics";

function configure(options: TrackerOptions): void {
  console.log(options.debug);
}

let t: Tracker; // used only as a type annotation, never instantiated here
```

**Answer:** After compilation, the emitted JavaScript for `consumer.ts` contains **no import of `./analytics` at all** — the entire `import type { Tracker, TrackerOptions }` line is stripped, and `analytics.ts`'s module-level code (including the `Tracker` class body and its constructor's side effect) never runs as a result of loading `consumer.ts`.

**Why:** `import type` tells the compiler, unambiguously, that every name in that import list is used purely for type positions in this file — never as a runtime value. TypeScript erases the entire statement during compilation, with no need to check whether any of the imported names happen to only be used as types (which is what happens automatically with a *regular* `import` when every usage turns out to be type-only). Because `t: Tracker` is a type annotation and `TrackerOptions` is only used as a parameter type, nothing here needs `Tracker` or `TrackerOptions` to exist at runtime — and `import type` guarantees the compiler won't accidentally keep the import "just in case," which matters most in isolated/per-file transpilation setups (esbuild, SWC) that can't verify type-only usage by looking at other files.
