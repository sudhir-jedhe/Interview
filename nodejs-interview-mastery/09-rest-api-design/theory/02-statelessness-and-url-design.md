# Statelessness and URL Design

## Statelessness

Every request must carry everything the server needs to process it — auth token, params, body. The server must not rely on data left over from a previous request (no server-side "current user" session tied to a TCP connection, for example). This is what allows you to horizontally scale — any server instance can handle any request.

```js
// Bad: relying on implicit server memory between requests
let currentUser; // module-level state — breaks under multiple instances/requests

// Good: identity comes from the request itself, every time
app.get('/me', authMiddleware, (req, res) => {
  res.json(req.user); // req.user was derived from the token on THIS request
});
```

## URL design

Use plural nouns, nest resources to express ownership, and push filtering/sorting/pagination into query params rather than the path:

```js
GET /users/42/orders          // orders belonging to user 42
GET /orders?status=shipped&sort=-createdAt&page=2&limit=20
```

Avoid nesting more than 2 levels deep (`/users/42/orders/7/items/3` gets unwieldy) — prefer giving deeply nested resources their own top-level route with a filter param instead (e.g. `GET /items?orderId=7`).

## Verbs don't belong in URLs — but some actions don't map cleanly to CRUD

For actions like "cancel an order" or "send a password reset email," model the action as a sub-resource you *create* rather than a verb in the path:

```js
POST /orders/7/cancellation      // preferred — a "cancellation" is a resource being created
POST /password-resets            // preferred

// avoid:
POST /orders/7/cancel
POST /sendPasswordReset
```

This keeps the URL nominal while still expressing an action-like operation. It's a common interview follow-up once someone confidently states "no verbs in URLs" — they need to know how to handle the cases that don't fit cleanly into GET/POST/PUT/PATCH/DELETE.
