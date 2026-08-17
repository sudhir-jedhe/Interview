# Snippets: Error Handling

```js
// 1. finally always runs, even after a return in try
function f() {
  try {
    return "try";
  } finally {
    console.log("cleanup");
  }
}
f();
// logs: "cleanup"
// returns: "try"
```

```js
// 2. finally with its own return silently overrides try/catch's return
function g() {
  try {
    throw new Error("fail");
  } catch (e) {
    return "caught";
  } finally {
    return "overridden";
  }
}
console.log(g());
// "overridden" -- the error and the "caught" return are both discarded
```

```js
// 3. Custom Error subclass with instanceof checks
class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

try {
  throw new NotFoundError("User");
} catch (err) {
  console.log(err instanceof NotFoundError, err instanceof Error);
  // true true
  console.log(err.message, err.statusCode);
  // "User not found" 404
}
```

```js
// 4. try/catch does NOT catch errors thrown asynchronously in a callback
try {
  setTimeout(() => {
    throw new Error("async boom");
  }, 0);
  console.log("try block finished");
} catch (e) {
  console.log("this never logs");
}
// logs: "try block finished"
// then, later: Uncaught Error: async boom (outside any catch)
```

```js
// 5. await lets try/catch work across an async boundary
async function risky() {
  throw new Error("thrown inside async fn");
}

async function main() {
  try {
    await risky();
  } catch (e) {
    console.log("caught:", e.message);
  }
}
main();
// logs: "caught: thrown inside async fn"
```

```js
// 6. An unhandled rejection vs. a handled one
Promise.reject(new Error("unhandled")); // triggers unhandledrejection

Promise.reject(new Error("handled")).catch(e => {
  console.log("caught:", e.message);
});
// logs: "caught: handled"
// separately (order not guaranteed relative to the above): unhandledrejection event fires for the first
```

```js
// 7. Re-throwing after partial handling (logging + rethrow)
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log("logging for diagnostics:", err.message);
    throw new Error("Invalid config file", { cause: err }); // Error cause chaining (ES2022)
  }
}

try {
  parseConfig("{ bad json");
} catch (e) {
  console.log(e.message, "->", e.cause.message);
  // "Invalid config file" -> "Unexpected token b in JSON at position 2" (message varies by engine)
}
```
