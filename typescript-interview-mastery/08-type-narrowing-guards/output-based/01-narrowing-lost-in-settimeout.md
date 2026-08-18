```typescript
function schedule(value: string | undefined): void {
  if (typeof value !== "string") return;

  setTimeout(() => {
    console.log(value.toUpperCase());
  }, 0);
}
```

Does this compile?

**Answer:** No. Inside the `setTimeout` callback, `value.toUpperCase()` fails with "Object is possibly 'undefined'," even though the guard clause above clearly ensures `value` is a `string` at the point the callback is defined.

**Why:** `value` is a mutable function parameter captured by a closure. TypeScript's narrowing analysis is only valid for the synchronous control flow it can see leading up to a given line — it cannot prove that `value` isn't reassigned to `undefined` by some other code between when the closure is *created* and when it actually *runs* (asynchronously, later). Because the compiler can't rule that out in general, it conservatively discards the narrowing inside the callback and falls back to `value`'s original declared type, `string | undefined`. The fix is to capture a `const` copy right after the guard: `const safeValue = value;` and reference `safeValue` inside the callback — a `const` binding can never be reassigned, so its narrowed type is guaranteed to remain accurate for as long as the closure might run.
