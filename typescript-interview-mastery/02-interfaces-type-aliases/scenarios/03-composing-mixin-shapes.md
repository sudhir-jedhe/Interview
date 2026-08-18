# Scenario: Composing reusable mixin shapes across entities

Your domain has several unrelated entities (`Article`, `Comment`, `Product`) that all share two cross-cutting concerns: they're all timestamped (`createdAt`/`updatedAt`) and all soft-deletable (`deletedAt: Date | null`). You want to define these concerns once and compose them into each entity, rather than repeating the same two fields in every interface.

**Approach:** Define small, single-purpose interfaces for each cross-cutting concern, then use multi-interface `extends` to compose them into concrete entities. This keeps each concern's definition in exactly one place and makes the composed entity's full shape explicit and easy to read at its declaration site.

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable {
  deletedAt: Date | null;
}

interface Article extends Timestamped, SoftDeletable {
  id: number;
  title: string;
  body: string;
}

interface Comment extends Timestamped, SoftDeletable {
  id: number;
  articleId: number;
  body: string;
}

function isDeleted(entity: SoftDeletable): boolean {
  return entity.deletedAt !== null;
}

const article: Article = {
  id: 1,
  title: "TypeScript Interfaces Explained",
  body: "...",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-05"),
  deletedAt: null,
};

console.log(isDeleted(article)); // false — Article structurally satisfies SoftDeletable
```

Because `isDeleted` only needs `SoftDeletable`, it works for `Article`, `Comment`, or any other entity that includes that shape, without a common base class or any runtime inheritance — pure structural composition. This pattern scales well: adding a new cross-cutting concern (say, `Ownable { ownerId: number }`) means defining one new small interface and adding it to the `extends` list of whichever entities need it, with each entity's declaration remaining a single, readable line listing exactly which concerns apply to it.
