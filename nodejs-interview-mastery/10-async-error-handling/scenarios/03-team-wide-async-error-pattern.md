# Scenario: Making Correct Async Error Handling the Path of Least Resistance

Code reviews keep catching the same missing try/catch bug in new PRs. You want to make the correct pattern the path of least resistance for every new engineer on the team.

**Approach:**
Ship a small `asyncHandler` utility and a custom `ApiError` hierarchy as part of the team's shared boilerplate/starter template, and add a lint rule or PR checklist item enforcing that async route handlers are always wrapped.

```js
// utils/asyncHandler.js
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// utils/errors.js
class ApiError extends Error {
  constructor(status, message, code = 'API_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
class BadRequestError extends ApiError {
  constructor(message) { super(400, message, 'BAD_REQUEST'); }
}
class NotFoundError extends ApiError {
  constructor(resource) { super(404, `${resource} not found`, 'NOT_FOUND'); }
}
module.exports = { ApiError, BadRequestError, NotFoundError };

// routes/orders.js
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/errors');

router.get('/orders/:id', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError('Order');
  res.json({ data: order });
}));
```
Document the pattern in the repo's contributing guide and add a code-review checklist line: "every async route is wrapped in asyncHandler or has its own try/catch."
