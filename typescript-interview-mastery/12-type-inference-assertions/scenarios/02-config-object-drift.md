# Scenario: A Config Object That Silently Drifted From Its Interface

Your team maintains a feature-flag configuration object consumed across the app. It's declared with an explicit type annotation:

```typescript
interface FeatureFlags {
  newCheckout: boolean;
  betaSearch: boolean;
  region: "us" | "eu" | "apac";
}

const flags: FeatureFlags = {
  newCheckout: true,
  betaSearch: false,
  region: "us",
};
```

Downstream code does `if (flags.region === "us") { ... }` switches all over the codebase. A new engineer adds a fourth region, updates the object, and TypeScript happily accepts it — but a switch statement elsewhere that pattern-matches on `region` silently falls through to a default case for the new region, because nothing forced that switch to be re-checked.

**Approach:**

The annotation-based `flags: FeatureFlags` approach has a subtle weakness here: because `flags.region`'s type is fixed to the *declared* union `"us" | "eu" | "apac"` by the annotation, adding a new literal value to the union (e.g. `"latam"`) requires editing the `FeatureFlags` interface by hand — nothing automatically keeps the interface's union in sync with the actual literal used in the object. That's expected and fine for `flags.region`'s own type. The real problem shows up in a *different* place: exhaustiveness checks that pattern-match on `flags.region` need `region`'s union to be accurate, and it's easy to add a new region to the interface without updating every switch that should handle it.

The fix isn't about `satisfies` here — it's about making the exhaustiveness check itself fail loudly:

```typescript
function getRegionLabel(region: FeatureFlags["region"]): string {
  switch (region) {
    case "us":
      return "United States";
    case "eu":
      return "Europe";
    case "apac":
      return "Asia Pacific";
    default: {
      const _exhaustive: never = region; // compile error if a case is missing
      throw new Error(`Unhandled region: ${_exhaustive}`);
    }
  }
}
```

Now, when `"latam"` is added to `FeatureFlags["region"]`, this function fails to compile (`Type '"latam"' is not assignable to type 'never'`) until someone adds the missing `case`. Combine this with `satisfies` at the definition site for the best of both worlds — validate `flags` against `FeatureFlags` while preserving literal types for anything that needs them elsewhere:

```typescript
const flags = {
  newCheckout: true,
  betaSearch: false,
  region: "us",
} satisfies FeatureFlags;
```

The lesson: type annotations validate at the point of assignment but don't protect *other* code that consumes the value from silently going stale as the type evolves — that protection comes from exhaustiveness checks (`never` in the `default` branch), not from the annotation style you pick.
