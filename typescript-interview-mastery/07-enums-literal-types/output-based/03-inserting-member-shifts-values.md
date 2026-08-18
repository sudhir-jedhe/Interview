```typescript
enum Tier {
  Bronze, // was 0
  Gold,   // was 1
}

// Six months later, a "Silver" tier is added in the middle:
enum TierV2 {
  Bronze, // 0
  Silver, // 1 — inserted
  Gold,   // 2 — was 1, now 2
}

const storedValue: number = 1; // saved to a database when TierV2 didn't exist yet
console.log(TierV2[storedValue]);
```

What does this print, and what's the underlying danger being demonstrated?

**Answer:** It prints `"Silver"`.

**Why:** This isn't a compile error at all — it's a silent data-correctness bug, which is arguably worse. The value `1` was originally stored when `Bronze = 0, Gold = 1`, meaning `1` meant "Gold" at the time it was persisted. After `Silver` was inserted in the middle of the enum declaration, every member after it shifted up by one in the auto-increment sequence, so `1` now means "Silver" instead. Any previously-stored numeric enum value silently changes meaning the moment the enum's member order changes, with no compiler warning anywhere, because the compiler has no way to know that `1` came from data serialized under a previous version of the enum. The two safe fixes are: always assign explicit values to every numeric enum member (`Bronze = 0, Silver = 1, Gold = 2`, added members go at the end with new explicit numbers) so insertion order can never silently renumber anything, or avoid numeric enums for anything that gets persisted and use a string enum or literal union instead, where each member's identity is its own literal value, immune to reordering.
