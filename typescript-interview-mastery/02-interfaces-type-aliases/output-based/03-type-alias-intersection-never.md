# What's the error here (and where does it appear)?

```typescript
type WithStringId = { id: string; label: string };
type WithNumberId = { id: number; label: string };

type Merged = WithStringId & WithNumberId;

const item: Merged = { id: "abc", label: "Widget" };
```

**Answer:** The type alias declarations for `WithStringId`, `WithNumberId`, and `Merged` all compile without any error. The error appears only at `const item: Merged = ...`: `Type 'string' is not assignable to type 'never'.` (referring to the `id` property).

**Why:** Intersecting two object types with a conflicting property (`id: string` vs `id: number`) doesn't fail at the point the intersection type is *defined* — TypeScript happily computes `Merged` and gives `id` the type `string & number`, which resolves to `never` (there is no value that is simultaneously a `string` and a `number`). The problem only becomes visible once you try to actually construct a value of type `Merged`, since no real value can satisfy an `id: never` requirement. This delayed-failure behavior is the key practical downside of `&` versus `interface extends` (which errors immediately at the conflicting declaration, as shown in `output-based/02-interface-merging-conflict.md`) — it's easy to define a type-alias intersection with a hidden conflict and not notice until much later, at a distant call site.
