# `as const` producing a readonly tuple

```typescript
// Snippet: array literal widens to number[] unless locked with `as const`
function useCoordinates() {
  return [0, 0] as const; // readonly [0, 0]
}

const [x, y] = useCoordinates();
// x: 0, y: 0 (both literal number types, tuple positions preserved)
```
