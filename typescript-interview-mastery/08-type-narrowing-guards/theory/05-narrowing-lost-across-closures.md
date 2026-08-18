# Narrowing Pitfall: Lost Across a Callback Boundary

Narrowing is a purely local, static analysis performed by the compiler as it reads your code top to bottom within one function. It does not track whether a value could be *reassigned* by code that runs later, asynchronously, or through a different execution path — and this creates a specific, well-known gotcha: narrowing a `let` variable, then referencing it inside a callback defined afterward, does not preserve the narrowed type.

## The pitfall

```typescript
function processUser(user: { name: string } | undefined) {
  if (!user) return;
  // user: { name: string } here — narrowed, undefined eliminated

  setTimeout(() => {
    console.log(user.name); // Error: 'user' is possibly 'undefined'
  }, 1000);
}
```

This looks wrong at first glance — the `if (!user) return;` guard clearly runs before the `setTimeout` callback is even scheduled, so intuitively `user` should still be narrowed inside the callback. But TypeScript rejects `user.name` anyway.

## Why the compiler can't trust it

The reason is that `user` is a `let`-like mutable binding (a function parameter, in this case, which is mutable unless marked otherwise) captured by a closure. Between the moment the `if` check narrows `user` and the moment the `setTimeout` callback actually executes, TypeScript cannot prove nothing else reassigned `user` — even though *in this example* nothing does. The compiler's soundness rule is conservative: any variable that could theoretically be reassigned before a closure runs loses its narrowed type inside that closure, because the analysis that proved the narrowing was only valid for the synchronous code path leading up to the closure's *definition*, not for whatever code executes at the point the closure actually *runs*.

```typescript
function processUser2(user: { name: string } | undefined) {
  if (!user) return;
  user = undefined; // legal, since `user` is a mutable parameter
  setTimeout(() => {
    console.log(user?.name); // if this compiled without a check, it would now crash
  }, 1000);
}
```

The compiler has no way to distinguish `processUser` (which never reassigns `user`) from `processUser2` (which does) just by looking at the closure in isolation — so it conservatively rejects the narrowed access in both.

## The fix: capture a `const` copy

The standard fix is to assign the narrowed value to a new `const` binding right after the narrowing check — a `const` can never be reassigned, so the compiler can safely trust that its narrowed type holds for as long as the binding exists, including inside any closures that capture it.

```typescript
function processUser3(user: { name: string } | undefined) {
  if (!user) return;
  const narrowedUser = user; // const — cannot be reassigned, narrowing is now durable

  setTimeout(() => {
    console.log(narrowedUser.name); // ok — narrowedUser: { name: string }
  }, 1000);
}
```

This same fix pattern applies to any narrowing-then-closure scenario: array callbacks (`.map`, `.filter`), promise callbacks (`.then`), event handlers, or any function defined and invoked later than the narrowing check.

## Why this matters in interviews

This is a genuinely common real-world bug, not just a trivia question — async code that narrows a value and then uses it inside a `.then()` or `setTimeout` callback is everywhere in production code, and the compile error can be confusing if you don't know why it's happening. Being able to explain that narrowing doesn't survive into closures over mutable bindings, and that the fix is capturing a `const` snapshot, is a strong, concrete signal of hands-on TypeScript experience rather than textbook knowledge only.
