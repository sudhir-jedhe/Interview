# Type Annotations vs Type Inference

TypeScript can figure out most types on its own by looking at how a value is initialized — this is **inference**. **Annotation** is you explicitly writing `: Type` to tell the compiler what a value should be. Knowing when each is appropriate (and when skipping an annotation is a mistake) is a strong signal of TypeScript fluency.

## Let inference do the work for local variables

```typescript
// Annotation is redundant here — TS already infers `string`
const name: string = "Sudhir"; // unnecessary
const name2 = "Sudhir";        // preferred — inferred as `string`

let count = 0;        // inferred as `number`
count = "zero";        // Error: Type 'string' is not assignable to type 'number'
```

Over-annotating obvious literals adds noise without adding safety — the compiler already proves the same fact from the initializer. Idiomatic TypeScript omits annotations wherever inference produces the exact type you want.

## When annotation is required: uninitialized variables

If a variable is declared without an initial value, TypeScript can't infer anything — it falls back to `any` (or, under `noImplicitAny`, raises an error). Annotate explicitly:

```typescript
let userId: number;      // must annotate; no initializer to infer from
userId = 1024;

function loadCache() {
  let result;             // inferred as `any` — dangerous
  // ... assigned later in a branch
}
```

## When annotation is required: function parameters

TypeScript never infers function parameter types from usage inside the function body — only from context when the function is used as a callback matching an expected signature (contextual typing, see below). A standalone function's parameters must be annotated, or they silently become `any` under non-strict settings and are flagged as errors under `noImplicitAny`.

```typescript
function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}
```

## Function return types: usually inferred, sometimes annotated deliberately

TypeScript infers a function's return type from its `return` statements. Explicit return type annotations are optional but valuable in two situations: (1) public API boundaries, where you want the compiler to flag a change to the function body that accidentally alters what it returns, and (2) recursive functions, where TS cannot always infer the return type without help.

```typescript
// Inferred return type: `{ id: number; total: number }`
function buildOrder(id: number, total: number) {
  return { id, total };
}

// Explicit annotation catches accidental shape drift during refactors
function buildOrderSafe(id: number, total: number): { id: number; total: number; currency: string } {
  return { id, total, currency: "USD" }; // if you forget `currency`, this errors immediately
}
```

## Contextual typing: inference flows from expected type to the value

When a value is used somewhere TypeScript already knows the expected type — a callback parameter, an array literal assigned to a typed variable, an object literal assigned to an interface — TypeScript infers the value's type *from that context*, including inferring callback parameter types without annotation.

```typescript
const numbers: number[] = [1, 2, 3];

// `n` is inferred as `number` because `.map` on `number[]` expects `(value: number) => U`
const doubled = numbers.map((n) => n * 2);

window.addEventListener("keydown", (event) => {
  // `event` is inferred as `KeyboardEvent` from the "keydown" event name overload
  console.log(event.key);
});
```

## The practical rule

Annotate: exported/public function signatures, module boundaries, uninitialized variables, and anywhere inference would produce a wider type than you want (see widening/narrowing in `output-based/`). Skip annotation: local variables with obvious initializers, and callback parameters that TypeScript can contextually infer. The goal isn't "annotate everything" or "annotate nothing" — it's using inference where it's reliable and annotation where it adds a real safety boundary.
