```typescript
// a.ts
import { b } from "./b";
export const a = "a-value";
console.log("a.ts loaded, b is:", b);
```

```typescript
// b.ts
import { a } from "./a";
export const b = "b-value";
console.log("b.ts loaded, a is:", a);
```

```typescript
// main.ts
import "./a";
```

**Answer:** This compiles (TypeScript doesn't reject circular imports at the type level for simple `const` re-exports like this), but at runtime the console output is:
```
b.ts loaded, a is: undefined
a.ts loaded, b is: b-value
```
`b` correctly logs `"b-value"` for itself, but `a` inside `b.ts` logs `undefined` — not `"a-value"`, and not an error either.

**Why:** ES module circular imports don't throw, but they do expose the *load order*. When `main.ts` imports `a.ts`, the JS runtime starts evaluating `a.ts`, hits `import { b } from "./b"` at the top, and pauses to fully evaluate `b.ts` first. `b.ts` in turn imports `{ a }` from `a.ts` — but `a.ts` is already in the process of being evaluated (it's on the call stack, not finished), so the module system gives `b.ts` a *live but not-yet-initialized* binding for `a`: the binding exists, but the `const a = "a-value"` assignment hasn't run yet, so at the moment `b.ts` logs it, `a` is still in its temporal-dead-zone-like uninitialized state, which surfaces as `undefined` for this kind of top-level circular read (a real `ReferenceError` can occur in stricter cases, e.g. reading a `let`/`const` before initialization more directly). This is a real production bug pattern: circular `import`/`export` between two files that both do work at module-load time (not just inside functions) can silently produce `undefined` values depending on which file happens to be imported first. The fix is almost always to break the cycle — extract the shared piece both files need into a third file — rather than trying to reorder imports.
