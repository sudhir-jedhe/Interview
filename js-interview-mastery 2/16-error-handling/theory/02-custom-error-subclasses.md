# Custom `Error` Subclasses

Plain `throw "something broke"` works but loses useful metadata. The convention is to throw `Error` instances (or subclasses), because they carry `message`, `name`, and `stack`.

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError"; // otherwise defaults to "Error"
    this.field = field;
    // Error.captureStackTrace(this, ValidationError) // V8-only, cleans the stack
  }
}

try {
  throw new ValidationError("Age must be positive", "age");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.name, err.message, err.field);
    // "ValidationError" "Age must be positive" "age"
  }
}
```

Key gotcha: `err.name` is just a string property, not a distinct type. Use `instanceof` to branch on error type, not string comparisons on `name`, since `name` can be reassigned or spoofed. Also note `name` isn't derived automatically from the class name — it defaults to `"Error"` unless the subclass's constructor explicitly sets `this.name`.

`err.stack` is a non-standard but universally implemented string with the message plus a call-stack trace. It's for humans/logging, not for parsing programmatically — its format differs between engines.

## `throw` a string vs. `throw` an `Error` object

| Aspect | `throw "message"` | `throw new Error("message")` |
|---|---|---|
| Stack trace | None | Has `.stack` for debugging |
| Type identification | Impossible to `instanceof` check | `instanceof Error` / custom subclass checks work |
| Tooling support | Debuggers/loggers often assume Error objects | First-class support everywhere (Sentry, console, etc.) |
| Convention | Non-idiomatic, avoid | Idiomatic in virtually all JS codebases |

Always throw `Error` (or a subclass), never a bare string or plain object. The most common mistake is throwing a string for a "quick" error and later needing a stack trace or type check that isn't there.

## `Error.prototype.cause`

Introduced in ES2022, `new Error("msg", { cause: originalError })` lets you wrap a lower-level error while preserving a reference to the original via `err.cause` — useful for logging/debugging deep call chains without losing the root cause when rethrowing a higher-level, more contextual error:

```js
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    throw new Error("Invalid config file", { cause: err });
  }
}
```

See `problems/01-custom-error-hierarchy.md` in this topic for a full worked hierarchy (`AppError` → `ValidationError`/`NotFoundError`) with status codes attached.
