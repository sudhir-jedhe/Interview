# Scenario: Third-Party Library Typings Don't Match Real Behavior

Your app uses a legacy analytics SDK whose `@types` package declares:

```typescript
declare function trackEvent(name: string, payload: Record<string, unknown>): void;
```

In practice, calling `trackEvent` with `payload: undefined` is completely valid at runtime (the SDK just skips sending extra fields), but the typings don't reflect that — they require `payload` to always be provided. Multiple call sites in your codebase have been "fixed" by developers doing `trackEvent("click", undefined as any)` to get past the compiler.

**Approach:**

`as any` at each call site is exactly the kind of scattered assertion abuse that erodes type safety over time — it silences the specific error but also disables checking of the *first* argument at that call, and it's easy to accidentally pass `undefined as any` in place of a legitimately wrong `name` argument later without anyone noticing.

The correct fix is to correct the typing at the boundary once, rather than suppress the symptom at every call site:

```typescript
// analytics.d.ts (or a local augmentation/wrapper module)
declare function trackEvent(
  name: string,
  payload?: Record<string, unknown>
): void;
```

If you can't edit the third-party `.d.ts` directly (e.g., it's inside `node_modules`), wrap the call in a small typed adapter instead of asserting at every use:

```typescript
import { trackEvent as rawTrackEvent } from "legacy-analytics-sdk";

export function trackEvent(name: string, payload?: Record<string, unknown>): void {
  rawTrackEvent(name, payload ?? {});
}
```

This adapter does two things: it gives the rest of the codebase an accurate, honest type signature (`payload` really is optional), and it isolates the one place where we reconcile the mismatch between the SDK's actual runtime behavior and its (wrong) shipped types — passing `{}` instead of `undefined` to satisfy the original strict signature, since we know from testing that an empty object is behaviorally equivalent to omitting the payload for this SDK.

Every call site now reads `trackEvent("click")` with no assertions at all, and if the SDK's real signature ever changes, there's exactly one function to update instead of grep-and-replace across dozens of `as any` call sites. The general principle: when a third-party type is wrong, fix it once at the integration boundary (a `.d.ts` patch or a thin wrapper) rather than asserting around it repeatedly — repeated assertions are a sign the *type*, not the call site, is the actual bug.
