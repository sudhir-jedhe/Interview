# Scenario: Freezing a Nested App Config with DeepReadonly

Your application loads a nested configuration object at startup — database settings, feature flags, third-party API keys, each nested under its own section. Once loaded, nothing in the app should be able to mutate any part of this config, at any depth, and you want the compiler to catch violations, not just `Object.freeze` at runtime.

```typescript
interface AppConfig {
  database: {
    host: string;
    port: number;
    credentials: { username: string; password: string };
  };
  featureFlags: {
    newCheckout: boolean;
  };
}
```

**Approach:** `Readonly<AppConfig>` alone only locks the top-level keys (`database`, `featureFlags`) — `config.database.host = "evil"` would still compile, because `Readonly` doesn't recurse into nested object types. You need a recursive mapped type that reapplies `readonly` at every level, stopping at primitive values and arrays (or optionally locking array contents too).

```typescript
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

function loadConfig(raw: AppConfig): DeepReadonly<AppConfig> {
  return raw as DeepReadonly<AppConfig>;
}

const config = loadConfig({
  database: { host: "db.internal", port: 5432, credentials: { username: "app", password: "secret" } },
  featureFlags: { newCheckout: true },
});

// config.database.host = "evil"; // Error: read-only property, even though it's two levels deep
// config.database.credentials.password = "x"; // Error: read-only property, three levels deep
```

The type checks `T extends (infer U)[]` first (to wrap array elements in `DeepReadonly` too, rather than leaving array contents mutable) and falls back to `T extends object` for plain nested objects; primitives (`string`, `number`, `boolean`, etc.) fail both checks and are returned unchanged in the final `: T` branch, since there's nothing to make "more readonly" about a primitive value.

This is a very common real-world pattern for config objects, Redux/Zustand store snapshots handed to read-only consumers, and any "immutable data passed down through many layers" scenario where a shallow `Readonly` isn't enough protection.
