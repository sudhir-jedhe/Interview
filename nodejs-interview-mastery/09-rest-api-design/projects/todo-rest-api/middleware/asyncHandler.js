// middleware/asyncHandler.js — forwards rejected promises from async route
// handlers to next(err), since Express 4 does not do this automatically.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
