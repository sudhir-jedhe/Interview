# Scenario: Every Endpoint Has a Different Error Format

The frontend team complains every endpoint has a different error format, making global error handling in the UI painful. Some endpoints return `{ message: '...' }`, others `{ error: '...' }`, others just a bare string, and status codes are inconsistent for validation failures (some 400, some 422, some 500).

**Approach:**
Define one error envelope and one centralized error-handling middleware that all thrown/passed errors funnel through, plus a custom `ApiError` class so route code doesn't hand-roll response shapes.

```js
class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

app.post('/users', async (req, res, next) => {
  try {
    if (!req.body.email) throw new ApiError(400, 'MISSING_EMAIL', 'email is required');
    const user = await createUser(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
});

// single centralized handler, last middleware in the stack
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  if (status === 500) console.error(err); // log unexpected errors, not client errors
  res.status(status).json({ error: { code, message: err.message || 'Something went wrong' } });
});
```
Roll this out endpoint by endpoint if needed, but document the target shape immediately so new endpoints don't add to the inconsistency.
