# Snippet: distribution on vs. off, side by side

```typescript
// Same-looking conditional, different result depending on the tuple wrapper trick.

type Distributed<T> = T extends string ? "yes" : "no";
type NotDistributed<T> = [T] extends [string] ? "yes" : "no";

type A = Distributed<string | number>;    // "yes" | "no" — evaluated per member
type B = NotDistributed<string | number>; // "no" — evaluated once against the whole union
```
