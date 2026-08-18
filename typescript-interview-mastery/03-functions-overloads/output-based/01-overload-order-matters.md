# What type does TS infer for `result`?

```typescript
function lookup(key: string | number): string | number;
function lookup(key: string): string;
function lookup(key: number): number;
function lookup(key: string | number): string | number {
  return key;
}

const result = lookup("id-42");
```

**Answer:** `result` is inferred as `string | number` — the wide type — **not** the narrower `string` you might expect from passing a `string` argument.

**Why:** TypeScript resolves overloads by checking them **in declaration order** and using the *first* one that matches. The first overload declared, `lookup(key: string | number): string | number`, already matches a `string` argument (since `string` is assignable to `string | number`), so TypeScript stops there and never considers the more specific `lookup(key: string): string` overload declared right below it — even though that one would have been a better, more precise match. This is the exact "more specific overloads must come first" rule from `theory/03-function-overloads.md`: had the three overloads been ordered `string`, `number`, `string | number` (specific to general), `lookup("id-42")` would correctly resolve to the `string` overload and infer `result: string`. The lesson: overload order isn't cosmetic — it directly determines which signature callers actually get matched against.
