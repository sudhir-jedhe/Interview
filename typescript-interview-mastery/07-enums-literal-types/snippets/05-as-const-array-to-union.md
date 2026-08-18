# Deriving a union type from an as-const array

```typescript
// Single source of truth for both the runtime list and the type
const PLANS = ["free", "pro", "enterprise"] as const;
type Plan = (typeof PLANS)[number]; // "free" | "pro" | "enterprise"

function describePlan(plan: Plan): string {
  return `Plan: ${plan}`;
}

console.log(describePlan("pro"));
```
