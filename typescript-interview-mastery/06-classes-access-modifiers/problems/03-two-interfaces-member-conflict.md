# Implement a class satisfying two interfaces, and explain a member conflict

## Problem

Design a `Vehicle` class that implements two interfaces — `Trackable` (has a `location(): string` method used by a fleet-tracking dashboard) and `Sellable` (has a `location(): { lat: number; lng: number }` method used by a marketplace listing that needs geo-coordinates, not a text description). Implement `Vehicle` and explain why this specific conflict cannot be resolved with one method, unlike a conflict that involves compatible parameter widening.

## Solution

```typescript
interface Trackable {
  location(): string;
}

interface Sellable {
  location(): { lat: number; lng: number };
}

// This does not compile — see explanation below.
class Vehicle implements Trackable, Sellable {
  location() {
    // No single return type can be both `string` and `{ lat: number; lng: number }`
    return "somewhere"; // Error: doesn't satisfy Sellable's location()
  }
}
```

```typescript
// A real fix: rename one of the members so the contracts don't collide.
interface Trackable {
  trackingLabel(): string;
}

interface Sellable {
  geoLocation(): { lat: number; lng: number };
}

class Vehicle implements Trackable, Sellable {
  constructor(private lat: number, private lng: number, private label: string) {}

  trackingLabel(): string {
    return this.label;
  }

  geoLocation(): { lat: number; lng: number } {
    return { lat: this.lat, lng: this.lng };
  }
}
```

## Discussion

This conflict is fundamentally different from the "widen the parameter type" fix that works for method conflicts with compatible-but-different parameter types. Here, both interfaces demand a method with the exact same name, `location`, but require *incompatible return types* — `string` versus an object literal shape. Return types can't be reconciled the way parameter types can, because TypeScript checks that a function's return type is a subtype of what's expected at each usage site, and no single concrete return value can simultaneously be a `string` and satisfy `{ lat: number; lng: number }`. There's no union-return trick that fixes this either (`location(): string | { lat: number; lng: number }` would compile, but it pushes the disambiguation problem onto every caller, who now has to narrow the return value before using it — usually a worse outcome than just renaming one of the interface members). The clean, idiomatic fix is what real codebases do: give each interface a distinctly-named member (`trackingLabel` vs `geoLocation`) so a single class can implement both contracts without any collision at all.
