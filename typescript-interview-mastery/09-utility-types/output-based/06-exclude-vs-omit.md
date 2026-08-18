```typescript
interface LogEvent {
  level: "info" | "warn" | "error";
  message: string;
}

type Level = LogEvent["level"];
type NonErrorLevel = Omit<Level, "error">;
```

**Answer:** This does NOT compile as intended — `Omit<Level, "error">` evaluates to `Level` itself (i.e. `"info" | "warn" | "error"` unchanged), not the two-member union you'd want. TypeScript won't necessarily error on the declaration line, but using `NonErrorLevel` as if `"error"` were removed will fail: e.g. `const x: NonErrorLevel = "error";` still compiles, which is the actual bug.

**Why:** `Omit<T, K>` is defined for *object types* — it does `Pick<T, Exclude<keyof T, K>>`, which operates on `keyof T`. `Level` is a **string literal union**, not an object type, so `keyof Level` is meaningless in the way you'd expect (it resolves to the keys shared by all `string` instances, like `"toUpperCase"`, `"length"`, etc. — not `"info" | "warn" | "error"`). `Omit` silently does the wrong thing on a union instead of erroring. The correct tool for removing members from a union is `Exclude<T, U>`: `type NonErrorLevel = Exclude<Level, "error">` correctly yields `"info" | "warn"`. This is the single most common `Exclude`-vs-`Omit` mix-up: `Omit` is for object *shapes*, `Exclude` is for union *members*.
