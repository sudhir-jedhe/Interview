# Problem 1: Implement DeepReadonly\<T\>

## Task

Implement `DeepReadonly<T>`, a mapped type that recursively makes every property of `T` readonly, including properties nested arbitrarily deep inside other objects and inside arrays.

Requirements:
1. Top-level properties must be `readonly`.
2. Nested object properties must also be `readonly`, at every depth.
3. Arrays (and their elements, if the elements are objects) must also become deeply readonly — an array property should become a `readonly` array whose elements are themselves deeply readonly.
4. Primitives (`string`, `number`, `boolean`, `null`, `undefined`, etc.) should pass through unchanged — there's nothing to make "more readonly" about a primitive.

```typescript
interface Team {
  name: string;
  lead: { name: string; email: string };
  members: { name: string; role: string }[];
}
```

## Solution

```typescript
type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type ReadonlyTeam = DeepReadonly<Team>;

const team: ReadonlyTeam = {
  name: "Platform",
  lead: { name: "Ari", email: "ari@example.com" },
  members: [{ name: "Sam", role: "engineer" }],
};

// team.name = "Infra";                  // Error: read-only
// team.lead.email = "new@example.com";  // Error: read-only, nested one level
// team.members.push({ name: "Kim", role: "engineer" }); // Error: push doesn't exist on ReadonlyArray
// team.members[0].role = "manager";     // Error: read-only, nested through the array
```

**Why this works:**

- `T extends (infer U)[]` is checked first so arrays are wrapped in `ReadonlyArray<...>` (which blocks mutating methods like `push`/`splice` at the type level) instead of falling through to the generic object branch, and each element `U` is recursively processed too.
- `T extends Function` is checked next and returned unchanged — without this guard, `{ readonly [K in keyof T]: ... }` applied to a function type would try to map over a function's own properties (like `.name`, `.length`), which is rarely what you want and can produce confusing results; excluding functions is standard practice in deep-transformation utilities.
- `T extends object` catches everything else that's a plain object (interfaces, object literals, `Date`, etc.) and recurses into every property with `DeepReadonly<T[K]>`, which is what makes the "deep" part actually deep — each property's *value* also goes back through `DeepReadonly`, not just its top-level container.
- The final `: T` branch is the base case — primitives fail every `extends` check above and are returned as-is, terminating the recursion.
