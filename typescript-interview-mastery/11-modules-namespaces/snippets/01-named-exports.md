# Snippet: named exports from a small math utility module

```typescript
// A module exporting several related, independently-importable named members.

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export const EPSILON = 0.0001;

// Elsewhere: import { clamp, EPSILON } from "./mathUtils";
```
