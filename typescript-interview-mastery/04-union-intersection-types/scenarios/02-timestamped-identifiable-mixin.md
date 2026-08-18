# Scenario: Building reusable mixin shapes with intersection types

You're building a small ORM-like layer with several entity types (`Article`, `Comment`, `Product`), all of which need consistent `id` and `createdAt`/`updatedAt` fields. Rather than repeating these fields on every entity type, you want two small, independently reusable shapes — `Identifiable` and `Timestamped` — combined via intersection into each concrete entity, plus a couple of generic utility functions that work against just one of the mixins at a time.

**Approach:** Define each cross-cutting concern as its own small `type`, compose concrete entities with `&`, and write utility functions parameterized against just the mixin they actually need — letting them work across any entity that includes that shape, without depending on a specific concrete entity type.

```typescript
type Identifiable = {
  id: string;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Article = Identifiable & Timestamped & {
  title: string;
  body: string;
};

type Comment = Identifiable & Timestamped & {
  articleId: string;
  body: string;
};

function touch<T extends Timestamped>(entity: T): T {
  return { ...entity, updatedAt: new Date() };
}

function describeEntity<T extends Identifiable>(entity: T): string {
  return `Entity #${entity.id}`;
}

const article: Article = {
  id: "art-1",
  title: "Intersections in TypeScript",
  body: "...",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const touched = touch(article); // still typed Article — T is inferred as Article, preserved through the generic
console.log(describeEntity(touched));
console.log(touched.updatedAt > article.updatedAt);
```

`touch<T extends Timestamped>` and `describeEntity<T extends Identifiable>` both work on `Article`, `Comment`, or any future entity — because each generic function only constrains against the specific mixin shape it actually needs, not a concrete entity type, and because `T` is inferred as the *full* concrete type passed in (`Article`), the return value of `touch(article)` stays a genuine `Article`, not a widened `Timestamped`. This is the key advantage of composing entities from small intersected mixins over one large shared base interface: utility functions can depend on the narrowest possible shape they actually use, maximizing reuse without any inheritance hierarchy.
