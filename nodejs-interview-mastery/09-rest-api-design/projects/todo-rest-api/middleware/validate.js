// middleware/validate.js — generic Zod-schema validation middleware factory.

const { ValidationError } = require('../errors');

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError('Invalid request body', result.error.issues));
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
