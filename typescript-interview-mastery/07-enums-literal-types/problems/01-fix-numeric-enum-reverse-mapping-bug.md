# Convert a buggy numeric enum to a safer string-literal-union alternative

## Problem

The following code has a live bug: `applyDiscount` should only accept the three declared `CustomerTier` values, but it silently accepts any number, and a recent incident happened because a stray `discountTier` computed from an off-by-one array index (`3` instead of a valid `0`, `1`, or `2`) was passed straight through with no compile error.

```typescript
enum CustomerTier {
  Standard, // 0
  Silver,   // 1
  Gold,     // 2
}

function applyDiscount(tier: CustomerTier, total: number): number {
  const rates = [0, 0.05, 0.1];
  return total * (1 - rates[tier]); // rates[3] is undefined -> NaN, no compile error
}

applyDiscount(3 as CustomerTier, 100); // bug slipped through review
```

Rewrite this to a string-literal-union design that makes the invalid call above impossible to compile.

## Solution

```typescript
type CustomerTier = "standard" | "silver" | "gold";

const DISCOUNT_RATES: Record<CustomerTier, number> = {
  standard: 0,
  silver: 0.05,
  gold: 0.1,
};

function applyDiscount(tier: CustomerTier, total: number): number {
  return total * (1 - DISCOUNT_RATES[tier]);
}

applyDiscount("gold", 100);   // 90
// applyDiscount("platinum", 100); // Error: not assignable to CustomerTier
// applyDiscount(3, 100);          // Error: number is not assignable to CustomerTier
```

## Discussion

Two independent problems in the original code are both fixed by this rewrite. First, `CustomerTier` as a numeric enum type accepted any `number`, including the `3` that caused the incident — a literal union rejects any value outside the three declared strings, at compile time, with no cast able to sneak an invalid value through unless someone deliberately writes `as CustomerTier` (which is a visible, greppable smell, unlike `3` silently type-checking as a bare numeric literal). Second, the original used a *positional* array (`rates[tier]`) to map tier to discount, which depends on the numeric enum's exact ordinal values staying stable and in sync with the array's indices — the `Record<CustomerTier, number>` replacement removes that fragile positional coupling entirely, mapping each tier to its rate by name, and (as a bonus) the compiler now also enforces that every tier has a rate defined, since `Record` requires all keys to be present.
