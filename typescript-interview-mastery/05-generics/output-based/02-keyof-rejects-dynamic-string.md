```typescript
interface Config {
  host: string;
  port: number;
}

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const config: Config = { host: "localhost", port: 8080 };

function readField(name: string) {
  return get(config, name);
}
```

Does this compile?

**Answer:** No. TypeScript reports an error on `get(config, name)`: argument of type `string` is not assignable to parameter of type `keyof Config`.

**Why:** Inside `readField`, `name` has the general type `string`, but `get`'s second parameter is constrained to `K extends keyof T`, which for `Config` resolves to the literal union `"host" | "port"`. A plain `string` is a strictly wider type than that union — it includes every possible string, not just the two valid keys — so the compiler can't verify at this call site that `name` will always be `"host"` or `"port"`. This is the constraint doing exactly its job: it prevents a caller from bypassing the safety `K extends keyof T` was designed to provide. The fix is either to narrow `name` before calling (e.g., a type guard or an `as` assertion once you've verified correctness elsewhere) or to change `readField`'s parameter type to `keyof Config` directly, pushing the responsibility for a valid key up to `readField`'s own caller.
