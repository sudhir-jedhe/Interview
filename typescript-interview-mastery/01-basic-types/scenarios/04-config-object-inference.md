# Scenario: A shared config object read by multiple modules

You're defining an application config object (feature flags, environment name, retry settings) that's imported and read (never mutated) across many modules. You want the strictest possible types — literal environment names, not just `string` — without hand-writing a separate interface.

**Approach:** Use `as const` to lock in literal types and deep readonly-ness from a single object literal, instead of declaring an interface and hoping every field's inferred type happens to be narrow enough. This is the standard pattern for config/constants modules.

```typescript
const appConfig = {
  environment: "production",
  region: "us-east-1",
  featureFlags: {
    newCheckout: true,
    betaDashboard: false,
  },
  retry: {
    maxAttempts: 3,
    backoffMs: [100, 500, 2000],
  },
} as const;

// Inferred type (roughly):
// {
//   readonly environment: "production";
//   readonly region: "us-east-1";
//   readonly featureFlags: { readonly newCheckout: true; readonly betaDashboard: false };
//   readonly retry: { readonly maxAttempts: 3; readonly backoffMs: readonly [100, 500, 2000] };
// }

function logEnvironment(env: typeof appConfig.environment): void {
  console.log(`Running in ${env}`);
}

logEnvironment(appConfig.environment); // ok — literal "production" matches exactly

// appConfig.environment = "staging"; // Error: Cannot assign to 'environment' because it is read-only
// appConfig.retry.backoffMs.push(5000); // Error: Property 'push' does not exist on readonly array
```

Without `as const`, `appConfig.environment` would infer as plain `string`, `featureFlags.newCheckout` as `boolean`, and `retry.backoffMs` as `number[]` — all technically correct but far looser than needed, and none of the object would be protected from accidental mutation deep in some unrelated module. `as const` is the idiomatic way to get interface-like precision (and deep immutability) from a plain object literal without writing and maintaining a matching `interface` by hand — trading off, notably, that the values are now genuinely frozen at the type level, so this pattern only fits objects you never intend to mutate at runtime.
