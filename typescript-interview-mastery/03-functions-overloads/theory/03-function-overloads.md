# Function Overloads

Function overloading lets a single function name accept different combinations of argument types and return different, more specific types depending on which combination was used — something a single generic signature often can't express precisely. TypeScript overloads are purely a compile-time construct: you write multiple **signatures** (no body) followed by exactly one **implementation** signature (with a body) that must be general enough to handle every overload.

## Basic overload structure

```typescript
// Overload signatures (no implementation)
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: "img"): HTMLImageElement;
function createElement(tag: string): HTMLElement;

// Implementation signature (has a body, must cover every overload above)
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement("a");   // typed HTMLAnchorElement
const image = createElement("img"); // typed HTMLImageElement
const div = createElement("div");   // typed HTMLElement (falls through to the general overload)
```

Callers only ever see the overload signatures — the implementation signature is invisible from the outside and is purely there to satisfy every overload's contract internally.

## How TypeScript picks the right overload

TypeScript checks overload signatures **in the order they're declared**, from top to bottom, and uses the *first* one that matches the call site's argument types. This ordering matters: more specific overloads must come before more general ones, or the general one will "shadow" the specific ones and always match first.

```typescript
function parseValue(input: string): string;
function parseValue(input: number): number;
function parseValue(input: string | number): string | number {
  return input;
}

const a = parseValue("42");  // matches the `string` overload -> typed string
const b = parseValue(42);    // matches the `number` overload -> typed number
```

If the two specific overloads were reordered after a hypothetical `function parseValue(input: string | number): string | number;` catch-all overload, every call would match the catch-all first and always return the wide `string | number` type, defeating the purpose of overloading.

## The implementation signature is not directly callable

The implementation signature's parameter and return types are typically wider than any individual overload (it must accommodate all of them), and critically, **it is not part of the public overload set** — you cannot call the function with arguments that only match the implementation signature but no overload signature.

```typescript
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  if (typeof a === "string" && typeof b === "string") return a + b;
  if (typeof a === "number" && typeof b === "number") return a + b;
  throw new Error("Mismatched argument types");
}

combine("a", "b"); // ok — matches the string overload
combine(1, 2);       // ok — matches the number overload
// combine("a", 1); // Error: No overload matches this call
```

Even though the implementation signature technically accepts `(string | number, string | number)`, calling with a mixed `string, number` pair fails, because no *individual overload* permits mixed types — the implementation signature exists to make the body typecheck, not to expand what callers can pass.

## When overloads are the right tool

Reach for overloads when a function's return type (or the acceptable shape of later parameters) genuinely depends on which *literal* type or *shape* of an earlier argument was passed — something a union parameter type alone can't express as precisely. If the relationship between input and output can instead be captured with a single generic signature (`function identity<T>(value: T): T`), prefer generics — they're simpler to maintain and don't require keeping multiple signatures in sync. Overloads are best reserved for a small, fixed number of genuinely distinct call shapes (2-4 overloads is typical); beyond that, the maintenance burden of keeping every overload and the implementation signature consistent usually outweighs the precision gained.
