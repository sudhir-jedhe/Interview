# Snippet: Type alias for a union and a matching object shape

Shows a type alias expressing a literal union (something an interface cannot do) alongside an object shape alias.

```typescript
type SubscriptionTier = "free" | "pro" | "enterprise";

type Subscription = {
  tier: SubscriptionTier;
  seats: number;
  renewsAt: Date | null;
};

const sub: Subscription = {
  tier: "pro",
  seats: 5,
  renewsAt: new Date("2026-12-01"),
};

console.log(`${sub.tier} plan with ${sub.seats} seats`);
```
