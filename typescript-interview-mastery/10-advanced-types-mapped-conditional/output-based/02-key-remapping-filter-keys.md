```typescript
interface Metrics {
  cpuPercent: number;
  memoryPercent: number;
  hostname: string;
  region: string;
}

type OnlyNumericFields<T> = {
  [K in keyof T as T[K] extends number ? K : never]: T[K];
};

type NumericMetrics = OnlyNumericFields<Metrics>;

const m: NumericMetrics = { cpuPercent: 80, memoryPercent: 55 };
const bad: NumericMetrics = { cpuPercent: 80, memoryPercent: 55, hostname: "web-1" }; // (1)
```

**Answer:** `NumericMetrics` resolves to `{ cpuPercent: number; memoryPercent: number }` — `hostname` and `region` are dropped. Line (1) fails to compile: `Object literal may only specify known properties, and 'hostname' does not exist in type 'NumericMetrics'`.

**Why:** The key-remapping clause `as T[K] extends number ? K : never` is evaluated once per key. For `cpuPercent` and `memoryPercent`, `T[K]` is `number`, so the conditional resolves to `K` (keep the key, unchanged name). For `hostname` and `region`, `T[K]` is `string`, so the conditional resolves to `never` — and a mapped type entry whose remapped key is `never` is omitted from the result entirely. This is the standard "pick keys by value type" pattern, something plain `Pick<T, K>` cannot do since `Pick` only filters on key *names*, never on the types those keys point to.
