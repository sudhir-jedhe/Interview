```typescript
const RGB = [255, 100, 50] as const;

RGB[0] = 0;
RGB.push(10);
console.log(RGB.length);
```

Which lines fail to compile?

**Answer:** Both `RGB[0] = 0` and `RGB.push(10)` fail to compile. `RGB.length` alone would be fine.

**Why:** `as const` on an array literal produces a `readonly` tuple type — here, `readonly [255, 100, 50]` — which locks both the length (exactly 3 elements) and each individual element's mutability. `RGB[0] = 0` is rejected because index `0` is a `readonly` property in a tuple type, the same way a `readonly` field on an object can't be reassigned. `RGB.push(10)` is rejected because `push` (along with `pop`, `splice`, `sort`, and other mutating array methods) simply isn't part of the `ReadonlyArray`/readonly-tuple method set — the type doesn't have that method at all, so calling it is a straightforward "property does not exist" error, not a "you're not allowed to call this" error. This is one of `as const`'s most useful side effects for configuration-style data: it guarantees, at compile time, that a supposedly-fixed list of values can never be accidentally mutated anywhere downstream.
