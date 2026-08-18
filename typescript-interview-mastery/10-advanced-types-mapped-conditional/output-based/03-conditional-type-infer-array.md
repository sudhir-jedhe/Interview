```typescript
type Flatten<T> = T extends (infer U)[] ? U : T;

type A = Flatten<number[]>;        // ?
type B = Flatten<number[][]>;      // ?
type C = Flatten<string>;          // ?
```

**Answer:** `A` is `number`. `B` is `number[]` — NOT `number`. `C` is `string`.

**Why:** `Flatten` only peels off **one** layer of array-ness. `number[][]` matches the pattern `(infer U)[]` with `U = number[]` (an array of arrays is itself "an array of *something*," and that something is `number[]`), so the conditional returns `number[]`, unchanged from what's nested one level in — it does not recurse further. To flatten arbitrarily nested arrays down to the base element type, `Flatten` would need to call itself again on the inferred `U`: `type DeepFlatten<T> = T extends (infer U)[] ? DeepFlatten<U> : T`. This is the same "one layer vs. recursive" distinction that separates a naive `Promise` unwrapper from the real `Awaited<T>`.
