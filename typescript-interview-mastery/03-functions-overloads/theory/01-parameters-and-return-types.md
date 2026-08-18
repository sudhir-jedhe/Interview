# Typing Function Parameters and Return Types

Functions are where most of a TypeScript codebase's type-checking value actually gets exercised — every call site is verified against the declared parameter and return types. This file covers the baseline rules before diving into optional/default/rest parameters and overloads in later files.

## Basic parameter and return typing

Every parameter needs an explicit type annotation (TypeScript does not infer parameter types from usage inside the function body); return types can usually be inferred but are worth annotating explicitly at public boundaries.

```typescript
function calculateShipping(weightKg: number, distanceKm: number): number {
  return weightKg * 0.5 + distanceKm * 0.1;
}

const cost = calculateShipping(2.5, 100); // 11.25
```

## Arrow functions and function expressions

The same annotation rules apply regardless of syntax — arrow functions, function expressions, and function declarations all require explicit parameter types unless contextually inferred (see `01-basic-types/theory/05-type-annotations-vs-inference.md`).

```typescript
const calculateTax = (amount: number, rate: number): number => amount * rate;

const formatCurrency = function (cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
};
```

## Function type expressions for variables holding functions

When a variable, parameter, or property holds a function value (rather than being a function declaration itself), you describe its type with a function type expression: `(params) => ReturnType`.

```typescript
type PriceCalculator = (basePrice: number, discountPercent: number) => number;

const applyDiscount: PriceCalculator = (basePrice, discountPercent) =>
  basePrice * (1 - discountPercent / 100);
```

Note that inside `applyDiscount`'s implementation, `basePrice` and `discountPercent` don't need their own annotations — they're contextually typed from `PriceCalculator`.

## Parameter type checking is bivariant-ish for methods, strict for standalone functions

A subtlety worth knowing: function *parameter* types are checked contravariantly in strict mode (a function expecting a wider parameter type can be used where a narrower one is expected, but not vice versa) — this matters when assigning callback functions to typed function-valued parameters. In practice, this mostly surfaces as: a callback parameter's declared type must be *at least as general* as what the calling context will actually pass, not more specific.

```typescript
type Handler = (event: { type: string; timestamp: number }) => void;

// ok: this handler's parameter type is a superset of what's required
const genericHandler: Handler = (event: { type: string; timestamp: number; extra?: unknown }) => {
  console.log(event.type);
};
```

## Return type inference vs explicit annotation

TypeScript infers a return type from every `return` statement, unioning them if there are multiple distinct types:

```typescript
function findUserId(id: number) {
  if (id <= 0) return null;
  return `user-${id}`;
}
// inferred return type: string | null
```

Explicit return type annotations become valuable specifically when: the function is part of a public API (catching accidental shape drift during refactors), the function is recursive (TypeScript sometimes cannot infer recursive return types without a hint), or you want the compiler to enforce a *narrower* return type than what the body would otherwise produce, catching a missing `return` path early.

```typescript
function parseId(raw: string): number | null {
  const n = Number(raw);
  if (Number.isNaN(n)) {
    return null;
  }
  return n;
  // If a code path fell through without returning, this annotation would
  // catch it as "not all code paths return a value" — inference alone wouldn't.
}
```
