# Interview Q&A: Strict Flags and Null Checks

**Q: What exactly does `strict: true` turn on?**
A: It's an umbrella flag enabling a family of independent checks: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, and `useUnknownInCatchVariables`. Each can be individually re-disabled after `strict: true` for gradual migration (e.g., `"strict": true, "strictNullChecks": false`).

**Q: Why is `strictNullChecks` considered the single highest-value flag to enable?**
A: Because "cannot read property of null/undefined" is the most common class of runtime error in JavaScript, and without this flag, `null`/`undefined` are silently assignable to every type — meaning function signatures, array methods like `.find()`, and optional properties all lie about never being absent. Enabling it forces every point where a value might be missing to be handled explicitly, catching that entire bug class at compile time instead of in production.

**Q: What's a concrete bug `strictNullChecks` would catch that `noImplicitAny` would not?**
A: `products.find(p => p.id === id).price` — `find()` can return `undefined`, and without `strictNullChecks`, chaining `.price` off its result compiles fine and crashes at runtime when nothing matches. `noImplicitAny` is unrelated here — it only concerns values whose type couldn't be *inferred at all*, not values whose inferred type legitimately includes `undefined`.

**Q: What does `strictPropertyInitialization` require, and what's a legitimate case where a property truly can't be initialized in the constructor?**
A: It requires every class property to be assigned by the end of the constructor (or given a default at declaration). A legitimate exception is a property that depends on an asynchronous initialization step (e.g., loading config from a remote source) that can't run synchronously inside `constructor()` — the correct pattern is either a definite assignment assertion (`property!: Type`) paired with a mandatory `async init()` method, or restructuring to a static async factory function that only returns a fully-initialized instance. See `problems/03-async-init-property.md` for the full comparison.

**Q: If a codebase can't fix all 1,200 `strictNullChecks` errors immediately, what's a reasonable rollout strategy?**
A: Enable `strict: true` globally to get every low-cost sub-flag for free, temporarily disable `strictNullChecks` (or scope it via a secondary `tsconfig` covering only unmigrated legacy files), and burn down the legacy-file list incrementally while all *new* code is fully protected from day one — rather than blocking all feature work on a single all-or-nothing migration.
