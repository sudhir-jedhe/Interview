# Problem 3: A `strictPropertyInitialization`-Compliant Class Requiring Async Init

## The setup

You need a `RemoteConfigService` class whose `config` property is fetched from a network endpoint. Fetching is inherently asynchronous, but constructors in JavaScript/TypeScript cannot be `async` — so `config` genuinely cannot be assigned inside `constructor()`. Under `strict: true` (`strictPropertyInitialization`), the naive version fails to compile:

```typescript
interface RemoteConfig {
  apiUrl: string;
  featureFlags: Record<string, boolean>;
}

class RemoteConfigService {
  private config: RemoteConfig; // Error: no initializer, not assigned in constructor

  constructor(private endpoint: string) {}

  async load(): Promise<void> {
    const res = await fetch(this.endpoint);
    this.config = await res.json();
  }

  getFlag(name: string): boolean {
    return this.config.featureFlags[name] ?? false;
  }
}
```

## Your task

Implement this correctly two ways, and explain the trade-off between them:
1. Using a definite assignment assertion (`!`) on the property.
2. Restructuring to a static async factory that guarantees `config` is set before the object is ever usable.

## Reference solution

**Option A — definite assignment assertion:**

```typescript
class RemoteConfigService {
  private config!: RemoteConfig; // `!` tells TS: trust me, this will be set before use
  private loaded = false;

  constructor(private endpoint: string) {}

  async load(): Promise<void> {
    const res = await fetch(this.endpoint);
    this.config = await res.json();
    this.loaded = true;
  }

  getFlag(name: string): boolean {
    if (!this.loaded) {
      throw new Error("RemoteConfigService.load() must be called before use");
    }
    return this.config.featureFlags[name] ?? false;
  }
}
```

`config!` (definite assignment assertion) tells the compiler to skip the initialization check for this property, trusting that some other code path assigns it before it's read. This is honest about the *timing* problem but shifts the safety burden onto the developer — nothing stops a caller from calling `getFlag()` before `load()` except the manual `loaded` guard added here. Without that guard, `getFlag` would silently read `undefined.featureFlags`, crashing. The assertion itself provides zero runtime protection, exactly like the non-null assertion operator on any other value (see topic 12) — it should always be paired with an explicit runtime check if there's any realistic path where the property is accessed too early.

**Option B — static async factory (stronger guarantee, no assertion needed):**

```typescript
class RemoteConfigService {
  private constructor(private config: RemoteConfig) {}
  // private constructor + strictPropertyInitialization is satisfied normally:
  // `config` is assigned as a constructor parameter property, no gap at all.

  static async create(endpoint: string): Promise<RemoteConfigService> {
    const res = await fetch(endpoint);
    const config: RemoteConfig = await res.json();
    return new RemoteConfigService(config);
  }

  getFlag(name: string): boolean {
    return this.config.featureFlags[name] ?? false;
  }
}

// usage:
const service = await RemoteConfigService.create("/api/config");
service.getFlag("newCheckout"); // always safe -- an instance can't exist without config
```

Making the constructor `private` and only exposing construction through `static async create()` makes it *impossible* to hold a `RemoteConfigService` instance whose `config` isn't set — there's no `!`, no `loaded` flag, and no runtime guard needed anywhere, because the type system and the class's public API together guarantee the invariant. This is strictly safer than Option A.

## Trade-off summary

Option A (`!` + manual guard) is faster to retrofit onto an existing class with an established constructor-based API and many existing call sites, at the cost of relying on a developer-maintained runtime check that's easy to forget to call correctly. Option B (static async factory) eliminates the unsafe window entirely by construction, but requires changing how the class is instantiated everywhere it's used (`new X()` → `await X.create()`), which is a bigger refactor. For new code, prefer Option B; reach for Option A only as a pragmatic, well-guarded stopgap on code you can't fully restructure yet.
