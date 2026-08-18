# Default generic parameter on a wrapper type

```typescript
// TError defaults to Error when the caller doesn't specify one
interface Outcome<TValue, TError = Error> {
  ok: boolean;
  value?: TValue;
  error?: TError;
}

const success: Outcome<number> = { ok: true, value: 42 };
const failure: Outcome<number, string> = { ok: false, error: "not found" };

console.log(success, failure);
```
