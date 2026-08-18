// middleware/errorHandler.js — single source of truth for turning any error
// (ApiError subclass or otherwise) into a consistent JSON response.
// Must be registered LAST, after all routes.

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const isServerFault = status >= 500;

  if (isServerFault) {
    console.error(`[${req.method} ${req.originalUrl}]`, err.stack || err);
  }

  res.status(status).json({
    error: {
      code,
      message: isServerFault ? 'Something went wrong' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

module.exports = errorHandler;
