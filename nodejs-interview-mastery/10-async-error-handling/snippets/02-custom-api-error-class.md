# Snippet: Custom API Error Class Carrying an HTTP Status Code

```js
class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, ApiError);
  }
}

class NotFoundError extends ApiError {
  constructor(resource) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

module.exports = { ApiError, NotFoundError };
```

**Explanation:** `ApiError` extends the built-in `Error` (so `instanceof Error` and stack traces still work) while attaching an HTTP `status` and an application-level `code` — metadata a centralized error middleware can read to build the right response without string-matching messages. `Error.captureStackTrace(this, ApiError)` excludes the `ApiError` constructor itself from the generated stack trace, keeping traces focused on where the error was actually thrown. Subclassing (`NotFoundError`) lets call sites express intent (`throw new NotFoundError('Order')`) instead of remembering status codes by hand.
