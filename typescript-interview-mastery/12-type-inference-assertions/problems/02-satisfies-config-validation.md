# Problem 2: Validate a Config Object with `satisfies`, Preserving Literal Types

## The setup

You have a build-tool config interface and need to define a concrete config object that:
1. Is checked against the interface at compile time (typos should be caught).
2. Keeps its literal types afterward, so consuming code can narrow on specific values (e.g., an exhaustive `switch` on `env`).

```typescript
interface BuildConfig {
  env: "development" | "staging" | "production";
  sourceMaps: boolean;
  entry: string;
  optimize: {
    minify: boolean;
    treeShake: boolean;
  };
}
```

## Your task

Write the config object three ways — with a plain annotation, with `as`, and with `satisfies` — and identify which approach lets the following exhaustive switch compile without a `default: never` fallback being reachable for an env that doesn't actually exist in the object.

```typescript
function describeEnv(env: BuildConfig["env"]): string {
  switch (env) {
    case "development":
      return "Local dev build";
    case "staging":
      return "Pre-prod build";
    case "production":
      return "Production build";
  }
}
```

## Reference solution

```typescript
// Option A: plain annotation — validates, but widens `env` to the full union
const configA: BuildConfig = {
  env: "production",
  sourceMaps: false,
  entry: "src/main.ts",
  optimize: { minify: true, treeShake: true },
};
// configA.env: "development" | "staging" | "production" (widened by the annotation)

// Option B: `as` — no real validation, a typo would slip through silently
const configB = {
  env: "productoin", // typo, but `as` won't catch it reliably here
  sourceMaps: false,
  entry: "src/main.ts",
  optimize: { minify: true, treeShake: true },
} as BuildConfig;
// TypeScript DOES catch excess/mismatched literal properties with `as` in many
// cases, but `as` performs a much weaker check than full assignability and is
// easy to make succeed by overshooting through `unknown` -- it's the wrong tool
// for "validate this value", even when it happens to catch this specific typo.

// Option C: `satisfies` — full validation AND literal narrowing preserved
const configC = {
  env: "production",
  sourceMaps: false,
  entry: "src/main.ts",
  optimize: { minify: true, treeShake: true },
} satisfies BuildConfig;
// configC.env: "production" (the literal, not the full union)
```

All three compile-check the object shape at the definition site to varying degrees (A and C fully; B partially and unreliably). The difference that matters for `describeEnv` is what happens *after*:

```typescript
describeEnv(configA.env); // OK: "development" | "staging" | "production" matches param type
describeEnv(configC.env); // OK: "production" is assignable to the wider union too
```

Both actually compile fine when passed straight into `describeEnv`, since a narrower literal type is always assignable to its wider union. The real payoff of `satisfies` shows up when you need `configC.env` to *itself* be treated as a specific literal downstream — for example, storing it in a `Record<"production", ...>` lookup, or comparing it with `===` against a single literal in a context where TS should narrow the surrounding code:

```typescript
if (configC.env === "production") {
  // TS narrows configC.env to exactly "production" here — and because it was
  // already "production" (not the wider union), there's no loss of precision
  // even before the check.
}
```

**Conclusion:** for validating a config object against an interface while keeping the most precise types available afterward, `satisfies` is strictly better than both a plain annotation (which widens) and `as` (which under-validates). Use `satisfies` at config definition sites by default.
