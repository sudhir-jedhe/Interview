# Generic Constraints

An unconstrained type parameter `<T>` can be anything, which means the compiler only lets you do things that are valid for *every possible type* — you can't access `.length`, call `.toUpperCase()`, or assume a property exists. A constraint narrows `T` down to "anything that looks like this shape," using `extends`, so the compiler knows more about `T` and permits more operations inside the function body.

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length); // safe — every T is guaranteed to have `length`
  return item;
}

logLength("hello");        // ok, strings have .length
logLength([1, 2, 3]);      // ok, arrays have .length
logLength({ length: 10 }); // ok, structurally matches HasLength
logLength(42);              // Error: number doesn't have `length`
```

Note that `extends` here does not mean "T must literally be a `HasLength` instance" — TypeScript is structurally typed, so any object shape with a compatible `length: number` property satisfies the constraint, including a `string`, an `Array`, or a plain object.

## Constraining with keyof

A very common pattern constrains one type parameter using another, most often to guarantee a key actually exists on an object before you index into it.

```typescript
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Asha", active: true };

pluck(user, "name");   // string
pluck(user, "active"); // boolean
pluck(user, "email");  // Error: "email" is not assignable to "id" | "name" | "active"
```

Without `K extends keyof T`, `key` would have to be typed as `string`, and `obj[key]` would be an error (or `any`) because TypeScript can't verify an arbitrary string is a valid property. The constraint turns an unsafe dynamic lookup into a fully type-checked one, with autocomplete on `key` as a bonus.

## Constraining to a union of literal types

Constraints aren't limited to object shapes — you can constrain `T` to a union to restrict which of a fixed set of values are valid.

```typescript
function nextStatus<T extends "pending" | "active" | "done">(status: T): T {
  return status; // trivial example — real versions branch on `status`
}
```

## Default constraints and the `object` gotcha

A frequent mistake is constraining with `extends object` to mean "not a primitive," then being surprised that arrays and functions also satisfy it (they're objects too) — if you want "plain record," constrain more specifically, e.g. `Record<string, unknown>`.

```typescript
function merge<T extends object>(a: T, b: Partial<T>): T {
  return { ...a, ...b };
}

merge({ id: 1 }, { id: 2 });      // ok
merge([1, 2, 3], {});             // also compiles — arrays are objects too
```

## Why this matters in interviews

Constraints are the mechanism that resolves the tension between "generic enough to be reusable" and "specific enough to be safe." Interviewers frequently probe with a "why doesn't `item.length` compile on a plain `<T>`" question, and the expected answer is that without a constraint, `T` could be `number` or `boolean`, and the compiler must reject anything that isn't valid for every possible substitution of `T`.
