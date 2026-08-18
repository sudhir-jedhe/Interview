```typescript
const STATUSES = ["open", "closed"];
type Status = (typeof STATUSES)[number];

function close(status: Status): void {
  console.log(status);
}

close("open");
close("archived");
```

Does `close("archived")` compile? What is `Status` actually inferred as?

**Answer:** Yes, it compiles — `Status` is inferred as `string`, not `"open" | "closed"`, so `close("archived")` is accepted even though `"archived"` was never one of the two array elements.

**Why:** `STATUSES` was declared without `as const`, so TypeScript applies its default widening behavior to the array literal — `["open", "closed"]` becomes `string[]`, not the tuple `readonly ["open", "closed"]`. Indexing a `string[]` type with `[number]` just gets you `string` back, since a regular array's element type is uniformly `string` regardless of position — there's no per-element literal information left to extract. The entire "derive a union from an array" technique depends on `as const` locking each element to its specific literal type and turning the array into a readonly tuple; without it, `typeof STATUSES[number]` degrades all the way down to the element type's general form. The fix is exactly one keyword: `const STATUSES = ["open", "closed"] as const;`, after which `Status` correctly becomes `"open" | "closed"` and `close("archived")` is rejected.
