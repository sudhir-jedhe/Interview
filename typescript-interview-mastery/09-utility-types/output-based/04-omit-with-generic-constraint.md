```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface Article extends BaseEntity {
  title: string;
  body: string;
}

function stripMetadata<T extends BaseEntity>(entity: T): Omit<T, "id" | "createdAt"> {
  const { id, createdAt, ...rest } = entity;
  return rest;
}

const article: Article = { id: "a1", createdAt: new Date(), title: "Hi", body: "..." };
const stripped = stripMetadata(article);
stripped.id; // (1)
stripped.title; // (2)
```

**Answer:** Line (1) fails to compile: `Property 'id' does not exist on type 'Omit<Article, "id" | "createdAt">'`. Line (2) compiles fine and has type `string`.

**Why:** Because `stripMetadata` is generic over `T extends BaseEntity`, TypeScript infers `T = Article` at the call site, and the return type becomes `Omit<Article, "id" | "createdAt">` — which correctly excludes `id` and `createdAt` while retaining `title` and `body`. This demonstrates that `Omit` composes correctly with generics: the exclusion set doesn't have to be hardcoded against a single concrete type, it can reference the constraint's keys and still apply properly once `T` is resolved to the concrete `Article` type at the call site.
