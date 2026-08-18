# How TypeScript's Inference Engine Works

TypeScript infers types without annotations by looking at how a value is *produced* and, in some cases, how it's *consumed*. These are two different mechanisms: **contextual typing** (inference driven by the expected type at a location) and **best-common-type inference** (inference driven by the shape of the values themselves, mainly for arrays and function returns).

## Contextual typing

Contextual typing flows a type *into* an expression from its surrounding context — a variable declaration's annotation, a function parameter's declared type, or an assignment target. The clearest example is callback parameters:

```typescript
window.addEventListener("click", (event) => {
  // event is inferred as MouseEvent, not `any`,
  // because addEventListener's signature says so.
  console.log(event.clientX);
});

const numbers = [1, 2, 3];
numbers.map((n) => n * 2);
// `n` is inferred as `number` from Array<number>.map's callback signature
```

Without contextual typing, `event` and `n` would need explicit annotations or fall back to `any` (in non-strict mode) or an error (under `noImplicitAny`). The context — the expected function signature — supplies the type.

Contextual typing also applies to object literals assigned to a typed variable:

```typescript
interface Point {
  x: number;
  y: number;
}

const p: Point = { x: 1, y: 2 }; // literal is checked against Point
```

## Best-common-type inference

When there's no contextual type to pull from, TypeScript falls back to inferring from the values themselves. For arrays, it computes the "best common type" — the most specific type that all elements are compatible with:

```typescript
const mixed = [1, "two", 3]; // inferred as (string | number)[]

class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

const pets = [new Dog(), new Cat()];
// inferred as (Dog | Cat)[], NOT Animal[]
// TS does not walk up to a common ancestor unless one candidate
// is a supertype of all the others.

const zoo: Animal[] = [new Dog(), new Cat()]; // contextual typing wins here
```

Note the subtlety: TypeScript does **not** search the whole inheritance chain for the least-specific common ancestor. It only picks a supertype if one of the *actual* candidate types is already a supertype of the rest. `Dog | Cat` is kept as a union rather than widened to `Animal`, because neither `Dog` nor `Cat` is a supertype of the other. If you want `Animal[]`, you must supply it as a contextual type (an annotation), as shown above.

## Return type inference

Function return types are inferred from the `return` statements in the function body, using the same best-common-type logic:

```typescript
function pickStatus(ok: boolean) {
  if (ok) return "success"; // string literal type "success"
  return "error"; // string literal type "error"
}
// inferred return type: "success" | "error"
```

This is why you often don't need to annotate simple function return types — TS derives an accurate union automatically. For recursive functions or functions with many branches, explicit annotations still help both readability and compile speed, since TS has to fully analyze the body before it can report the inferred type elsewhere.

## Why this matters in interviews

Interviewers use inference questions to check whether you understand that TypeScript's type system is not purely "bottom-up" (inferred from values) — it's a two-way street. Contextual typing pulls types in from usage sites; best-common-type inference pushes types out from literals. Confusing the two leads to surprising bugs, like assuming a `Dog | Cat` array will accept a `Bird` just because they share an `Animal` base.
