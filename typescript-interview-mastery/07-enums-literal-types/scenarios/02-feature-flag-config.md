# Modeling a feature-flag configuration with a single source of truth

Your app has a growing list of feature flags (`"new-checkout"`, `"dark-mode-v2"`, `"beta-search"`, ...) that need to be: iterable at runtime (to render a debug panel listing every flag), validated against a fixed set (rejecting typos when a flag is referenced), and available as a precise type for autocomplete when a developer calls `isEnabled(flagName)`.

**Approach:** Declare the flag list once as an `as const` array — that single array becomes both the runtime source of truth (for iteration/debug UI) and, via `typeof array[number]`, the type used everywhere a flag name is referenced, with zero duplication between "the list" and "the type."

```typescript
const FEATURE_FLAGS = [
  "new-checkout",
  "dark-mode-v2",
  "beta-search",
] as const;

type FeatureFlag = (typeof FEATURE_FLAGS)[number];

class FeatureFlagRegistry {
  private enabled = new Set<FeatureFlag>();

  enable(flag: FeatureFlag): void {
    this.enabled.add(flag);
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.enabled.has(flag);
  }

  listAll(): { flag: FeatureFlag; enabled: boolean }[] {
    return FEATURE_FLAGS.map((flag) => ({
      flag,
      enabled: this.enabled.has(flag),
    }));
  }
}

const flags = new FeatureFlagRegistry();
flags.enable("dark-mode-v2");

console.log(flags.isEnabled("dark-mode-v2")); // true
// flags.enable("dark-mode-v3"); // Error: not assignable to FeatureFlag
```

`listAll()` demonstrates why the runtime array matters just as much as the derived type: `FEATURE_FLAGS.map(...)` iterates the real values to build a debug view, something a `type FeatureFlag = "a" | "b" | "c"` written by hand could never do on its own, since a type has no runtime representation to loop over. Keeping `FEATURE_FLAGS` as the single array both the type and the iteration logic derive from means adding a new flag is a one-line change in exactly one place — no enum-like dual maintenance of "the runtime object" and "the type," which is effectively automatic with a plain enum but requires this `as const` + `typeof ... [number]` pattern to achieve with a literal union.
