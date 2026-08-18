# Problem 3: Implement `assertIsDefined<T>`

## The setup

Your codebase has dozens of scattered `!` non-null assertions like `user!.id`, `cache.get(key)!`, and `ref.current!.focus()`. None of them have any runtime protection, and a recent production incident was caused by exactly this pattern — a value that was assumed to be present, wasn't, and the resulting crash had a stack trace pointing at an unrelated line because the `!` gave no diagnostic information.

## Your task

Implement a reusable `assertIsDefined<T>` function using a TypeScript assertion signature (`asserts val is NonNullable<T>`) that:
1. Throws a clear, descriptive `Error` if the value is `null` or `undefined`.
2. Narrows the value's type for all code *after* the call, without requiring an `if` block or a return value.

Then refactor one `!`-based call site to use it.

## Reference solution

```typescript
function assertIsDefined<T>(
  val: T,
  message = "Expected value to be defined, but received null/undefined"
): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(message);
  }
}
```

The `asserts val is NonNullable<T>` return-position annotation is a TypeScript assertion signature: it tells the compiler that after this function returns normally (i.e., doesn't throw), the argument passed as `val` can be narrowed to `NonNullable<T>` in the *calling* scope, exactly as if you'd written `if (val === null || val === undefined) throw ...` inline. This is what lets it replace `!` — the compiler applies the same narrowing, but backed by an actual runtime check with a real error message.

**Before (unsafe, no diagnostic):**

```typescript
function getUserOrThrow(id: string): User {
  const user = userCache.get(id);
  return user!; // if this is wrong, crash happens wherever `.name` etc. is accessed later
}
```

**After (safe, self-documenting, fails at the actual point of failure):**

```typescript
function getUserOrThrow(id: string): User {
  const user = userCache.get(id);
  assertIsDefined(user, `No cached user found for id="${id}"`);
  return user; // narrowed to User here — no `!` needed, TS trusts the assertion signature
}
```

If `userCache.get(id)` returns `undefined`, this now throws immediately at the call site with a message that names the missing `id`, instead of deferring the failure to wherever the caller eventually dereferences a property on `undefined`. This is strictly more debuggable than `!`, costs one extra line, and is trivially greppable (`grep -r assertIsDefined`) to audit every place the codebase is making a "this had better not be null" claim — something that's much harder to do reliably for bare `!` operators scattered through expressions.

**A companion for optional-chaining-style single expressions** (useful when you don't want a full statement):

```typescript
function definedOrThrow<T>(val: T, message?: string): NonNullable<T> {
  assertIsDefined(val, message);
  return val;
}

// usage inline: definedOrThrow(cache.get(key), "cache miss").focus();
```
