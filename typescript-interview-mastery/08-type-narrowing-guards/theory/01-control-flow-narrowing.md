# Control-Flow Narrowing: typeof, instanceof, in, and Truthiness

Narrowing is TypeScript's ability to refine a variable's static type within a specific branch of code, based on a runtime check you've written — an `if`, a `switch`, a `&&`, an early `return`. The compiler tracks these checks and adjusts the type it believes the variable has for every line reachable only after the check passes.

## typeof narrowing

The `typeof` operator narrows unions of primitives.

```typescript
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // value: string here
  }
  if (typeof value === "number") {
    return value.toFixed(2);     // value: number here
  }
  return value ? "true" : "false"; // value: boolean here, by elimination
}
```

By the final `return`, TypeScript has ruled out `string` and `number` through the two `if` checks, so it narrows `value` to `boolean` automatically — this is called narrowing by elimination, and it works because the original type was a closed union.

## instanceof narrowing

`instanceof` narrows based on the prototype chain, which makes it the natural tool for distinguishing class instances (including built-ins like `Error`, `Date`, `Map`).

```typescript
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
  }
}

function handle(error: Error): void {
  if (error instanceof ValidationError) {
    console.log(`Invalid field: ${error.field}`); // error: ValidationError
  } else {
    console.log(error.message); // error: Error
  }
}
```

## in narrowing

The `in` operator checks whether a property exists on an object at runtime, and TypeScript uses it to narrow unions of object shapes that don't share a common discriminant field.

```typescript
interface Cat { meow(): void }
interface Dog { bark(): void }

function makeSound(animal: Cat | Dog): void {
  if ("meow" in animal) {
    animal.meow(); // animal: Cat
  } else {
    animal.bark();  // animal: Dog
  }
}
```

## Truthiness narrowing

A plain truthiness check (`if (x)`, `if (!x)`, `x && ...`, `x ?? ...`) narrows out falsy values — `null`, `undefined`, `0`, `""`, `NaN`, `false` — from a type, which is especially common for eliminating `null`/`undefined` from an optional value.

```typescript
function greet(name?: string): string {
  if (!name) {
    return "Hello, stranger";
  }
  return `Hello, ${name.toUpperCase()}`; // name: string, undefined eliminated
}
```

Be careful with truthiness narrowing on types where a legitimate value is also falsy — `if (count)` on a `number` also filters out `0`, which is usually not what you want if `0` is a meaningful value; an explicit `count !== undefined` is safer in that case.

## Why this matters in interviews

Narrowing is the mechanism that makes union types usable in practice — without it, every access on a union member would require a manual cast. Interviewers expect you to pick the *right* narrowing tool for a given union shape: `typeof` for primitives, `instanceof` for class hierarchies, `in` for object shapes without a shared discriminant, and to know that truthiness narrowing is coarser than the other three and can accidentally exclude legitimate falsy values.
