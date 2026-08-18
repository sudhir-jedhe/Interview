# Does this compile?

```typescript
interface Config {
  timeout: number;
}

interface Config {
  timeout: string;
}

const config: Config = { timeout: 5000 };
```

**Answer:** No. TypeScript reports: `Subsequent property declarations must have the same type. Property 'timeout' must be of type 'string', but here has type 'number'.` — the error appears on the first `interface Config` declaration itself, before `config` is even declared.

**Why:** Declaration merging only works when every declaration of the same interface name agrees on the type of any property they share. Unlike type-alias intersection (`&`), which silently resolves a conflicting property to `never` and only fails later at the point of use, interface merging performs this check **eagerly, at declaration time** — TypeScript refuses to merge two incompatible declarations at all, rather than producing a broken merged type you'd discover the hard way. This is one of the practical advantages of `interface` merging's stricter checking discussed in `theory/02-declaration-merging-and-extension.md`: conflicts surface immediately and precisely, right where the second (incompatible) declaration is written.
