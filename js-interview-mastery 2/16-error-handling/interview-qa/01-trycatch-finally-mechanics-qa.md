# Interview Q&A: try/catch/finally Mechanics

**Q: Does `finally` always run?**
Yes, with very few exceptions — it runs whether the `try` block completes normally, throws, or hits a `return`/`break`/`continue`. It only fails to run if the process itself terminates (e.g., `process.exit()`, browser tab closes, or the machine loses power) or if the `try` block never finishes (infinite loop, unresolvable await with no timeout).

**Q: If both `try` and `finally` contain a `return`, which value wins?**
The `finally` block's `return` wins, and it discards whatever value or exception was pending from `try`/`catch`. This is considered a code smell — putting a `return` inside `finally` is almost always a bug, since it silently suppresses errors.

**Q: Why doesn't `try`/`catch` catch an error thrown inside a `setTimeout` callback?**
Because the callback executes on a separate turn of the event loop, after the synchronous `try`/`catch` block has already finished running and been popped off the call stack. `catch` can only intercept exceptions thrown while control is still inside the corresponding `try` block's execution context.

**Q: Can you catch a `SyntaxError` from malformed JSON with `JSON.parse`?**
Yes — `JSON.parse` throws a synchronous `SyntaxError` on invalid input, which behaves like any other thrown error and is caught by a normal `try`/`catch` around the call.

```js
try {
  JSON.parse("{ invalid");
} catch (e) {
  console.log(e instanceof SyntaxError); // true
}
```
