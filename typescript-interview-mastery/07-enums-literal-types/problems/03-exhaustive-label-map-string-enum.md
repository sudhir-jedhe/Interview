# Map a string enum to a display label with a compile-checked exhaustive Record

## Problem

Given a string enum `SubscriptionTier`, implement a `getDisplayLabel` function backed by a label map such that adding a new tier to the enum without updating the label map causes a compile error — not a runtime fallback to some default string, and not a silent `undefined`.

```typescript
enum SubscriptionTier {
  Free = "FREE",
  Pro = "PRO",
  Enterprise = "ENTERPRISE",
}
```

## Solution

```typescript
enum SubscriptionTier {
  Free = "FREE",
  Pro = "PRO",
  Enterprise = "ENTERPRISE",
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  [SubscriptionTier.Free]: "Free",
  [SubscriptionTier.Pro]: "Pro",
  [SubscriptionTier.Enterprise]: "Enterprise",
};

function getDisplayLabel(tier: SubscriptionTier): string {
  return TIER_LABELS[tier];
}

console.log(getDisplayLabel(SubscriptionTier.Pro)); // "Pro"
```

## What happens when a new tier is added

```typescript
enum SubscriptionTier {
  Free = "FREE",
  Pro = "PRO",
  Enterprise = "ENTERPRISE",
  Trial = "TRIAL", // added later
}

// TIER_LABELS above now fails to compile:
// Property '[SubscriptionTier.Trial]' is missing in type
// '{ [SubscriptionTier.Free]: string; ... }' but required in type
// 'Record<SubscriptionTier, string>'.
```

## Discussion

The critical design choice is typing `TIER_LABELS` explicitly as `Record<SubscriptionTier, string>` instead of letting TypeScript infer a narrower object type from the literal — inference alone would just describe "an object with these three specific keys," which wouldn't complain about a fourth enum member existing elsewhere that isn't a key here. Declaring the target type up front (`Record<SubscriptionTier, string>`) forces the object literal to be checked *against* the full enum, key by key, which is what makes the map "exhaustive" in a way the compiler actually verifies. `getDisplayLabel` itself stays trivial — a direct lookup — precisely because all the real safety work happens once, at `TIER_LABELS`'s declaration, rather than needing a runtime fallback branch (`?? "Unknown"`) to paper over a case that should be structurally impossible once the map is exhaustive.
