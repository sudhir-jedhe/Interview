# Scenario: Feature-Flag Configuration with Partial and Record

You're building a feature-flag system. There's a fixed set of known flags, each with a boolean default. Environments (dev, staging, prod) should be able to override only the flags they care about, and the runtime needs a fully-resolved config with every flag present.

```typescript
type FeatureFlag = "newCheckout" | "darkMode" | "betaSearch" | "aiSuggestions";
```

**Approach:** Use `Record<FeatureFlag, boolean>` for the exhaustive default set (guarantees every flag has a default, enforced at compile time) and `Partial<Record<FeatureFlag, boolean>>` for environment overrides (guarantees overrides are a *subset*, and each override key is still constrained to a real flag name — a typo like `newCheckou` is caught immediately).

```typescript
const defaultFlags: Record<FeatureFlag, boolean> = {
  newCheckout: false,
  darkMode: true,
  betaSearch: false,
  aiSuggestions: false,
};

const environmentOverrides: Record<"dev" | "staging" | "prod", Partial<Record<FeatureFlag, boolean>>> = {
  dev: { newCheckout: true, betaSearch: true, aiSuggestions: true },
  staging: { newCheckout: true },
  prod: {},
};

function resolveFlags(env: "dev" | "staging" | "prod"): Record<FeatureFlag, boolean> {
  return { ...defaultFlags, ...environmentOverrides[env] };
}

const prodFlags = resolveFlags("prod");
console.log(prodFlags.darkMode); // true — falls back to default
```

Two things this design buys you:

1. **Exhaustiveness where it matters.** `defaultFlags` must define every flag — forgetting `aiSuggestions` is a compile error, not a runtime `undefined` that silently evaluates as falsy in an `if` check.
2. **Freedom where it's appropriate.** `environmentOverrides` doesn't need every flag per environment — `Partial` lets `prod: {}` mean "use all defaults" without an awkward empty-object-with-required-keys shape.

If a fifth flag is added to `FeatureFlag`, TypeScript immediately flags `defaultFlags` as incomplete (via `Record`'s exhaustiveness), while every environment's override object continues to compile unchanged (via `Partial`) — exactly the right amount of friction in each place.
