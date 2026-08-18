```typescript
// legacy-types.d.ts (no import/export statements anywhere in this file)
/// <reference path="./shared-types.d.ts" />

interface LegacyWidget extends SharedBase {
  legacyFlag: boolean;
}
```

```typescript
// shared-types.d.ts (also no import/export statements)
interface SharedBase {
  id: string;
}
```

```typescript
// app.ts — a real module (has an import)
import { renderWidget } from "./render";

const w: LegacyWidget = { id: "w1", legacyFlag: true }; // (1)
```

**Answer:** This compiles. Line (1) resolves `LegacyWidget` (and transitively `SharedBase`) even though `app.ts` never imports either file directly.

**Why:** `legacy-types.d.ts` and `shared-types.d.ts` contain no top-level `import`/`export`, so TypeScript treats them as **scripts**, not modules — their declarations (`interface LegacyWidget`, `interface SharedBase`) go straight into the **global scope**, visible from any file in the program without an import, exactly like two `.d.ts` files describing global browser APIs. The triple-slash `/// <reference path="./shared-types.d.ts" />` in `legacy-types.d.ts` exists purely to tell the compiler "check this file's declarations before/alongside mine, because I depend on `SharedBase`" — it has nothing to do with making `SharedBase` importable; it's a compile-order/dependency hint for global scripts, not a runtime or module mechanism. This is precisely the scenario triple-slash directives were designed for and remain occasionally necessary for even today: coordinating dependencies between global-scope `.d.ts` files that have no module system to `import` through. If either file had so much as an empty `export {}`, it would become a module instead, its declarations would stop being globally visible, and the triple-slash reference would no longer be the right tool — you'd use a real `import` instead.
