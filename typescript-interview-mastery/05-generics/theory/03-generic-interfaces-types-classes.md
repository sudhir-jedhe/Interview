# Generic Interfaces, Type Aliases, and Classes

Generics aren't limited to functions — interfaces, type aliases, and classes can all be parameterized, which is how you build reusable containers, wrappers, and data structures that stay fully typed regardless of what they hold.

## Generic interfaces

An interface can declare type parameters the same way a function does, and every member inside can reference them.

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: "Priya" },
  status: 200,
  timestamp: "2026-08-17T10:00:00Z",
};

const listResponse: ApiResponse<User[]> = {
  data: [{ id: 1, name: "Priya" }],
  status: 200,
  timestamp: "2026-08-17T10:00:00Z",
};
```

`ApiResponse<T>` is a template — `ApiResponse<User>` and `ApiResponse<User[]>` are two distinct, fully concrete types once instantiated, exactly like passing different arguments into a function.

## Generic type aliases

Type aliases support the same parameterization and are often preferred over interfaces for unions, tuples, and mapped shapes.

```typescript
type Pair<A, B> = [A, B];
type Nullable<T> = T | null;

const coords: Pair<number, number> = [12.9, 77.6];
const maybeUser: Nullable<User> = null;
```

## Generic classes

A class declares its type parameters right after the class name, and they're available on the instance's properties, methods, and constructor.

```typescript
class Box<T> {
  private contents: T;

  constructor(value: T) {
    this.contents = value;
  }

  get(): T {
    return this.contents;
  }

  set(value: T): void {
    this.contents = value;
  }
}

const numberBox = new Box<number>(42);
const inferredBox = new Box("typescript"); // T inferred as string from the constructor arg

numberBox.set(100);   // ok
// numberBox.set("x"); // Error: string is not assignable to number
```

Once `T` is bound at construction time (explicitly or via inference), every method on that specific instance is locked to that type — `numberBox` is a `Box<number>` for its entire lifetime, there's no way to "reopen" `T` later.

## Multiple type parameters

Interfaces, aliases, and classes can all take more than one type parameter, and later parameters can even be constrained in terms of earlier ones.

```typescript
class Cache<K extends string | number, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }
}

const sessionCache = new Cache<string, { userId: number }>();
sessionCache.set("sess_1", { userId: 42 });
```

## Why this matters in interviews

Being asked to design a generic `Box`, `Cache`, or `Repository` class is a common way for interviewers to check that you understand generics apply to *type-level shapes*, not just function signatures — and that once a generic class is instantiated with a concrete type, TypeScript treats that instance as if the class had been hand-written for that exact type.
