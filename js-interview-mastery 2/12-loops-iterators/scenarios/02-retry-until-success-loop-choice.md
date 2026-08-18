# Scenario: Choosing the right loop construct for a retry helper

You need a `retryUntilSuccess(fn, maxAttempts)` helper that calls a possibly-throwing synchronous function, retrying up to `maxAttempts` times, and returns the first successful result — or re-throws the last error if all attempts fail. Which loop construct fits best and why?

**Approach:**
A `for` loop with an explicit counter is the clearest fit because you need both a bounded attempt count and the ability to break out on success:

```js
function retryUntilSuccess(fn, maxAttempts) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn(); // success — exit immediately
    } catch (err) {
      lastError = err;
      console.log(`Attempt ${attempt} failed: ${err.message}`);
    }
  }
  throw lastError;
}
```
`return` inside the `try` block inside the loop is enough to exit early on success — no explicit `break` needed since we're returning from the function entirely. A `do-while` is tempting since you always want at least one attempt, but `for` is more idiomatic here because the primary variable of interest (`attempt`) is naturally a counter with a known upper bound; `do-while` would require a separately declared counter variable outside the loop, adding no real benefit.
