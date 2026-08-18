# Partial\<T\>, Required\<T\>, Readonly\<T\>

These three utilities transform the *shape* of an object type without changing which keys exist — they only change whether keys are optional, mandatory, or mutable.

## `Partial<T>`

`Partial<T>` makes every property in `T` optional. It's the type-level equivalent of "give me some or all of these fields." The canonical use case is an update/patch function, where a caller supplies only the fields they want to change.

```typescript
interface Task {
  id: string;
  title: string;
  done: boolean;
  dueDate: Date;
}

function updateTask(id: string, changes: Partial<Task>): void {
  // changes might be { done: true } or { title: "New title", dueDate: new Date() }
  const existing = getTask(id);
  saveTask({ ...existing, ...changes });
}

updateTask("t1", { done: true }); // valid — only one field supplied
```

Without `Partial`, you'd have to write `{ title?: string; done?: boolean; ... }` by hand and keep it in sync with `Task` forever. `Partial<T>` derives it automatically, so if `Task` gains a field, the patch type gains it too.

## `Required<T>`

`Required<T>` is the inverse: it strips optionality from every property, forcing all of them to be present. This is useful when you receive a type that was intentionally loose (e.g., user-supplied config with defaults) and want to guarantee, after merging in defaults, that every field is now populated.

```typescript
interface ClientOptions {
  timeoutMs?: number;
  retries?: number;
  baseUrl?: string;
}

const defaults: Required<ClientOptions> = {
  timeoutMs: 5000,
  retries: 3,
  baseUrl: "https://api.example.com",
};

function createClient(opts: ClientOptions): Required<ClientOptions> {
  return { ...defaults, ...opts }; // every field is now guaranteed present
}
```

The return type annotation `Required<ClientOptions>` documents, at the type level, that callers of `createClient` never have to null-check these fields again.

## `Readonly<T>`

`Readonly<T>` marks every property as `readonly`, preventing reassignment after the object is created. It's a compile-time guard, not a runtime freeze — `Object.freeze` is still needed if you want to stop mutation at runtime too.

```typescript
interface AppState {
  userId: string;
  theme: "light" | "dark";
}

function createStore(initial: AppState): Readonly<AppState> {
  return { ...initial };
}

const state = createStore({ userId: "u1", theme: "dark" });
state.theme = "light"; // Error: Cannot assign to 'theme' because it is a read-only property
```

This is the standard pattern for exposing state from a store/reducer: consumers can read it but the compiler stops them from mutating it directly, forcing them through an explicit update path (like a dispatch or setter).

## How they're implemented

All three are mapped types over `keyof T`, differing only in which modifier they add:

```typescript
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

`Partial` adds `?`, `Required` removes it with `-?`, and `Readonly` prepends the `readonly` modifier. None of them change property names or value types — they only rewrite modifiers, which is exactly what mapped type modifier syntax (`?`, `-?`, `readonly`, `-readonly`) is designed for. This mechanism is covered in depth in topic 10.
