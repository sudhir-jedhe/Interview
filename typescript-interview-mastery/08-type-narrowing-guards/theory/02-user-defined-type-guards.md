# User-Defined Type Guards

Built-in narrowing (`typeof`, `instanceof`, `in`) covers a lot of ground, but sometimes the check you need is more complex than a single operator — validating a shape, checking a regex, confirming several conditions at once. A user-defined type guard lets you package arbitrary validation logic into a function whose return type tells the compiler "if this returns `true`, treat the argument as this narrower type from here on."

## The `x is Foo` return type

A type guard function returns a boolean at runtime but is annotated with a special return type, `parameterName is Type`, called a type predicate.

```typescript
interface Cat {
  meow(): void;
}
interface Dog {
  bark(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return typeof (animal as Cat).meow === "function";
}

function play(animal: Cat | Dog): void {
  if (isCat(animal)) {
    animal.meow(); // animal: Cat, narrowed by the type guard
  } else {
    animal.bark();  // animal: Dog, narrowed by elimination
  }
}
```

The type predicate (`animal is Cat`) is a promise you're making to the compiler — TypeScript does not verify that the function body actually behaves consistently with what the predicate claims. If the implementation is wrong (e.g., it always returns `true`), the compiler will still trust the predicate and narrow incorrectly, silently defeating the safety the guard was supposed to provide. This makes type guards powerful but also a place where bugs can hide, since they cross from "checked by the compiler" into "trusted based on your implementation."

## A common real pattern: validating unknown input

Type guards are most valuable at the boundary between untyped/external data and your typed application code — validating a JSON payload, a form input, or an environment variable.

```typescript
interface UserProfile {
  id: string;
  email: string;
  age: number;
}

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.email === "string" &&
    typeof v.age === "number"
  );
}

function processApiResponse(data: unknown): void {
  if (isUserProfile(data)) {
    console.log(data.email.toLowerCase()); // data: UserProfile
  } else {
    throw new Error("Malformed user profile response");
  }
}
```

## Type guards as array filter predicates

A well-typed guard also makes `.filter()` narrow the resulting array's element type, which a plain boolean-returning predicate can't do.

```typescript
const values: (string | null)[] = ["a", null, "b", null];

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

const strings: string[] = values.filter(isNotNull); // string[], not (string | null)[]
```

Without the `value is T` predicate, `.filter(v => v !== null)` still removes the `null`s at runtime, but TypeScript's built-in `Array.filter` overload can't infer a narrower result type from an arrow function that merely returns `boolean` — it needs the type predicate to know the output array excludes `null`.

## Why this matters in interviews

Writing a type guard from scratch — commonly `isValidEmail`, `isNonNull`, or a shape validator like `isUserProfile` above — is one of the most frequently asked hands-on TypeScript exercises. The key things interviewers check: correct `x is Type` syntax, a runtime check that actually implements what the predicate claims, and awareness that the compiler trusts the predicate without verifying it, which is exactly why a wrong or lazy implementation is a real (if quiet) source of bugs.
