# Problem: Role-Based Authorization Middleware (e.g. requireRole('admin'))

## Problem statement

Implement a reusable `requireRole` middleware factory that authorizes a request based on the authenticated user's role, supporting both a single required role and a list of acceptable roles, plus a role-hierarchy variant where higher roles automatically satisfy lower requirements.

## Requirements

- `requireRole('admin')` — only `admin` passes
- `requireRole('admin', 'moderator')` — either role passes
- Must run after authentication middleware (`req.user` must already be populated) and return `401` defensively if it isn't
- Return `403` (not `401`) when authenticated but insufficient role
- Bonus: support a role hierarchy so `admin` automatically satisfies a `moderator` requirement without listing every role explicitly at every route

## Worked solution

```js
// middleware/requireRole.js

// higher index = more privileged; each role implicitly includes everything below it
const ROLE_HIERARCHY = ['guest', 'user', 'moderator', 'admin'];

function hasSufficientRole(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  if (userLevel === -1 || requiredLevel === -1) return false; // unknown role — fail closed
  return userLevel >= requiredLevel;
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Not authenticated' } });
    }

    const isAllowed = allowedRoles.some((role) => hasSufficientRole(req.user.role, role));
    if (!isAllowed) {
      return res.status(403).json({ error: { message: 'Insufficient permissions' } });
    }

    next();
  };
}

module.exports = requireRole;
```

```js
// routes/admin.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');

// only 'moderator' or above (moderator, admin) can access
router.delete('/comments/:id', authenticate, requireRole('moderator'), (req, res) => {
  deleteComment(req.params.id);
  res.status(204).end();
});

// only 'admin' can access — moderator is NOT sufficient here
router.delete('/users/:id', authenticate, requireRole('admin'), (req, res) => {
  deleteUser(req.params.id);
  res.status(204).end();
});

module.exports = router;
```

```js
// example: a moderator hitting the admin-only route
// req.user = { id: 7, role: 'moderator' }
// hasSufficientRole('moderator', 'admin') -> ROLE_HIERARCHY.indexOf('moderator') = 2, indexOf('admin') = 3
// 2 >= 3 is false -> 403 Forbidden, correctly rejected
```

**Why fail closed on an unknown role:** `hasSufficientRole` returns `false` if either role isn't found in `ROLE_HIERARCHY` (`indexOf` returns `-1`), rather than, say, treating an unrecognized role as automatically privileged. This matters if a user record ever ends up with a typo'd or stale role value (e.g. a role that was renamed in code but not migrated in the database) — the middleware denies access by default rather than accidentally granting it, which is the correct failure direction for an authorization check.
