# Does this compile?

```typescript
type Draft = { status: "draft"; content: string };
type Published = { status: "published"; content: string; publishedAt: Date };

type Merged = Draft & Published;

const doc: Merged = {
  status: "draft",
  content: "Hello world",
  publishedAt: new Date(),
};
```

**Answer:** `Merged` itself is a valid type declaration with no error. The `const doc: Merged = {...}` assignment fails: `Type '"draft"' is not assignable to type 'never'.`

**Why:** `Draft`'s `status` is the literal type `"draft"`, and `Published`'s `status` is the literal type `"published"`. Intersecting them (`"draft" & "published"`) produces `never`, since no single string value can simultaneously be both literals — a value cannot be `"draft"` and `"published"` at once. `Merged`'s effective shape becomes `{ status: never; content: string; publishedAt: Date }`, and there's no possible value for a `never`-typed property, so any attempt to construct a `Merged` value fails at the `status` field specifically. This is a common trap when intersecting discriminated union members directly (rather than intersecting a *whole union* with an unrelated shape, which distributes correctly as shown in `theory/02-intersection-types.md`'s union-distribution section) — intersecting two individual variants of what should have been a union is almost always a modeling mistake, not something you'd actually want.
