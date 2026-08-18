```typescript
type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

const standupTime: Record<Weekday, string> = {
  Mon: "09:00",
  Tue: "09:00",
  Wed: "09:00",
  Thu: "09:00",
  // Fri is missing
};
```

**Answer:** This does NOT compile. TypeScript reports: `Property 'Fri' is missing in type '{ Mon: string; Tue: string; Wed: string; Thu: string; }' but required in type 'Record<Weekday, string>'`.

**Why:** `Record<K, V>` expands to `{ [P in K]: V }` — a mapped type over every member of the key union `K`, with no optional modifier. That means the resulting object type requires *all* of `Mon` through `Fri` to be present, not just some of them. This is precisely what makes `Record` more useful than a loose index signature (`{ [key: string]: string }`) for exhaustive lookup tables: leaving out a day is a compile error instead of a silent `undefined` at runtime when someone looks up `standupTime.Fri`.
