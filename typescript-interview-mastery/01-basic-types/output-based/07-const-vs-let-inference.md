# What type does TS infer for each variable?

```typescript
const config = {
  env: "production",
  maxRetries: 3,
  tags: ["api", "v2"],
};

config.env = "staging";
config.maxRetries = 5;
config.tags.push("beta");
// config.tags = ["only-one"]; // is this line valid?
```

**Answer:** `config` is inferred as `{ env: string; maxRetries: number; tags: string[] }`. `config.env = "staging"` and `config.maxRetries = 5` both compile fine. `config.tags.push("beta")` compiles fine. The commented-out line, `config.tags = ["only-one"]`, would **also** compile fine if uncommented.

**Why:** `const` only prevents *reassigning the `config` binding itself* (you can't do `config = {...}` again) — it says nothing about the mutability of the object's properties. Object literal inference widens each property's **value** the same way `let` widens primitives: `"production"` widens to `string` (not the literal `"production"`) and `["api", "v2"]` widens to `string[]` (not a tuple), because object properties are assumed mutable by default, just like `let` variables. This is different from a top-level `const primitive = "production"`, which keeps the literal type, because there's no property/field involved — just a plain re-assignable-or-not binding. If you wanted `config` to keep literal types and become fully immutable, you'd add `as const`: `const config = { env: "production", maxRetries: 3, tags: ["api", "v2"] } as const;`, which makes every property `readonly` and every value a literal type, and then all three mutating lines above would fail to compile.
