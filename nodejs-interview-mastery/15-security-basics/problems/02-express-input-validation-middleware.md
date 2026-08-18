# Problem: Input Validation/Sanitization Middleware for an Express Route

## Problem statement

Implement a reusable Express middleware factory, `validateBody(schema)`, that validates `req.body` against a `zod` schema before the route handler runs, and a separate `sanitizeBio` helper that strips dangerous HTML from freeform text fields (defense-in-depth alongside output escaping).

## Requirements

- `validateBody(schema)` returns Express middleware that: parses `req.body` against the given `zod` schema, responds `400` with a structured error list if validation fails, and otherwise replaces `req.body` with the *parsed* (type-coerced, stripped-of-unknown-keys) value before calling `next()`.
- Apply it to a `POST /signup` route requiring `email` (valid email), `password` (min 8 chars), and an optional `bio` (string, max 500 chars).
- Add a separate `sanitizeBio` step that strips `<script>` tags and other HTML from the `bio` field specifically, since validation alone ("is this a string under 500 chars") doesn't stop a stored-XSS payload from being saved.
- The middleware must be schema-agnostic (reusable for other routes with different schemas), not hardcoded to the signup shape.

## Solution

```js
// validate-body.js
const { z } = require('zod');

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req.body = result.data; // parsed value: coerced types, unknown keys stripped
    next();
  };
}

module.exports = { validateBody };
```

```js
// sanitize.js
// Minimal HTML-stripping sanitizer for freeform text fields (a real project would
// use a maintained library like `sanitize-html` — this shows the underlying idea).
function stripHtmlTags(input) {
  return input.replace(/<[^>]*>/g, '');
}

function sanitizeBio(req, res, next) {
  if (typeof req.body.bio === 'string') {
    req.body.bio = stripHtmlTags(req.body.bio);
  }
  next();
}

module.exports = { sanitizeBio };
```

```js
// server.js
const express = require('express');
const { z } = require('zod');
const { validateBody } = require('./validate-body');
const { sanitizeBio } = require('./sanitize');

const app = express();
app.use(express.json());

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().max(500).optional(),
});

app.post('/signup', validateBody(signupSchema), sanitizeBio, (req, res) => {
  // req.body is now guaranteed to match signupSchema's shape, and bio (if present)
  // has had HTML tags stripped — safe to persist and later render.
  res.status(201).json({ ok: true, user: { email: req.body.email, bio: req.body.bio } });
});

module.exports = app;
```

```js
// example requests
// POST /signup { "email": "not-an-email", "password": "short" }
// -> 400 { error: 'Validation failed', issues: [{ path: 'email', message: 'Invalid email' }, { path: 'password', message: 'String must contain at least 8 character(s)' }] }

// POST /signup { "email": "a@b.com", "password": "longenoughpassword", "bio": "hi <script>alert(1)</script>" }
// -> 201 { ok: true, user: { email: 'a@b.com', bio: 'hi alert(1)' } }
```

**How it works:** `validateBody` is a middleware *factory* — it takes any `zod` schema and returns middleware bound to that schema, making it reusable across every route in the app rather than duplicating validation logic per handler. On failure it responds with a structured `400` listing every validation issue (not just the first), matching the fail-loud-and-clear philosophy used for config validation elsewhere in this repo. On success, it deliberately reassigns `req.body` to the *parsed* result rather than leaving the original — `zod`'s parsed output strips unknown keys and applies any schema-level coercions, so downstream code only ever sees the exact shape the schema describes. `sanitizeBio` runs as a separate step after validation specifically because validation (a string under 500 characters) says nothing about whether that string is safe to render as HTML later — sanitization is a distinct concern handled distinctly.
