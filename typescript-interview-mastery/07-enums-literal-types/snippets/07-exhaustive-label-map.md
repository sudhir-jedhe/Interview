# Exhaustive Record mapping enum values to labels

```typescript
// Adding a new Status member without updating LABELS is a compile error
enum Status {
  Draft = "DRAFT",
  Published = "PUBLISHED",
  Archived = "ARCHIVED",
}

const LABELS: Record<Status, string> = {
  [Status.Draft]: "Draft",
  [Status.Published]: "Published",
  [Status.Archived]: "Archived",
};

console.log(LABELS[Status.Published]); // "Published"
```
