```typescript
type Status = "draft" | "published" | "archived";

const LABELS: Record<Status, string> = {
  draft: "Draft",
  published: "Published",
};
```

Does this compile?

**Answer:** No. TypeScript reports "Property 'archived' is missing in type '{ draft: string; published: string; }' but required in type 'Record<Status, string>'."

**Why:** `Record<Status, string>` expands to an object type requiring exactly the keys `"draft" | "published" | "archived"`, each mapped to a `string` — it's not a partial mapping, every member of the `Status` union must have a corresponding key in the object literal. Leaving out `archived` means the object literal doesn't structurally satisfy `Record<Status, string>`, so the assignment is rejected. This is precisely the mechanism used to build a "must stay in sync" label map: because `LABELS` is explicitly typed as `Record<Status, string>` rather than left to inference, adding a new member to the `Status` union later (say, `"cancelled"`) immediately produces this exact same compile error at the `LABELS` declaration, forcing whoever added the new status to also add its label before the code can build — turning what would otherwise be a runtime `undefined` label into a compile-time reminder.
