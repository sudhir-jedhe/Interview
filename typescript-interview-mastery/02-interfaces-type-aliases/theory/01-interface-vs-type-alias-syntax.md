# Interface Syntax vs Type Alias Syntax

`interface` and `type` are the two ways to name an object shape in TypeScript, and their basic syntax looks nearly identical for simple cases — which is exactly why interviewers probe the differences. Both let you describe properties, methods, optional fields, and readonly fields.

## Basic interface declaration

```typescript
interface User {
  id: number;
  email: string;
  displayName?: string; // optional
  readonly createdAt: Date; // readonly
}

const user: User = {
  id: 1,
  email: "ada@example.com",
  createdAt: new Date(),
};
```

## Basic type alias declaration

```typescript
type UserAlias = {
  id: number;
  email: string;
  displayName?: string;
  readonly createdAt: Date;
};

const userAlias: UserAlias = {
  id: 1,
  email: "ada@example.com",
  createdAt: new Date(),
};
```

For object shapes like this, `interface` and `type` are functionally interchangeable — both produce the same structural type, both support optional and readonly modifiers, and both can be used as function parameter types, return types, or generic constraints identically.

## Interface methods

Interfaces support a shorthand method syntax that reads like a class member:

```typescript
interface Repository<T> {
  findById(id: number): T | undefined;
  save(entity: T): void;
}
```

Type aliases express the same thing using function type syntax as a property value — functionally equivalent, just different punctuation:

```typescript
type RepositoryAlias<T> = {
  findById: (id: number) => T | undefined;
  save: (entity: T) => void;
};
```

## What type aliases can do that interfaces cannot

Type aliases can name *any* type, not just object shapes — unions, intersections, tuples, primitives, and mapped/conditional types:

```typescript
type Status = "pending" | "shipped" | "delivered"; // union of literals
type ID = string | number;                          // union of primitives
type Point = [x: number, y: number];                 // tuple
type Handler = (event: string) => void;              // function type
```

None of these can be expressed as an `interface` — `interface Status = "pending" | ...` is not valid syntax. This is the single clearest case where you must reach for `type`.

## What interfaces can do that type aliases cannot (cleanly)

Interfaces support **declaration merging**: declaring the same interface name twice in the same scope automatically merges the members into one interface, rather than causing a redeclaration error. Type aliases cannot be redeclared at all — doing so is a compile error. This distinction (covered in depth in `02-declaration-merging-and-extension.md`) is the most commonly cited "real" difference in interviews, since augmenting third-party library types (like extending Express's `Request` object) relies entirely on this behavior.

## The practical rule of thumb

Use `interface` for public object/class shapes that might need to be extended or merged (especially library-facing APIs). Use `type` for unions, tuples, function types, mapped/conditional types, and anything that isn't a plain object shape. For simple internal object shapes, either works — pick one convention and apply it consistently across a codebase.
