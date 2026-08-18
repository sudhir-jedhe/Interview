# Custom Error subclass with instanceof checks

```js
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

`instanceof` works correctly through the prototype chain for any depth of subclassing, letting callers branch on error type reliably instead of parsing `.message` text.
