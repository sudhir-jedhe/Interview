# What type does TS infer for the `level` parameter?

```typescript
function log(message: string, level = "info") {
  console.log(`[${level}] ${message}`);
}

log("Server started");
log("Disk usage high", "warn");
log("Fatal error", 500); // does this compile?
```

**Answer:** `level`'s inferred type is `string` (widened from the default value `"info"`, not the literal `"info"`). The first two calls compile fine. The third call, `log("Fatal error", 500)`, fails: `Argument of type 'number' is not assignable to parameter of type 'string'.`

**Why:** When a default parameter's type isn't explicitly annotated, TypeScript infers it from the default value's type, using the same widening behavior as a `let` variable initialization (see `01-basic-types/output-based/01-array-literal-widening.md`) — `"info"` widens to `string`, not the literal `"info"`. Because `level` is inferred as `string` (not, say, `"info" | "warn" | "error"`), the parameter accepts any string at any call site, but it firmly does not accept a `number` — `500` doesn't satisfy `string`, so the third call is rejected. If the intent was to restrict `level` to a specific set of literal values, an explicit annotation is required: `function log(message: string, level: "info" | "warn" | "error" = "info")` — inference from a default value alone will never produce a literal-union type on its own.
