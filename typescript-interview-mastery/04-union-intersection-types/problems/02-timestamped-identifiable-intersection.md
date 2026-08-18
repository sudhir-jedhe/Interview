# Problem: Build an intersection type combining Timestamped and Identifiable mixins

## Problem statement

Define two small, independently reusable object types — `Timestamped` (`createdAt`, `updatedAt`) and `Identifiable` (`id`) — and combine them via intersection into a concrete `BlogPost` entity type. Write a generic `touch` function that updates `updatedAt` on any `Timestamped` value while preserving its full original type, and a generic `describe` function that works on any `Identifiable` value.

## Requirements

- `type Timestamped = { createdAt: Date; updatedAt: Date }`
- `type Identifiable = { id: string }`
- `type BlogPost = Identifiable & Timestamped & { title: string; body: string }`
- `function touch<T extends Timestamped>(entity: T): T` — returns a new object with `updatedAt` refreshed, preserving `T`.
- `function describe<T extends Identifiable>(entity: T): string`
- Must compile under `strict: true`.

## Solution

```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Identifiable = {
  id: string;
};

type BlogPost = Identifiable & Timestamped & {
  title: string;
  body: string;
};

function touch<T extends Timestamped>(entity: T): T {
  return { ...entity, updatedAt: new Date() };
}

function describe<T extends Identifiable>(entity: T): string {
  return `Entity #${entity.id}`;
}

const post: BlogPost = {
  id: "post-1",
  title: "Understanding Intersection Types",
  body: "...",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const updatedPost = touch(post); // still typed BlogPost — not widened to plain Timestamped
console.log(describe(updatedPost)); // "Entity #post-1"
console.log(updatedPost.title);      // still accessible — full BlogPost shape preserved
console.log(updatedPost.updatedAt > post.updatedAt); // true
```

### Why this is the correct approach

`BlogPost`'s intersection composes two independent, reusable mixins (`Identifiable`, `Timestamped`) with its own specific fields — adding a new mixin later (say, `SoftDeletable`) means defining one new small type and adding it to `BlogPost`'s intersection, without touching `Identifiable` or `Timestamped` at all. The generic constraint pattern (`T extends Timestamped`, `T extends Identifiable`) is what makes `touch` and `describe` reusable across *any* entity carrying that shape, not just `BlogPost` — and because `T` is inferred as the full concrete type passed in, `touch(post)`'s return value stays a genuine `BlogPost` (with `title` and `body` still accessible), rather than being widened down to just `Timestamped`, which would lose information callers still need.
