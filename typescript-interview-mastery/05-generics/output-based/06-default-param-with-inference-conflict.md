```typescript
interface Box<T = string> {
  value: T;
}

function unwrap<T>(box: Box<T>): T {
  return box.value;
}

const numberBox: Box<number> = { value: 5 };
const result = unwrap(numberBox);

const bareBox: Box = { value: "hi" };
const bareResult = unwrap(bareBox);
```

What are the inferred types of `result` and `bareResult`?

**Answer:** `result` is `number`. `bareResult` is `string`.

**Why:** `unwrap<T>` infers `T` from whatever concrete `Box<...>` it's handed — it doesn't know or care that `Box` itself has a default of `string`, because by the time you pass a *value* typed `Box<number>` or `Box` (which is shorthand for `Box<string>` due to the default), the type argument has already been resolved on that value. `numberBox` is explicitly `Box<number>`, so `unwrap` infers `T = number`. `bareBox: Box` uses `Box`'s default type parameter, silently becoming `Box<string>`, so `unwrap` infers `T = string` from it. The subtlety worth remembering: a default generic parameter is resolved once, at the point where the generic type itself is instantiated (`Box` → `Box<string>`), not re-evaluated at every later usage — by the time `unwrap` sees `bareBox`, there's no ambiguity left, just an ordinary `Box<string>`.
