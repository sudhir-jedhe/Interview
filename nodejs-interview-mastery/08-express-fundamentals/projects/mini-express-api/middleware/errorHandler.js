'use strict';

/**
 * A typed application error carrying its own HTTP status code, so route
 * handlers can throw/next() a specific, catchable error type instead of
 * every failure collapsing into a generic 500.
 */
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * catchAsync wraps an async route handler so a rejected promise is forwarded
 * to next(err) instead of becoming an unhandled rejection that leaves the
 * request hanging. This is the standard Express 4 fix for the fact that
 * Express 4 does NOT automatically catch rejected promises from async
 * handlers (Express 5 does this automatically; this wrapper keeps the app
 * working correctly on Express 4 without touching every single handler).
 */
function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler — registered after all real routes, before the error handler.
 * Only reached if nothing earlier in the stack matched or responded.
 */
function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

/**
 * Centralized error-handling middleware — must be registered last (4-arg
 * signature is how Express recognizes it as an error handler at all).
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err.stack || err);
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = { HttpError, catchAsync, notFoundHandler, errorHandler };
