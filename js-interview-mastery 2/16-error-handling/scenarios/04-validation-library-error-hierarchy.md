**You're writing a form validation library used by other teams. Validators can throw for many different reasons (missing field, wrong type, custom business rule). How do you design the error types so consumers can handle specific cases without fragile string matching?**

**Approach:**
Define a small hierarchy of custom `Error` subclasses with a stable `name`/`code`, so callers can branch with `instanceof` or a `code` property instead of parsing `message` text (which is for humans and may change wording).

```js
class ValidationError extends Error {
  constructor(message, code, field) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
    this.field = field;
  }
}

class RequiredFieldError extends ValidationError {
  constructor(field) {
    super(`${field} is required`, "REQUIRED_FIELD", field);
    this.name = "RequiredFieldError";
  }
}

function validateAge(value) {
  if (value == null) throw new RequiredFieldError("age");
  if (typeof value !== "number") {
    throw new ValidationError("age must be a number", "WRONG_TYPE", "age");
  }
}

try {
  validateAge(null);
} catch (err) {
  if (err instanceof RequiredFieldError) {
    console.log(`Please fill in ${err.field}`);
  } else if (err instanceof ValidationError) {
    console.log(`Invalid value for ${err.field}: ${err.code}`);
  } else {
    throw err; // not ours, don't swallow unknown errors
  }
}
```
See `problems/01-custom-error-hierarchy.md` for a further-developed version of this same idea, generalized into a reusable `AppError` base class with HTTP status codes attached.
