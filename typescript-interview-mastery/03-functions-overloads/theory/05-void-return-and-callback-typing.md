# `void` Return Semantics and Callback Typing

Two closely related topics: how `void` return types behave when a function is used *as a callback* (a genuinely surprising TypeScript rule), and the general pattern for typing a parameter that itself accepts a function.

## Typing a function parameter

The general syntax for "this parameter is itself a function" is a function type expression in the parameter position:

```typescript
function processItems(items: string[], onEach: (item: string, index: number) => void): void {
  items.forEach((item, index) => onEach(item, index));
}

processItems(["a", "b", "c"], (item, index) => {
  console.log(`${index}: ${item}`);
});
```

For reusable or more complex callback shapes, name the callback type separately for readability:

```typescript
type ItemVisitor = (item: string, index: number) => void;

function processItemsNamed(items: string[], onEach: ItemVisitor): void {
  items.forEach(onEach);
}
```

## Generic callback parameters

When a function should work with any element type, parameterize the callback with a generic:

```typescript
function mapItems<T, U>(items: T[], transform: (item: T) => U): U[] {
  return items.map(transform);
}

const lengths = mapItems(["a", "bb", "ccc"], (s) => s.length); // number[]
```

## The `void` callback rule: return values are allowed and ignored

This is the single most surprising rule in this area, and worth internalizing precisely: if a callback *parameter's type* specifies a `void` return, TypeScript allows you to pass in a function that actually returns a real value — the return value is simply not used, and no error is raised.

```typescript
const numbers: number[] = [];

function fillWith(count: number, generator: () => void): void {
  for (let i = 0; i < count; i++) {
    generator();
  }
}

// Array.push returns the new length (a number), but that's fine here —
// `generator`'s contract only requires "call it," not "return nothing."
fillWith(3, () => numbers.push(Math.random()));
```

This exists specifically so idiomatic array-mutation one-liners (`arr.forEach(x => otherArr.push(x))`) work as `void`-typed callbacks without a wrapping arrow-function body (`x => { otherArr.push(x); }`) just to discard the return value. Contrast this with a variable *explicitly annotated* `: void` (not a callback parameter) — assigning a function that returns something to a plain `void`-typed variable directly follows normal rules; the leniency is specifically about the *call itself* being permitted, not about `void` becoming "anything goes" everywhere.

## Callback typed to reject async functions accidentally

A common real bug: passing an `async` function (which always returns `Promise<void>`, not `void`) where a synchronous `void`-returning callback was expected. TypeScript's `void`-callback leniency actually *permits* this, because `Promise<void>` is a "value" being returned and silently discarded — which can hide unhandled promise rejections.

```typescript
function forEachItem(items: string[], callback: (item: string) => void): void {
  items.forEach(callback);
}

// Compiles fine, but the returned Promise is discarded — a rejection here is unhandled!
forEachItem(["a", "b"], async (item) => {
  await fetch(`/api/log?item=${item}`);
});
```

This is a well-known real-world footgun: the type system's `void`-callback leniency, which is usually convenient, actively hides a genuine bug class (fire-and-forget async callbacks with unhandled rejections). The fix is either explicitly typing the callback parameter as `(item: string) => void | Promise<void>` and handling both cases inside the implementation, or using ESLint rules (`no-misused-promises`) that catch this pattern beyond what the type checker alone will flag.
