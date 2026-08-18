// middleware/requireAuth.js — verifies a JWT access token and attaches the
// authenticated identity to req.user. Must run before any authorization
// middleware (e.g. requireRole) that inspects req.user.

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { message: 'Missing token' } });
  }

  try {
    // explicitly pin the algorithm — never let the token dictate how it's verified
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me', {
      algorithms: ['HS256'],
    });
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: { message } });
  }
}

// authorization layered on top of authentication — 403, not 401, since the
// request IS authenticated, just insufficiently privileged
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: 'Not authenticated' } });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Insufficient permissions' } });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
