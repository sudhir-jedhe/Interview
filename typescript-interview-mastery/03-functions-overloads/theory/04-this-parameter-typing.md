# Typing the `this` Parameter

JavaScript's `this` is notoriously context-dependent — its value depends on *how* a function is called, not where it's defined. TypeScript lets you declare an explicit, fake "first parameter" named `this` to pin down what `this` is expected to be inside a function, and the compiler checks call sites against it. This parameter is erased entirely at compile time — it produces no runtime parameter or argument.

## Declaring a `this` parameter

```typescript
interface CartContext {
  items: string[];
  addItem(this: CartContext, item: string): void;
}

const cart: CartContext = {
  items: [],
  addItem(this: CartContext, item: string) {
    this.items.push(item); // `this` is checked as CartContext here
  },
};

cart.addItem("SKU-001"); // ok — called with `cart` as the receiver, matching CartContext
```

If `addItem` is later called in a way that detaches it from `cart` — losing its intended `this` binding — TypeScript will flag it at the call site, not just at the point of definition:

```typescript
const detached = cart.addItem;
// detached("SKU-002");
// Error: The 'this' context of type 'void' is not assignable to method's 'this' of type 'CartContext'.
```

This is one of the few places TypeScript actually catches a classic JavaScript footgun (losing `this` when passing a method as a plain callback/reference) at compile time instead of leaving it as a runtime `undefined.items` crash.

## `this` parameters in standalone functions

A standalone function (not a method) can also declare an expected `this` type, useful for functions designed to be used with `.call()`/`.apply()` or as event handlers bound to a specific target:

```typescript
interface ButtonElement {
  disabled: boolean;
  label: string;
}

function toggleDisabled(this: ButtonElement): void {
  this.disabled = !this.disabled;
}

const button: ButtonElement = { disabled: false, label: "Submit" };
toggleDisabled.call(button); // ok — `this` matches ButtonElement

// toggleDisabled(); // Error: The 'this' context of type 'void' is not assignable...
```

Note calling `toggleDisabled()` directly (with no explicit receiver) fails to compile, since a bare call's `this` doesn't satisfy `ButtonElement` — you must use `.call()`, `.apply()`, or invoke it as a method on a matching object.

## `this` parameters don't count toward real parameters

The `this` parameter (when present) is always the very first parameter in the declaration, is always erased from the emitted JavaScript, and does not affect the function's arity — `toggleDisabled.length` is `0` at runtime, and callers never pass a `this` argument positionally; it's supplied only via the call mechanism (`.call`, `.apply`, method-call syntax, or `.bind`).

## Arrow functions cannot declare `this`

Because arrow functions lexically capture `this` from their enclosing scope (they don't have their own `this` binding at all), TypeScript disallows declaring a `this` parameter on an arrow function — it would be meaningless, since there's no dynamic receiver to type-check against.

```typescript
// const bad = (this: ButtonElement) => { /* ... */ };
// Error: An arrow function cannot have a 'this' parameter.
```

This is actually a strong argument in favor of arrow functions for callbacks where you want `this` to remain whatever the enclosing scope's `this` already is (e.g. inside a class method), and a strong argument for explicit `this` parameters on regular functions/methods where a *specific* receiver type must be enforced.
