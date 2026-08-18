```typescript
// types/express-augmentation.d.ts
declare module "express" {
  interface Request {
    user?: { id: string };
  }
}
```

```typescript
// middleware.ts
import { Request } from "express";

function handler(req: Request) {
  console.log(req.user?.id); // (1)
}
```

**Answer:** This example is fragile — depending on the exact TypeScript version, module resolution mode, and whether `express`'s own types are actually imported anywhere else in the program before this file is checked, this augmentation can silently fail to apply, and line (1) then errors with `Property 'user' does not exist on type 'Request'`. The fix is to add a side-effect import of the real module at the top of the augmentation file: `import "express";` before the `declare module "express"` block.

**Why:** `declare module "express" { ... }` is only treated as an **augmentation** of the real, already-existing `"express"` module if TypeScript can resolve `"express"` as an actual module from this file's perspective. Without an `import "express";` (or some other import from `"express"`) inside the `.d.ts` file itself, some configurations treat the `declare module "express"` block as declaring a brand-new *ambient* module named `"express"` from scratch — shadowing or conflicting with the real package's types rather than merging into them, depending on module resolution settings and file inclusion order. The safe, version-independent pattern is always: `import "express";` (a side-effect-only import) immediately before the `declare module` block, which unambiguously signals "reopen the existing module for augmentation," removing any dependency on resolution-order coincidences.
