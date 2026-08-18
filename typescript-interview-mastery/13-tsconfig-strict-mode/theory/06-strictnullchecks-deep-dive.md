# Why `strictNullChecks` Alone Eliminates a Huge Class of Bugs

If you can only enable one flag from the `strict` family on a legacy codebase, `strictNullChecks` delivers the largest single reduction in runtime crashes, because "cannot read property of null/undefined" is empirically the single most common runtime error in JavaScript codebases — and it's precisely the class of error this flag targets.

## What changes when it's on

Without `strictNullChecks`, `null` and `undefined` are treated as valid values of *every* type — they're silently assignable anywhere, and the compiler never asks you to check for them:

```typescript
// strictNullChecks: false
function getUser(id: string): User {
  return users.find((u) => u.id === id); // Array.prototype.find returns User | undefined!
}
// No error here, even though find() can genuinely return undefined.

const user = getUser("missing-id");
console.log(user.name); // compiles fine, crashes at runtime
```

With `strictNullChecks: true`, the true return type of `Array.prototype.find` — `User | undefined` — is enforced, and the function's declared return type `User` no longer matches:

```typescript
// strictNullChecks: true
function getUser(id: string): User {
  return users.find((u) => u.id === id);
  // Error: Type 'User | undefined' is not assignable to type 'User'
}
```

This forces you to confront the possibility of "not found" at the exact point where it's introduced, rather than letting it silently propagate:

```typescript
function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

const user = getUser("missing-id");
if (!user) {
  throw new Error(`User not found: missing-id`);
}
console.log(user.name); // TS knows `user` is `User` here — narrowed by the guard
```

## A concrete production bug this catches

Consider an e-commerce cart total calculation:

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  discount?: number; // not every item has a discount
}

function itemTotal(item: CartItem, unitPrice: number): number {
  return unitPrice * item.quantity * (1 - item.discount);
  //                                       ^^^^^^^^^^^^^^
  // strictNullChecks: false -> compiles. item.discount can be `undefined`,
  // and `1 - undefined` evaluates to NaN at runtime, silently corrupting
  // the whole cart total with no error or exception -- just wrong numbers.
}
```

With `strictNullChecks: true`, `item.discount` has type `number | undefined`, and `1 - item.discount` fails to compile (`The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type`), forcing an explicit default:

```typescript
function itemTotal(item: CartItem, unitPrice: number): number {
  return unitPrice * item.quantity * (1 - (item.discount ?? 0));
}
```

This is a particularly dangerous class of bug *without* `strictNullChecks`, because it doesn't throw — it silently produces `NaN`, which can propagate through further arithmetic (`total + NaN = NaN`) and corrupt an entire order total without any error surfacing until a customer or support ticket notices the final price is wrong.

## Why it's disproportionately valuable

Most other `strict` sub-flags catch localized issues (an untyped parameter, a class field never initialized). `strictNullChecks` changes the fundamental meaning of *every* type in the codebase — `string` genuinely means "always a string," not "a string, or possibly null, depending on where it came from" — which forces every function boundary, every array operation, every optional property access to be explicit about the possibility of absence. That's why teams migrating a large legacy codebase to strict mode typically find `strictNullChecks` surfaces the most (and most severe) latent bugs of any single flag, and why interviewers consider it the flag most worth understanding deeply rather than just knowing it exists.
