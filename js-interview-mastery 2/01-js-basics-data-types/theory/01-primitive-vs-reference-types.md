# Primitive Types vs Reference Types

JavaScript has exactly seven primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`. Everything else — objects, arrays, functions, dates, regexes, maps, sets — is a reference type, meaning under the hood it's an `object`. This split is the single most important mental model in the language because it determines two things: how values are copied, and how they're compared.

## Value semantics vs reference semantics

Primitives are copied **by value**. When you assign a primitive to a new variable or pass it into a function, you get an independent copy.

```js
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — untouched
```

Objects (and arrays, functions) are copied **by reference**. The variable doesn't hold the object itself — it holds a pointer to a location in memory. Copying the variable copies the pointer, not the data.

```js
const obj1 = { x: 1 };
const obj2 = obj1;
obj2.x = 99;
console.log(obj1.x); // 99 — same underlying object
```

This is why `const` on an object doesn't make it immutable — `const` only prevents *reassigning the variable*, not mutating what it points to. `const obj1 = {}` forbids `obj1 = {}` later, but `obj1.x = 1` is perfectly legal.

Function arguments follow the same rule: primitives are passed by value (the function gets a copy), objects are passed "by reference value" — the reference itself is copied, so reassigning the parameter inside the function doesn't affect the caller, but mutating the object it points to does.

```js
function reassign(o) { o = { x: 'new' }; }
function mutate(o) { o.x = 'mutated'; }

const original = { x: 'old' };
reassign(original);
console.log(original.x); // 'old' — reassignment inside the function is local

mutate(original);
console.log(original.x); // 'mutated' — mutation affects the shared object
```

## Comparison table

| Aspect | Primitive (string, number, boolean, null, undefined, symbol, bigint) | Reference (object, array, function) |
|---|---|---|
| Storage | Stored directly, value copied on assignment | Stored in heap memory; variable holds a pointer to it |
| Copying | Independent copy — mutating one doesn't affect the other | Copying the variable copies the reference — both point to the same data |
| Comparison (`===`) | Compares by value | Compares by identity (same memory location), not contents |
| Mutability | Immutable — operations create new values | Mutable — properties/elements can change in place |

Use primitives for simple, self-contained data; use objects/arrays when you need structure or shared mutable state. The most common mistake is expecting `{} === {}` to be `true` because they "look the same" — it's always `false` unless it's literally the same reference. To compare object contents, use a deep-equality check (e.g. `JSON.stringify` for simple cases, or a library like lodash's `isEqual`, or the hand-rolled version in `../problems/01-deep-equal.md`).
