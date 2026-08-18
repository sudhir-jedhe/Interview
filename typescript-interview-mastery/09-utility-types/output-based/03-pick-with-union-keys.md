```typescript
interface Metrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

type ResourceKey = "cpu" | "memory" | "gpu";

type ResourceMetrics = Pick<Metrics, ResourceKey>;
```

**Answer:** This does NOT compile. TypeScript reports: `Type '"gpu"' does not satisfy the constraint 'keyof Metrics'` (the error surfaces on the `ResourceKey` union or the `Pick` instantiation, depending on TS version, pointing at `"gpu"`).

**Why:** `Pick<T, K>` is declared as `Pick<T, K extends keyof T>` — the second type parameter is constrained to actually be a key of `T`. `"gpu"` is not a property of `Metrics`, so the union `ResourceKey` as a whole fails the constraint even though `"cpu"` and `"memory"` are valid. This is a common trap when a key union is defined independently of the object type instead of derived from it (e.g., via `keyof Metrics`) — the two can drift apart, and `Pick` is the safety net that catches the drift at compile time rather than silently picking only the valid keys.
