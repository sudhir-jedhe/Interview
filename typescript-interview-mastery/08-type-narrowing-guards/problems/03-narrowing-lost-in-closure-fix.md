# Demonstrate and fix "narrowing lost inside a closure"

## Problem

The following code fails to compile. Identify why, and fix it without changing the function's externally observable behavior.

```typescript
interface CachedUser {
  id: string;
  displayName: string;
}

function logUserAfterDelay(user: CachedUser | undefined, delayMs: number): void {
  if (!user) {
    console.log("No user to log");
    return;
  }
  // user: CachedUser here

  setTimeout(() => {
    console.log(`Logging user: ${user.displayName}`); // Error: 'user' is possibly 'undefined'
  }, delayMs);
}
```

## Why it fails

`user` is a function parameter, which is a mutable binding as far as the compiler is concerned — even though this particular function never reassigns it, TypeScript's narrowing analysis can't prove that in general for every closure that might capture a mutable variable. Because the `setTimeout` callback runs at some later, indeterminate point rather than immediately after the `if` check, the compiler discards the `CachedUser` narrowing inside the callback and falls back to the parameter's original declared type, `CachedUser | undefined`.

## Fix

```typescript
function logUserAfterDelay(user: CachedUser | undefined, delayMs: number): void {
  if (!user) {
    console.log("No user to log");
    return;
  }

  const cachedUser = user; // const snapshot — narrowing now survives the closure

  setTimeout(() => {
    console.log(`Logging user: ${cachedUser.displayName}`); // ok, cachedUser: CachedUser
  }, delayMs);
}
```

## Discussion

The fix introduces zero behavioral change — `cachedUser` and `user` refer to the exact same object at the point of assignment, and since `user` was never going to be reassigned in this function anyway, the runtime output is identical before and after. What changes is purely what the compiler is able to *prove*: a `const` binding is guaranteed by the language itself to never be reassigned, so once `cachedUser` is narrowed to `CachedUser`, that fact remains true for the binding's entire lifetime, including inside any closures that capture it, no matter when those closures eventually run. This same fix generalizes to every narrowing-then-later-callback situation — `.then()`, event listeners, `requestAnimationFrame`, array callbacks defined well after a guard clause — the pattern is always "narrow, then immediately capture a `const` copy before defining anything that might run later."
