# What does TS infer as the return type?

```typescript
function pollUntilReady() {
  while (true) {
    if (Math.random() > 2) { // always false, but TS doesn't know that
      return "ready";
    }
  }
}
```

**Answer:** TypeScript infers the return type as `string`, **not** `never`, even though the `while (true)` loop with no `break` means the function can technically never return normally in the "always false" reading a human gives it.

**Why:** TypeScript's control-flow analysis for `never` is based on **syntactic reachability**, not runtime value analysis. It sees `while (true) { ... return "ready"; ... }` and reasons: there is a `return "ready"` statement reachable inside the loop body, and there's no way out of the `while (true)` other than that `return` (no `break`, no `throw` before it). Because a `return "ready"` is reachable, the function's return type includes `string`. TypeScript does *not* evaluate `Math.random() > 2` to determine it's always false — that would require actual value/constant analysis, which the type checker does not perform for arbitrary expressions. Contrast this with `function loop(): never { while (true) {} }` — an infinite loop with **no reachable return statement at all** — which TypeScript correctly infers as `never`, because there's genuinely no syntactic path out.
