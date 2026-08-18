# `try`/`catch`/`finally` Mechanics

`try` runs a block of code, `catch` runs if that block throws, and `finally` runs regardless of whether an error was thrown, caught, or even if the `try` or `catch` block returns early.

```js
function test() {
  try {
    return "from try";
  } finally {
    console.log("finally runs");
  }
}
console.log(test());
// logs: "finally runs"
// logs: "from try"
```

## `finally` runs before the function actually returns

This matters more than people expect: if `finally` itself contains a `return`, it **overrides** the value from `try` or `catch`, which is a common source of bugs.

```js
function trap() {
  try {
    return 1;
  } finally {
    return 2; // silently discards the "return 1"
  }
}
trap(); // 2
```

`finally` also runs when an error propagates out uncaught (there's no `catch`), right before the error continues up the call stack. Only things like `process.exit()` or an infinite loop inside `try` will prevent it from running.

## `finally` vs. code placed after the `try`/`catch` block

| Aspect | `finally` block | Code after `try`/`catch` |
|---|---|---|
| Runs if `try`/`catch` returns early | Yes, always | No — a `return` skips it |
| Runs if an error propagates uncaught (no matching `catch`) | Yes | No — execution has already left the function |
| Typical use | Cleanup: closing files, releasing locks, hiding spinners | Normal continuation logic |

The mistake people make is putting cleanup logic after the `try`/`catch` instead of in `finally`, then being surprised the cleanup doesn't run when an early `return` or uncaught rethrow exits the function before reaching that code.
