# Scenario: CI Type-Checks Pass but the App Crashes for One User Segment

Your team ships a frontend app that uses `Array.prototype.at()` and `Object.hasOwn()`, both relatively modern JS built-ins. CI runs `tsc --noEmit` and passes cleanly on every PR. A week after release, support tickets come in from users on older Safari versions reporting a blank white screen, while the vast majority of users (on Chrome) see no issue.

**Approach:**

This isn't a `strict`-mode bug at all — it's a `target`/`lib` mismatch masquerading as a runtime bug, which is exactly why it's worth walking through: strict-mode flags catch *type* errors, but `lib` only tells the compiler what APIs to *assume exist* for type-checking purposes; it does not verify that your actual deployment targets (real browsers, in this case) support those APIs at runtime, and it does not polyfill anything.

```jsonc
// tsconfig.json (before)
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"]
  }
}
```

`lib: ["ES2022"]` tells TypeScript that `Array.prototype.at()` and `Object.hasOwn()` exist, so code using them type-checks fine — and it should, since `tsc`'s job is to check *type* correctness against the declared API surface, not to enforce browser compatibility. The gap is that `lib` and the project's actual browser support matrix (older Safari, which lacks `Array.prototype.at` in some versions) are two independent things that were never cross-checked.

The fix has two parts, and both matter:

1. **Bundler-side polyfilling/transpilation**, not a `tsconfig` change: Babel or the bundler's own target-browser transpilation (`browserslist` config feeding into `@babel/preset-env` or similar) needs to inject polyfills or transform these calls for the actual browsers you support. `tsconfig`'s `target`/`lib` control TypeScript's own downleveling and type-checking, but most modern build setups delegate final JS transpilation to a bundler/Babel pipeline that has its own, separate browser-target configuration — the two must be kept in sync deliberately, since TypeScript has no visibility into the bundler's browserslist and vice versa.
2. **Tighten `lib` to reflect genuinely guaranteed APIs**, or explicitly audit any usage of very recent additions (`Array.prototype.at`, `structuredClone`, etc.) against the project's real support matrix, treating them the same as any other feature-detection decision — `lib` inclusion is not a safety net for "will this actually run everywhere," only for "does TypeScript know this API's shape."

**Lesson:** `lib` answers "what can the type checker assume exists," which is a *static* question entirely separate from "what will actually run in production browsers," which is a *runtime/deployment* question. Confusing the two — assuming a clean `tsc` build implies runtime compatibility across your full support matrix — is a subtle trap because `strict` mode and a clean compile give a false sense of complete safety that doesn't extend to target-environment compatibility.
